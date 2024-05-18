import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { CartService } from '../../../services/cart.service';
import { CartItem } from '../../../models/cart.item';
import { environment } from '../../environments/environment';
import { ProductImage } from '../../../models/product.image';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TokenService } from '../../../services/token.service';
import { User } from '../../../models/user';
import { UserService } from '../../../services/user.service';
import { CartItemDetail } from '../../../models/cart.item.detail';
import { OrderService } from '../../../services/order.service';
import { Order } from '../../../models/order';
import { response } from 'express';
import { ToastrService } from 'ngx-toastr';
import { AddressService } from '../../../services/address.service';
import { log } from 'console';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [HeaderComponent,FooterComponent,CommonModule,RouterModule,ReactiveFormsModule,CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = []
  totalAmount: number = 0;
  orderForm: FormGroup;
  user?:User;
  cartItemDetail:CartItemDetail[] = [];
  provincesArray: any[] = []
  districtsArray: any[] = []
  wardsArray: any[] = []
  address: string| undefined = ''
  constructor(private cartService: CartService,private tokenService: TokenService,private userService: UserService,
   private orderService: OrderService,private toast: ToastrService,private router: Router,private addressService:AddressService
  ) {
    this.orderForm = new FormGroup({
      user_id: new FormControl('',[Validators.required]),
      fullname: new FormControl('',[Validators.required]),
      phone_number: new FormControl(null,[Validators.required,Validators.pattern('(84|0[3|5|7|8|9])[0-9]{8}')]),
      province: new FormControl('',[Validators.required]),
      district: new FormControl('',[Validators.required]),
      ward: new FormControl('',[Validators.required]),
      address: new FormControl('',[Validators.required]),
      payment_method: new FormControl('',[Validators.required]),
      note: new FormControl('')
    })
   }
  ngOnInit(): void {
    const token  = this.tokenService.getToken() ;
    if(token) {
      this.userService.getByToken(token).subscribe({
        next: (response: any) => {
          debugger
          this.user = response;
      this.orderForm.get('fullname')!.setValue(this.user?.fullname);
      this.orderForm.get('user_id')!.setValue(this.user?.id);
      this.cartItems = this.cartService.getCart(this.user?.id!);
            this.total()
        }
      })

    }
    this.addressService.getAllProvinces().subscribe(data => {
      debugger
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
            this.provincesArray.push(data[key]);
        }
    }
    });
    
     
  }
  removeCartItem(cartItem: CartItem) {
    console.log(this.user);
    const removedIndex = this.cartItems.findIndex(item => {
      return item.product.id == cartItem.product.id && item.color_id == cartItem.color_id && item.size_id == cartItem.size_id})
      this.cartItems.splice(removedIndex,1)
    this.cartService.removeItemFromCart(cartItem,this.user?.id!);
    this.total()
  }
  incraseQuantity(cartItem: CartItem) {
    cartItem.quantity++
    this.cartService.addQuantityCart(cartItem,'+',this.user?.id!)
      this.total()
  }
  descraseQuantity(cartItem: CartItem) {
    if(cartItem.quantity == 1) {
      cartItem.quantity = 1
    } else {
      cartItem.quantity--
    }
    this.cartService.addQuantityCart(cartItem,'-',this.user?.id!)
      this.total()
  }
  total() {
    this.totalAmount = this.cartItems.reduce(
      (total, item) => total + item.price * item.quantity, 0
    );
  }
  order() {
    debugger
    if(this.orderForm.valid) {
    
        this.orderForm.get('address')!.setValue(this.orderForm.get('address')!.value + `,  ${this.address}`);
        this.cartService.getCart(this.user?.id!).forEach(item => {
          const size = item.product.size.find(size => {return size.id === item.size_id})
          const color = item.product.color.find(color => {return color.id === item.color_id})
          if(this.user && size && color) {
            this.cartItemDetail.push(new CartItemDetail(item.product.id,this.user?.id,size.size,color.color,item.quantity,item.price));
          }
          
        })
        const order = {
          ...this.orderForm.getRawValue(),
          total_money: this.totalAmount,
          cart_items: this.cartItemDetail,
        }
        this.orderService.createOrder(order).subscribe({
          next: (response:any) => {
            this.cartService.deleteCart(this.user?.id!);
            if( this.orderForm.get('payment_method')!.value === 'vnpay') {
              this.orderService.createPayment(this.totalAmount,response.id).subscribe({
                next: (response: any) => {
                  debugger
                  window.location.href = response.url;
                }, error: (error: any) => {
                  debugger
                  console.log((error));
                  
                },
              })
            } else {
            this.toast.success('Đặt hàng thành công','Thành công')
              this.router.navigate(['/products'])
            }
          }, error: (error: any) => {
            debugger
            this.toast.success('Đặt hàng thất bại '+error.error,'Thất bại')
          },
        })
      
    } else {
      this.orderForm.markAllAsTouched();
    }
    
  }
  findDistrictByProvine() {
    this.districtsArray = []
    const code = this.orderForm.get('province')?.value
    if (code) {
        this.addressService.getAllDistricts().subscribe(data => {
            for (const key in data) {
                if (data.hasOwnProperty(key)) {
                    const district = data[key];
                    if (district.parent_code === code) {
                        this.districtsArray.push(district);
                    }
                }
            }
        });
    }
  }
  findWardByDistrict() {
    this.wardsArray = []
    const code = this.orderForm.get('district')?.value
    if(code) {
      this.addressService.getAllWard().subscribe(data => {
        debugger
        for(const key in data) {
          if(data.hasOwnProperty(key)) {
            if(data[key].parent_code === code) {
              this.wardsArray.push(data[key])
            }
          }
        }
      })
    }
  }
  getWardNameByCode() {
    const code = this.orderForm.get('ward')?.value
    const ward = this.wardsArray.find(ward => ward.code === code);
     this.address = ward ? ward.path_with_type : undefined;
  }
}
