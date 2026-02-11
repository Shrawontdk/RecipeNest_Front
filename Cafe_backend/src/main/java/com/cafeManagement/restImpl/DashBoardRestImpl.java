package com.cafeManagement.restImpl;

import com.cafeManagement.Controllers.DashBoardRest;
import com.cafeManagement.service.DashBoardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * @Author Shrawon Tandukar
 * Created on: 7/24/2024
 */
@RestController
public class DashBoardRestImpl implements DashBoardRest {
    @Autowired
    DashBoardService dashBoardService;

    @Override
    public ResponseEntity<Map<String, Object>> getCount() {
        return dashBoardService.getCount();
    }
}
