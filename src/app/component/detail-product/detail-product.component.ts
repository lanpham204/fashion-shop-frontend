import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { Product } from '../../../models/product';
import { ProductService } from '../../../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../environments/environment';
import { CommonModule } from '@angular/common';
import { ProductImage } from '../../../models/product.image';
import { CartService } from '../../../services/cart.service';
import { CartItem } from '../../../models/cart.item';
import { TokenService } from '../../../services/token.service';
import { ToastrService } from 'ngx-toastr';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { RatingService } from '../../../services/rating.service';
import { ReplyCommentService } from '../../../services/reply.comment.service';
import { Rating } from '../../../models/rating';

@Component({
  selector: 'app-detail-product',
  standalone: true,
  imports: [HeaderComponent,FooterComponent,CommonModule,RatingModule,CommonModule,FormsModule],
  templateUrl: './detail-product.component.html',
  styleUrl: './detail-product.component.scss'
})
export class DetailProductComponent implements OnInit {
  userId: number = 0;
  product?: Product;
  ratings: Rating[] = [];
  idProduct: number = 0;
  currentImage: number = 0;
  currentSize: number = 0;
  currentColor: number = 0;
  colorId: number = 0;
  sizeId: number = 0;
  quantity: number = 1;
  valueRating: number = 0;
  comment: string = ''
  averageRating: number = 0;
  count1Start: number = 0;
  count2Start: number = 0;
  count3Start: number = 0;
  count4Start: number = 0;
  count5Start: number = 0;
  constructor(private productService:ProductService,private cartService: CartService,private tokenService: TokenService,private active: ActivatedRoute
    ,private toastr: ToastrService,private ratingService: RatingService,private replyCommentService: ReplyCommentService
  ) {}
  ngOnInit() {
    this.userId = this.tokenService.getUserIdByToken();
    this.scrollToTop();
    this.idProduct=this.active.snapshot.params["id"];
    this.productService.getProductById(this.idProduct).subscribe({
      next: (response: any) => {
        this.product = response
        if(this.product) {
        this.colorId = this.product.color[0].id;
        this.sizeId = this.product.size[0].id
        this.showImage(0);
        }
      },error: (error: any) => {
        console.log(`failed error:${error.error}`);
      },
    })
    this.ratingService.getAllByProductId(this.idProduct).subscribe({
      next: (response: any) => {
        this.ratings = response
        this.averageRatings();
      },error: (error: any) => {
        console.log(`failed error:${error.error}`);
      },
    })

  }
  scrollToTop() {
    window.scrollTo(0, 0);
  }
  showImage(index: number) {
    if (
      this.product &&
      this.product.product_images &&
      this.product.product_images.length > 0
    ) {
      if (index < 0) {
        index = 0;
      } else if (index >= this.product.product_images.length) {
        index = this.product.product_images.length - 1;
      }
    }
    this.currentImage=index;
  }
  onThumbernailClick(index:number){
    this.showImage(index);
  }
  onSizeClick(index:number,sizeId: number) {
    this.sizeId = sizeId
    this.currentSize = index
  }
  onColorClick(index:number,colorId: number) {
    this.colorId = colorId
    this.currentColor = index
  }
  incraseQuantity() {
    this.quantity++
  }
  decreaseQuantity() {
    if(this.quantity == 0) {
      this.quantity = 1
    }
    this.quantity--
  }
  addToCart() {
    if(this.userId != 0) {
      const cartItem = new CartItem(this.product!,this.userId,this.sizeId,this.colorId,this.quantity,this.product?.price!)
      this.cartService.addToCart(cartItem,this.userId);
      this.toastr.success('Thêm giỏ hàng thành công','Thành công')
    } else {
      this.toastr.error('Vui lòng đăng nhập để thêm giỏ hàng','Thất bại')
    }
  }
  averageRatings() {
    const totalRating = this.ratings.reduce(
      (total, item) => total + item.value, 0
    );
    this.averageRating = this.ratings.length > 0 ? Math.round(totalRating/this.ratings.length): 5
    this.ratings.forEach(rating =>{
      if(rating.value == 5) {
        this.count5Start++
      }
      if(rating.value == 4) {
        this.count4Start++
      }
      if(rating.value == 3) {
        this.count3Start++
      }
      if(rating.value == 2) {
        this.count2Start++
      }
      if(rating.value == 1) {
        this.count1Start++
      }
    })
  }
  ratingProduct() {
    if(this.valueRating === 0 || this.comment === '') {
      this.toastr.warning('Vui lòng chọn sao hoặc nhập nội dung đánh giá trước khi đánh giá','Thất bại')
    } else {
      const rating = {
        product_id: this.product?.id,
        user_id: this.userId,
        value: this.valueRating,
        comment: this.comment
      }
      this.ratingService.create(rating).subscribe({
        next: (response: any) => {
          this.toastr.success('Thêm đánh giá thành công','Thành công')
          this.ratings.push(response);
          this.comment = ''
          this.valueRating = 0
          this.averageRatings();
        },error: (error: any) => {
          this.toastr.error('Thêm đánh giá thất bại '+ error.error,'Thất bại')
        },
      })
    }
    
  }
}
