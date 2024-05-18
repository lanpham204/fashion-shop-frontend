export class ReplyComment {
    id: number;
    rating_id: number;
    comment: string;

    constructor(id: number, rating_id: number, comment: string) {
        this.id = id;
        this.rating_id = rating_id;
        this.comment = comment;
    }
}
