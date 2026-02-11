package com.cafeManagement.service;

import org.springframework.http.ResponseEntity;

import java.util.Map;

/**
 * @Author Shrawon Tandukar
 * Created on: 7/24/2024
 */

public interface DashBoardService {
    ResponseEntity<Map<String, Object>> getCount();
}
