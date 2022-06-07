package com.backend.ecommerce.dto;

import java.util.HashSet;
import java.util.Set;

import com.backend.ecommerce.entity.Address;
import com.backend.ecommerce.entity.Customer;
import com.backend.ecommerce.entity.OrderItem;
import com.backend.ecommerce.entity.Order;

import lombok.Data;

@Data
public class Purchase {

	private Customer customer;
	private Address shippingAddress;
	private Address billingAddress;
	private Order order;
	private Set<OrderItem> orderItems;
}
