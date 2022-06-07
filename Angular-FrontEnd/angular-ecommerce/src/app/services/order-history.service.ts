import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable,map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { OrderHistory } from '../common/order-history';

@Injectable({
  providedIn: 'root'
})
export class OrderHistoryService {

  orderUrl : string = environment.backendApiUrl+'/orders';
  
  constructor(private httpClient: HttpClient) { }

  getOrderHistory(email: string):Observable<GetOrderHistoryRes>{
    let emailUrl:string =  `${this.orderUrl}/search/findByCustomerEmailOrderByDateCreatedDesc?email=${email}`
    console.log(emailUrl);
    return this.httpClient.get<GetOrderHistoryRes>(emailUrl);
  }
}

interface GetOrderHistoryRes{
  _embedded:{
    orders: OrderHistory[];
  }
}
