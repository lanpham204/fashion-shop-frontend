import { Product } from "./product";

export class CartItem {
    product: Product;
    user_id: number;
    size_id: number;
    color_id: number;
    quantity: number;
    price: number;

    constructor(
        product: Product,
        user_id: number,
        size_id: number,
        color_id: number,
        quantity: number,
        price: number
      ) {
        this.product = product;
        this.user_id = user_id;
        this.size_id = size_id;
        this.color_id = color_id;
        this.quantity = quantity;
        this.price = price;
      }
}
