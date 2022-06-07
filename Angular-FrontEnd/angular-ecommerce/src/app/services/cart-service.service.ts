import { Injectable } from '@angular/core';
import { BehaviorSubject, ReplaySubject, Subject } from 'rxjs';
import { CartItem } from '../commons/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartServiceService {
  
  cartItems: CartItem[] = [];

  quantity: Subject<number>= new BehaviorSubject<number>(0);
  totalPrice: Subject<number> = new BehaviorSubject<number>(0);

  // storage: Storage = sessionStorage;
  storage: Storage = sessionStorage;
  constructor() { 
    let data = JSON.parse(this.storage.getItem('çartItems'));
    if(data != null){
      this.cartItems = data;
      this.computeCartTotal();
    }
  }

  addToCartItem(cartItem: CartItem){
    let exisitingItem: CartItem = undefined;
    let hasItem : boolean = false;

    if(this.cartItems.length > 0){
      exisitingItem = this.cartItems.find( (item) => item.id === cartItem.id)

      hasItem = exisitingItem != undefined;
    }

    if(hasItem){
      exisitingItem.quantity++;
    }
    else{
      this.cartItems.push(cartItem);
    }

    this.computeCartTotal();
  }

  decrementCartItem(cartItem: CartItem) {
    cartItem.quantity--;
    if(cartItem.quantity === 0){
      this.remove(cartItem)
    }else{
      this.computeCartTotal();
    }
  }
  remove(cartItem: CartItem) {
    const cartItemIndex : number = this.cartItems.findIndex(item => item.id == cartItem.id);
    
    if(cartItemIndex != -1){
      this.cartItems.splice(cartItemIndex,1);
      this.computeCartTotal();
    }
  }

  persistCartitems(){
    this.storage.setItem('çartItems', JSON.stringify(this.cartItems));
  }

  computeCartTotal() {
    let totalPriceValue: number =0;
    let totalQuantityValue: number = 0;

    for(let cart of this.cartItems){
      totalPriceValue+= cart.quantity * cart.unitPrice;
      totalQuantityValue+= cart.quantity;
    }

    this.totalPrice.next(totalPriceValue);
    this.quantity.next(totalQuantityValue);

    this.logCartValue(this.totalPrice, this.quantity);
    this.persistCartitems();
  }
  logCartValue(totalPrice: Subject<number>, quantity: Subject<number>) {
    console.log('Contents of the cart');
    for (let tempCartItem of this.cartItems) {
      const subTotalPrice = tempCartItem.quantity * tempCartItem.unitPrice;
      console.log(`name: ${tempCartItem.name}, quantity=${tempCartItem.quantity}, unitPrice=${tempCartItem.unitPrice}, subTotalPrice=${subTotalPrice}`);
    }

    console.log(`totalPrice: ${totalPrice}, totalQuantity: ${quantity}`);
    console.log('----');
  }
}
