import { ReplyComment } from "./reply.comment";
import { User } from "./user";

export class Rating {
    id: number;
    product_id: number;
    user: User;
    value: number;
    comment: string;
    reply_comments: ReplyComment[];

    constructor(id: number, product_id: number, user: User, value: number, comment: string, reply_comments: ReplyComment[]) {
        this.id = id;
        this.product_id = product_id;
        this.user = user;
        this.value = value;
        this.comment = comment;
        this.reply_comments = reply_comments;
    }
}
