import { Component, OnInit } from '@angular/core';
import { OrderHistory } from 'src/app/common/order-history';
import { OrderHistoryService } from 'src/app/services/order-history.service';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {

  orderHistoryList: OrderHistory[] = [];
  storage : Storage = sessionStorage;
  constructor(private orderService: OrderHistoryService) { }

  ngOnInit(): void {
    this.getOrderHistoryList();
  }
  getOrderHistoryList() {
    const email: string = JSON.parse(this.storage.getItem('userEmail'));
    console.log(email);
    this.orderService.getOrderHistory(email).subscribe(
      (data)=>{
        this.orderHistoryList = data._embedded.orders;
        console.log(this.orderHistoryList);
        console.log(`data ==> ${data._embedded.orders}`)
      }
    )

  }

}
