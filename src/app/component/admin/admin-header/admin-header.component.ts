import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from '../../../../models/user';
import { CartService } from '../../../../services/cart.service';
import { TokenService } from '../../../../services/token.service';
import { UserService } from '../../../../services/user.service';
import { Route } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-header.component.html',
  styleUrl: './admin-header.component.scss'
})
export class AdminHeaderComponent {
  user?:User | null;
  userId:number = 0;
  select: number = 0;
  sizeCartItems: number = 0;
  constructor(private tokenService:TokenService,private userService: UserService,private cartService: CartService,private router:Router,
    private toast: ToastrService
  ) {}
  ngOnInit() {
    this.userId = this.tokenService.getUserIdByToken()
    this.cartService.cartItems$.subscribe(cartItems => {
      this.sizeCartItems = cartItems.length;
    });
    console.log(this.userId)
  }
  onSelect(index:number) {
    this.select = index;
    
  }
  logout() {
    this.userId = 0
    this.sizeCartItems = 0
    this.tokenService.removeToken();
    this.router.navigate([this.router.url]).then(() => {
    });
    this.toast.success('Đăng xuất thành công','Thành công')
  }
}
