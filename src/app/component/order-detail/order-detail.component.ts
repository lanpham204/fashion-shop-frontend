import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../services/order.service';
import { Order } from '../../../models/order';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [HeaderComponent,FooterComponent,RouterLink,CommonModule],
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.scss'
})
export class OrderDetailComponent implements OnInit {
  orderId: number = 0
  order?: Order;
  constructor(private orderService: OrderService,private active: ActivatedRoute) {}
  ngOnInit(): void {
    this.orderId = this.active.snapshot.params['orderId']
    this.orderService.getOrderById(this.orderId).subscribe({
      next: (response: any) => {
        debugger
        this.order = response
      }
    })
  }
}
