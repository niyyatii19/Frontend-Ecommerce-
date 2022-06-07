import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../commons/product';
import { map } from 'rxjs/operators';
import { ProductCategory } from '../product-category';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  backendUrl: string = environment.backendApiUrl;
  baseUrl : string = this.backendUrl+'/products';
  categoryUrl: string = this.backendUrl+'/product-category';
  constructor(private httpClient: HttpClient) { }

  getProductList(categoryId: number): Observable<Product[]> {

    const searchUrl: string =  `${this.baseUrl}/search/findByCategoryId?id=${categoryId}`;
    return this.getProducts(searchUrl);
    
  }

  getProductListPaginate(thisPageNo: number, 
                        thisPageSize: number,
                        categoryId: number): Observable<GetResponseProducts> {

    const searchUrl: string =  `${this.baseUrl}/search/findByCategoryId?id=${categoryId}`
                                + `&page=${thisPageNo}&size=${thisPageSize}`;
    return this.httpClient.get<GetResponseProducts>(searchUrl);
    
  }
 
  searchProduct(searchKey: string): Observable<Product[]> {
    const searchUrl : string = `${this.baseUrl}/search/findByNameContaining?name=${searchKey}`;
    return this.getProducts(searchUrl);
  }

  searchProductsPaginate(thisPageNo: number, 
                            thisPageSize: number,
                            searchKey: string): Observable<GetResponseProducts> {

    const searchUrl: string =  `${this.baseUrl}/search/findByNameContaining?name=${searchKey}`
            + `&page=${thisPageNo}&size=${thisPageSize}`;
    return this.httpClient.get<GetResponseProducts>(searchUrl);

}

  getProduct(productId: number): Observable<Product>{
    const searchUrl =  `${this.baseUrl}/${productId}`;
    return this.httpClient.get<Product>(searchUrl);
  }
  


  getProducts(searchUrl : string): Observable<Product[]> {
     return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }

  getProductCategories() : Observable<ProductCategory[]>{

    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    );
  }

  
  
  
}

interface GetResponseProducts{
  _embedded:{
    products: Product[]
  };
  page:{
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
  };
}

interface GetResponseProductCategory{
  _embedded:{
    productCategory: ProductCategory[]
  };
}


// "page" : {
//   "size" : 10,
//   "totalElements" : 100,
//   "totalPages" : 10,
//   "number" : 0
// }