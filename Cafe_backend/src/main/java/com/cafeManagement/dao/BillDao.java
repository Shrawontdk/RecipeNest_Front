package com.cafeManagement.dao;

import com.cafeManagement.POJO.Bill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 * @Author Shrawon Tandukar
 * Created on: 7/23/2024
 */

public interface BillDao extends JpaRepository<Bill, Integer> {

    List<Bill> getAllBills();

    List<Bill> getBillByUserName(@Param("userName") String userName);
}
