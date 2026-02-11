package com.cafeManagement.dao;

import com.cafeManagement.POJO.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * @Author Shrawon Tandukar
 * Created on: 7/20/2024
 */

public interface CategoryDao extends JpaRepository<Category, Integer> {

    List<Category> getAllCategory();
}
