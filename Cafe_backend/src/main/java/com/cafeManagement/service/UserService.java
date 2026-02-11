package com.cafeManagement.service;

import com.cafeManagement.wrapper.UserDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

public interface UserService {
    ResponseEntity<String> signUp(Map<String, String> requestMap);

    ResponseEntity<String> login(Map<String, String> requestMap);

    ResponseEntity<List<UserDto>> getAllUser();

    ResponseEntity<String> updateUser(Map<String, String> requestMap);

    ResponseEntity<String> checkToken();

    ResponseEntity<String> changePassword(Map<String, String> requestMap);

    ResponseEntity<String> forgotPassword(Map<String, String> requestMap);

    ResponseEntity<?> uploadFile(MultipartFile uploadFile);

    ResponseEntity<String> getProfilePicture();

    ResponseEntity<UserDto> getUserDetails();
}
