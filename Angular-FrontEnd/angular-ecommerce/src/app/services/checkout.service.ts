import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PaymentInfo } from '../commons/payment-info';
import { Purchase } from '../commons/purchase';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  purchaseUrl : string = environment.backendApiUrl+'/checkout/purchase';
  paymentIntentUrl: string = environment.backendApiUrl +'/checkout/payment-intent';
  constructor(private httpClient: HttpClient) { }

  placeOrder(purchase: Purchase):Observable<any>{
    return this.httpClient.post<Purchase>(this.purchaseUrl, purchase);
  }

  paymentIntent(paymentInfo: PaymentInfo):Observable<any>{
    return this.httpClient.post<PaymentInfo>(this.paymentIntentUrl, paymentInfo);
  }
}
