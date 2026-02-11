package com.cafeManagement.serviceImpl;

import com.cafeManagement.dao.BillDao;
import com.cafeManagement.dao.CategoryDao;
import com.cafeManagement.dao.ProductDao;
import com.cafeManagement.service.DashBoardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

/**
 * @Author Shrawon Tandukar
 * Created on: 7/24/2024
 */
@Service
public class DashBoardServiceImpl implements DashBoardService {
    @Autowired
    CategoryDao categoryDao;
    @Autowired
    ProductDao productDao;
    @Autowired
    BillDao billDao;

    @Override
    public ResponseEntity<Map<String, Object>> getCount() {
        Map<String, Object> map = new HashMap<>();
        map.put("category", categoryDao.count());
        map.put("product", productDao.count());
        map.put("bill", billDao.count());
        return new ResponseEntity<>(map, HttpStatus.OK);
    }
}
