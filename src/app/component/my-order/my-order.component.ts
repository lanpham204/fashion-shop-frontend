import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../services/order.service';
import { TokenService } from '../../../services/token.service';
import { Order } from '../../../models/order';
@Component({
  selector: 'app-my-order',
  standalone: true,
  imports: [HeaderComponent,FooterComponent,RouterLink,CommonModule],
  templateUrl: './my-order.component.html',
  styleUrl: './my-order.component.scss'
})
export class MyOrderComponent  implements OnInit{
  orders: Order[] = []
  constructor(private orderService: OrderService,private tokenService: TokenService) {}
  ngOnInit(): void {
    const userId = this.tokenService.getUserIdByToken();
    this.orderService.getOrderByUserId(userId).subscribe({
      next: (response: any) => {
        this.orders = response
      }
    })
  }
}
