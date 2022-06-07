import { Component, OnInit } from '@angular/core';
import { CartItem } from 'src/app/commons/cart-item';
import { CartServiceService } from 'src/app/services/cart-service.service';

@Component({
  selector: 'app-card-details',
  templateUrl: './card-details.component.html',
  styleUrls: ['./card-details.component.css']
})
export class CardDetailsComponent implements OnInit {

  cartItems: CartItem[] = [];
  totalPrice : number;
  totalQuantity: number;

  constructor(private cartService: CartServiceService) { }

  ngOnInit(): void {
    this.listCartItems()
  }
  listCartItems() {
    this.cartItems = this.cartService.cartItems;
    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    );
      console.log(`${this.totalPrice}`)
    this.cartService.quantity.subscribe(
      data  => this.totalQuantity = data
    );
   
    for(let i=0; i<this.cartItems.length; i++){
      console.log(this.cartItems[i].imageUrl);
    }

    this.cartService.computeCartTotal()
  }
  
  incrementQuantity(cartItem : CartItem){
    this.cartService.addToCartItem(cartItem);
  }

  decrementQuantity(cartItem: CartItem){
    this.cartService.decrementCartItem(cartItem);
  }

  remove(cartItem: CartItem){
    this.cartService.remove(cartItem);
  }

}

