package com.cafeManagement.dao;

import com.cafeManagement.POJO.Product;
import com.cafeManagement.wrapper.ProductWrapper;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 * @Author Shrawon Tandukar
 * Created on: 7/21/2024
 */

public interface ProductDao extends JpaRepository<Product, Integer> {
    List<ProductWrapper> getAllProduct();

    @Transactional
    @Modifying
    Integer updateProductStatus(@Param("status") String status, @Param("id") Integer id);

    List<ProductWrapper> getProductByCategory(@Param("categoryId") Integer categoryId);

    ProductWrapper getProductById(@Param("id") Integer id);
}
