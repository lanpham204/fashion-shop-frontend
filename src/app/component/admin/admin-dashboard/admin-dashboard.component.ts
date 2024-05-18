import { Component, OnInit } from '@angular/core';
import { AdminHeaderComponent } from '../admin-header/admin-header.component';
import { AdminNavbarComponent } from '../admin-navbar/admin-navbar.component';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { ProductService } from '../../../../services/product.service';
import { CategoryService } from '../../../../services/category.service';
import { Product } from '../../../../models/product';
import { environment } from '../../../environments/environment';
import { OrderService } from '../../../../services/order.service';
import { TokenService } from '../../../../services/token.service';
import { Order } from '../../../../models/order';
import { AdminProductComponent } from '../admin-product/admin-product.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [AdminHeaderComponent,AdminNavbarComponent,CommonModule,RouterLink,RouterOutlet,AdminProductComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent {
 

}
