import { CartItemDetail } from "./cart.item.detail";
import { OrderDetail } from "./order.detail";

export class Order {
    id: number;
    user_id: number;
    fullname: string;
    phone_number: string;
    address: string;
    note: string;
    total_money: number;
    order_date: Date;
    payment_method: string;
    status: string;
    active: boolean;
    order_details: OrderDetail[];

    constructor(
        id: number,
        user_id: number,
        phone_number: string,
        fullname: string,
        address: string,
        note: string,
        total_money: number,
        order_date: Date,
        payment_method: string,
        status: string,
        active: boolean,
        order_details: OrderDetail[]
    ) {
        this.id = id;
        this.user_id = user_id;
        this.fullname = fullname
        this.phone_number = phone_number;
        this.address = address;
        this.note = note;
        this.total_money = total_money;
        this.order_date = order_date;
        this.payment_method = payment_method;
        this.status = status
        this.active = active;
        this.order_details = order_details;
    }
}
