import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { User } from '../../../models/user';
import { TokenService } from '../../../services/token.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user.service';
import { CartService } from '../../../services/cart.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink,CommonModule,RouterModule ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
}) 
export class HeaderComponent implements OnInit {
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
      // window.location.reload();
    });
    this.toast.success('Đăng xuất thành công','Thành công')
  }
}
