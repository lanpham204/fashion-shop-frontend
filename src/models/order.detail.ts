import { Product } from "./product";

export class OrderDetail {
    id: number;
    order_id: number;
    product: Product;
    size: string;
    color: string;
    price: number;
    quantity: number;
    totalMoney: number;

    constructor(
        id: number,
        order_id: number,
        product: Product,
        size: string,
        color: string,
        price: number,
        quantity: number,
        totalMoney: number
    ) {
        this.id = id;
        this.order_id = order_id;
        this.product = product;
        this.size = size;
        this.color = color;
        this.price = price;
        this.quantity = quantity;
        this.totalMoney = totalMoney;
    }
}
