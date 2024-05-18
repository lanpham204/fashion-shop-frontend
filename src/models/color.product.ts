import { Color } from "./color";
import { ColorProductId } from "./color.product.id";
import { Product } from "./product";
import { Size } from "./size";
import { SizeProductId } from "./size.product.id";

export class ColorProduct {
    id: ColorProductId;
    product: Product;
    color: Color;
    constructor(id: ColorProductId, product: Product, color: Color) {
      this.id = id;
      this.product = product;
      this.color = color;
    }
  }