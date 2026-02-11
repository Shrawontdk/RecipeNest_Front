package com.cafeManagement.Controllers;

import com.cafeManagement.wrapper.UserDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RequestMapping(path = "/v1/user")
public interface UserRest {
    @PostMapping(path = "/signUp")
    public ResponseEntity<String> signUp(@RequestBody(required = true) Map<String, String> requestMap);

    @PostMapping(path = "/login")
    public ResponseEntity<String> login(@RequestBody(required = true) Map<String, String> requestMap);

    @GetMapping(path = "/get")
    public ResponseEntity<List<UserDto>> getAllUser();

    @PostMapping(path = "/update")
    public ResponseEntity<String> updateUser(@RequestBody(required = true) Map<String, String> requestMap);

    @GetMapping(path = "/checkToken")
    public ResponseEntity<String> checkToken();

    @PostMapping(path = "/changePassword")
    public ResponseEntity<String> changePassword(@RequestBody Map<String, String> requestMap);

    @PostMapping(path = "/forgotPassword")
    public ResponseEntity<String> forgotPassword(@RequestBody Map<String, String> requestMap);

    @PostMapping(path = "/upload")
    public ResponseEntity<?> upload(@RequestParam("file") MultipartFile file);

    @GetMapping("/profile-picture")
    public ResponseEntity<String> getProfilePicture();

    @GetMapping("/user-details")
    public ResponseEntity<UserDto> getUserDetails();
}
