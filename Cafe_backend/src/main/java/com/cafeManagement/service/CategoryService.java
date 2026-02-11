package com.cafeManagement.service;

import com.cafeManagement.POJO.Category;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;

/**
 * @Author Shrawon Tandukar
 * Created on: 7/20/2024
 */

public interface CategoryService {

    ResponseEntity<String> addNewCategory(Map<String, String> requestMap);

    ResponseEntity<List<Category>> getAllCategory(String filterValue);

    ResponseEntity<String> updateCategory(Map<String, String> requestMap);

    ResponseEntity<String> deleteCategory(Integer id);
}
