import { Product } from "./product";

export class CartItemDetail {
    product_id: number;
    user_id: number;
    size: string;
    color: string;
    quantity: number;
    price: number;

    constructor(
      product_id: number,
        user_id: number,
        size: string,
        color: string,
        quantity: number,
        price: number
      ) {
        this.product_id = product_id;
        this.user_id = user_id;
        this.size = size;
        this.color = color;
        this.quantity = quantity;
        this.price = price;
      }
}
