import { ProductImage } from "./product.image";
import { Size } from "./size";
import { Color } from "./color";
import { Category } from "./category";
import { Rating } from "./rating";

export class Product {
    id: number;
    name: string;
    thumbnail: string;
    price: number;
    description: string;
    category: Category;
    product_images: ProductImage[];
    size: Size[];
    color: Color[];
    ratings: Rating[];
    constructor(
        id: number,
        name: string,
        thumbnail: string,
        price: number,
        description: string,
        category: Category,
        product_images: ProductImage[],
        size: Size[],
        color: Color[],
        rating: Rating[]
    ) {
        this.id = id;
        this.name = name;
        this.thumbnail = thumbnail;
        this.price = price;
        this.description = description;
        this.category = category;
        this.product_images = product_images;
        this.size = size;
        this.color = color;
        this.ratings = rating
    }
}

