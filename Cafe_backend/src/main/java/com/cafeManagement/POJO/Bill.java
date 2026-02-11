package com.cafeManagement.POJO;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import java.io.Serializable;

/**
 * @Author Shrawon Tandukar
 * Created on: 7/23/2024
 */
@NamedQuery(name = "Bill.getAllBills",
        query = "SELECT b FROM Bill b  order by b.id desc")
@NamedQuery(name = "Bill.getBillByUserName",
        query = "SELECT b FROM Bill b WHERE b.createdBy =:userName order by b.id desc")

@Data
@Entity
@DynamicInsert
@DynamicUpdate
@Table(name = "bill")
public class Bill implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "uuid")
    private String uuid;

    @Column(name = "name")
    private String name;

    @Column(name = "contactNumber")
    private String contactNumber;

    @Column(name = "email")
    private String email;

    @Column(name = "paymentMethod")
    private String paymentMethod;

    @Column(name = "totalAmount")
    private Integer totalAmount;

    @Column(name = "productDetails", columnDefinition = "json")
    private String productDetails;

    @Column(name = "createdBy")
    private String createdBy;
}
