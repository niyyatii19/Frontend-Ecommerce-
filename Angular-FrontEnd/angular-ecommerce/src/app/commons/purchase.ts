import { Address } from "./address";
import { Customer } from "./customer";
import { OrderItems } from "./order-item";
import { Order } from "./orders";

export class Purchase {
    customer: Customer;
    shippingAddress: Address;
    billingAddress: Address;
    order: Order;
    orderItems: OrderItems[];
}

