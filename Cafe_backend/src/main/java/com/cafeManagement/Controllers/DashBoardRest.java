package com.cafeManagement.Controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.Map;

/**
 * @Author Shrawon Tandukar
 * Created on: 7/24/2024
 */
@RequestMapping(path = "/v1/dashboard")
public interface DashBoardRest {

    @GetMapping(path = "/details")
    ResponseEntity<Map<String, Object>> getCount();
}
