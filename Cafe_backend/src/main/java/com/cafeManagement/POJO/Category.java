package com.cafeManagement.POJO;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import java.io.Serializable;

/**
 * @Author Shrawon Tandukar
 * Created on: 7/20/2024
 */

@NamedQuery(name = "Category.getAllCategory",
        query = "SELECT c FROM Category c where c.id in (SELECT p.category from Product p where p.status = 'true')")


@Data
@Entity
@DynamicInsert
@DynamicUpdate
@Table(name = "category")
public class Category implements Serializable {
    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "name")
    private String name;
}
