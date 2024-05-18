import { Product } from "./product";
import { Size } from "./size";
import { SizeProductId } from "./size.product.id";

export class SizeProduct {
    id: SizeProductId;
    product: Product;
    size: Size;
    constructor(id: SizeProductId, product: Product, size: Size) {
      this.id = id;
      this.product = product;
      this.size = size;
    }
  }