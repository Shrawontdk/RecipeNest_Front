package com.cafeManagement.serviceImpl;

import com.cafeManagement.JWT.JwtFilter;
import com.cafeManagement.JWT.JwtUtil;
import com.cafeManagement.POJO.User;
import com.cafeManagement.constents.CafeConstants;
import com.cafeManagement.dao.UserDao;
import com.cafeManagement.service.UserService;
import com.cafeManagement.utils.CafeUtils;
import com.cafeManagement.utils.EmailUtils;
import com.cafeManagement.wrapper.UserDto;
import jakarta.mail.MessagingException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import jakarta.annotation.PostConstruct;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;

@Slf4j
@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserDao userDao;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private JwtFilter jwtFilter;

    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private EmailUtils emailUtils;

    @Autowired
    private FileStorageService fileStorageService;

    @PostConstruct
    public void createDefaultAdmin() {
        try {
            User existingAdmin = userDao.findByEmailId("admin@cafe.com");

            if (existingAdmin == null) {
                User admin = new User();
                admin.setName("Admin");
                admin.setEmail("admin@cafe.com");
                admin.setContactNumber("1234567890");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setStatus("true");
                admin.setRole("admin");

                userDao.save(admin);
                log.info("Default admin created successfully");
            }
        } catch (Exception ex) {
            log.error("Error creating default admin", ex);
        }
    }

    @Override
    public ResponseEntity<String> signUp(Map<String, String> requestMap) {
        log.info("Inside SignUp {}", requestMap);
        try {
            if (validateSignUp(requestMap)) {
                User user = userDao.findByEmailId(requestMap.get("email"));
                if (Objects.isNull(user)) {
                    userDao.save(getUserFromMap(requestMap));
                    return CafeUtils.getResponseEntity("Successfully Registered", HttpStatus.OK);
                } else {
                    return CafeUtils.getResponseEntity("Email already Exists", HttpStatus.BAD_REQUEST);
                }
            } else {
                return CafeUtils.getResponseEntity(CafeConstants.INVALID_DATA, HttpStatus.BAD_REQUEST);
            }
        } catch (Exception ex) {
            log.error("Exception in signUp: ", ex);
            return CafeUtils.getResponseEntity(CafeConstants.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<String> login(Map<String, String> requestMap) {
        log.info("Inside Login");
        try {
            Authentication auth = authenticate(new UsernamePasswordAuthenticationToken(requestMap.get("email"), requestMap.get("password")));

            if (auth.isAuthenticated()) {
                User user = (User) auth.getPrincipal();
                if (user.getStatus().equalsIgnoreCase("true")) {
                    String token = jwtUtil.generateToken(user.getEmail(), user.getRole());
                    return new ResponseEntity<>("{\"token\":\"" + token + "\"}", HttpStatus.OK);
                } else {
                    return new ResponseEntity<>("{\"message\":\"Wait for admin approval.\"}", HttpStatus.BAD_REQUEST);
                }
            }
        } catch (AuthenticationException ex) {
            log.error("Authentication failed for email: {}", requestMap.get("email"), ex);
        }
        return new ResponseEntity<>("{\"message\":\"Bad Credentials.\"}", HttpStatus.BAD_REQUEST);
    }

    @Override
    public ResponseEntity<List<UserDto>> getAllUser() {
        try {
            if (jwtFilter.isAdmin()) {
                return new ResponseEntity<>(userDao.getAllUser(), HttpStatus.OK);
            } else {
                return new ResponseEntity<>(new ArrayList<>(), HttpStatus.UNAUTHORIZED);
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return new ResponseEntity<>(new ArrayList<>(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    public ResponseEntity<String> updateUser(Map<String, String> requestMap) {
        try {
            if (jwtFilter.isAdmin()) {
                Optional<User> optional = userDao.findById(Integer.parseInt(requestMap.get("id")));
                if (!optional.isEmpty()) {
                    userDao.updateStatus(requestMap.get("status"), Integer.parseInt(requestMap.get("id")));
                    sendMailToAdmin(requestMap.get("status"), optional.get().getEmail(), userDao.getAllAdmin());
                    return CafeUtils.getResponseEntity("User status updated successfully.", HttpStatus.OK);
                } else {
                    return CafeUtils.getResponseEntity("User id doesn't exist.", HttpStatus.OK);
                }
            } else {
                return CafeUtils.getResponseEntity(CafeConstants.UNAUTHORIZED_ACCESS, HttpStatus.UNAUTHORIZED);
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return CafeUtils.getResponseEntity(CafeConstants.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    public ResponseEntity<String> checkToken() {
        return CafeUtils.getResponseEntity("true", HttpStatus.OK);
    }

    @Override
    public ResponseEntity<String> changePassword(Map<String, String> requestMap) {
        try {
            User userObj = userDao.findByEmail(jwtFilter.getCurrentUser());
            if (userObj != null) {
                if (passwordEncoder.matches(requestMap.get("oldPassword"), userObj.getPassword())) {
                    userObj.setPassword(requestMap.get("newPassword"));
                    userDao.save(userObj);
                    return CafeUtils.getResponseEntity("Password updated successfully", HttpStatus.OK);
                }
                return CafeUtils.getResponseEntity("Incorrect Old Password", HttpStatus.BAD_REQUEST);
            }
            return CafeUtils.getResponseEntity(CafeConstants.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return CafeUtils.getResponseEntity(CafeConstants.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    public ResponseEntity<String> forgotPassword(Map<String, String> requestMap) {
        try {
            User user = userDao.findByEmail(requestMap.get("email"));
            if (!Objects.isNull(user) && user.getEmail() != null && !user.getEmail().isEmpty()) {
                try {
                    emailUtils.forgotMail(user.getEmail(), "Credentials by Cafe Management System", user.getPassword());
                    return CafeUtils.getResponseEntity("Check your mail for credentials.", HttpStatus.OK);
                } catch (MessagingException e) {
                    log.error("Failed to send email", e);
                    return CafeUtils.getResponseEntity("Failed to send email. Please try again later.",
                            HttpStatus.INTERNAL_SERVER_ERROR);
                }
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return CafeUtils.getResponseEntity(CafeConstants.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    private void sendMailToAdmin(String status, String user, List<String> allAdmin) {
        allAdmin.remove(jwtFilter.getCurrentUser());
        if (status != null && status.equalsIgnoreCase("true")) {
            emailUtils.sendSimpleMessage(jwtFilter.getCurrentUser(), "Account approved", "USER:-" + user + "\n is approved by \n ADMIN:-" + jwtFilter.getCurrentUser(), allAdmin);
        } else {
            emailUtils.sendSimpleMessage(jwtFilter.getCurrentUser(), "Account disabled", "USER:-" + user + "\n is disabled by \n ADMIN:-" + jwtFilter.getCurrentUser(), allAdmin);
        }
    }

    private boolean validateSignUp(Map<String, String> requestMap) {
        return requestMap.containsKey("name") && requestMap.containsKey("contactNumber") && requestMap.containsKey("email") && requestMap.containsKey("password");
    }

    private User getUserFromMap(Map<String, String> requestMap) {
        User user = new User();
        user.setName(requestMap.get("name"));
        user.setContactNumber(requestMap.get("contactNumber"));
        user.setEmail(requestMap.get("email"));
        user.setPassword(passwordEncoder.encode(requestMap.get("password")));
        user.setStatus("true");
        user.setRole("user");
        return user;
    }

    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        log.info("Attempting authentication for email: {}", authentication.getPrincipal());
        try {
            String email = authentication.getName();
            String password = authentication.getCredentials().toString();

            User user = userDao.findByEmailId(email);
            if (user != null && passwordEncoder.matches(password, user.getPassword())) {
                List<GrantedAuthority> authorities = Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRole().toUpperCase()));
                return new UsernamePasswordAuthenticationToken(user, null, authorities);
            }
        } catch (Exception ex) {
            log.error("Authentication failed for email: {}", authentication.getPrincipal(), ex);
            throw new AuthenticationException("Authentication failed", ex) {
            };
        }
        throw new AuthenticationException("Bad Credentials.") {
        };
    }

    @Override
    public ResponseEntity<?> uploadFile(MultipartFile uploadFile) {
        if (uploadFile.isEmpty()) {
            return ResponseEntity.badRequest().body("Please select a file to upload");
        }

        try {
            User userObj = userDao.findByEmail(jwtFilter.getCurrentUser());
            if (userObj != null) {
                String fileUrl = fileStorageService.storeFile(uploadFile, userObj.getId());

                userObj.setProfilePictureUrl(fileUrl);
                userDao.save(userObj);
                return ResponseEntity.ok().body("Profile picture uploaded successfully");
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to upload profile picture: " + e.getMessage());
        }
    }

    @Override
    public ResponseEntity<String> getProfilePicture() {
        User user = userDao.findByEmail(jwtFilter.getCurrentUser());
        if (user != null && user.getProfilePictureUrl() != null) {
            return ResponseEntity.ok().body(user.getProfilePictureUrl());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @Override
    public ResponseEntity<UserDto> getUserDetails() {
        try {
            User userObj = userDao.findByEmail(jwtFilter.getCurrentUser());
            if (userObj != null) {
                UserDto response = new UserDto(
                        userObj.getName(),
                        userObj.getEmail(),
                        userObj.getContactNumber(),
                        userObj.getStatus());
                return new ResponseEntity<>(response, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return new ResponseEntity<>(new UserDto(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

}
