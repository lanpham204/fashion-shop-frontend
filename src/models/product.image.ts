
export class ProductImage {
    static readonly MAXIMUM_IMAGES_SIZE: number = 5;
    id: number;
    image_url: string;

    constructor(id: number, image_url: string) {
        this.id = id;
        this.image_url = image_url;
    }
}
