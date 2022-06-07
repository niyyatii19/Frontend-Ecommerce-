package com.backend.ecommerce.config;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import javax.persistence.EntityManager;
import javax.persistence.metamodel.EntityType;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

import com.backend.ecommerce.entity.Country;
import com.backend.ecommerce.entity.Order;
import com.backend.ecommerce.entity.Product;
import com.backend.ecommerce.entity.ProductCategory;
import com.backend.ecommerce.entity.State;

@Configuration
public class MyDataRestConfig implements RepositoryRestConfigurer {
	
	@Value("${allowed.origins}")
	private String[] allowedOrigins;
	@Autowired
	private EntityManager entityManager;

	@Override
	public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) {
		// TODO Auto-generated method stub
		RepositoryRestConfigurer.super.configureRepositoryRestConfiguration(config, cors);
		
		HttpMethod[] unsupportedActions = {HttpMethod.DELETE, HttpMethod.POST, HttpMethod.POST, HttpMethod.PATCH};
		//disable write  methods and only enabling read methods
		
		disableHttpMethods(ProductCategory.class, config, unsupportedActions);
		disableHttpMethods(Product.class, config, unsupportedActions);
		disableHttpMethods(Country.class, config, unsupportedActions);
		disableHttpMethods(State.class, config, unsupportedActions);
		disableHttpMethods(Order.class, config, unsupportedActions);


		
		exposeIds(config);
		cors.addMapping(config.getBasePath() +"/**").allowedOrigins(allowedOrigins);
	}



	private void disableHttpMethods(Class theClass,RepositoryRestConfiguration config, HttpMethod[] unsupportedActions) {
		config.getExposureConfiguration()
		.forDomainType(theClass)
		.withItemExposure( (metdata, httpMethods) -> httpMethods.disable(unsupportedActions))
		.withCollectionExposure((metdata, httpMethods) -> httpMethods.disable(unsupportedActions));
	}
	
	

	private void exposeIds(RepositoryRestConfiguration config) {
		
		Set<EntityType<?>> entites = this.entityManager.getMetamodel().getEntities();
		
		List<Class> entityList = new ArrayList<>();
		
		for(EntityType entity: entites) {
			entityList.add(entity.getJavaType());
		}
		
		Class[] domain = entityList.toArray(new Class[0]);

		config.exposeIdsFor(domain);
	}
	
}
