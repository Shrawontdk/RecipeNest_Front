package com.cafeManagement.Controllers;

import com.cafeManagement.wrapper.ProductWrapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * @Author Shrawon Tandukar
 * Created on: 7/21/2024
 */
@RequestMapping(path = "/v1/product")
public interface ProductRest {

    @PostMapping(path = "/add")
    ResponseEntity<String> addNewProduct(@RequestBody Map<String, String> requestMap);

    @GetMapping(path = "/get")
    ResponseEntity<List<ProductWrapper>> getAllProduct();

    @PostMapping(path = "/update")
    ResponseEntity<String> updateProduct(@RequestBody Map<String, String> requestMap);

    @DeleteMapping(path = "/delete/{id}")
    ResponseEntity<String> deleteProduct(@PathVariable Integer id);

    @PostMapping(path = "/updateStatus")
    ResponseEntity<String> updateProductStatus(@RequestBody Map<String, String> requestMap);

    @GetMapping(path = "/getByCategory/{categoryId}")
    ResponseEntity<List<ProductWrapper>> getProductByCategory(@PathVariable Integer categoryId);

    @GetMapping(path = "/getById/{id}")
    ResponseEntity<ProductWrapper> getProductById(@PathVariable Integer id);
}
