package com.backend.ecommerce.dao;

import java.util.List;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestParam;

import com.backend.ecommerce.entity.State;


@RepositoryRestResource
@CrossOrigin
public interface StateRepository extends JpaRepository<State, Integer>{
	List<State> findByCountryCode(@RequestParam("code") String code);
}
