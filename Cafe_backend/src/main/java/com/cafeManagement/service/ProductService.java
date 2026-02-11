package com.cafeManagement.service;

import com.cafeManagement.wrapper.ProductWrapper;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;

/**
 * @Author Shrawon Tandukar
 * Created on: 7/21/2024
 */

public interface ProductService {
    ResponseEntity<String> addNewProduct(Map<String, String> requestMap);

    ResponseEntity<List<ProductWrapper>> getAllProduct();

    ResponseEntity<String> updateProduct(Map<String, String> requestMap);

    ResponseEntity<String> deleteProduct(Integer id);

    ResponseEntity<String> updateProductStatus(Map<String, String> requestMap);

    ResponseEntity<List<ProductWrapper>> getProductByCategory(Integer categoryId);

    ResponseEntity<ProductWrapper> getProductById(Integer id);

}
