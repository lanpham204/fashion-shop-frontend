import { Routes } from '@angular/router';
import { HomeComponent } from './component/home/home.component';
import path from 'path';
import { ShopComponent } from './component/shop/shop.component';
import { DetailProductComponent } from './component/detail-product/detail-product.component';
import { CartComponent } from './component/cart/cart.component';
import { LoginComponent } from './component/login/login.component';
import { RegisterComponent } from './component/register/register.component';
import { MyOrderComponent } from './component/my-order/my-order.component';
import { AdminProductComponent } from './component/admin/admin-product/admin-product.component';
import { OrderDetailComponent } from './component/order-detail/order-detail.component';
import { AdminDashboardComponent } from './component/admin/admin-dashboard/admin-dashboard.component';
import { AdminUserComponent } from './component/admin/admin-user/admin-user.component';
import { AdminOrderComponent } from './component/admin/admin-order/admin-order.component';
import { AdminOrderDetailComponent } from './component/admin/admin-order-detail/admin-order-detail.component';
import { AdminCategoryComponent } from './component/admin/admin-category/admin-category.component';
import { AdminStatisticalComponent } from './component/admin/admin-statistical/admin-statistical.component';
export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'products', component: ShopComponent },
    { path: 'products/:id', component: DetailProductComponent },
    { path: 'cart', component: CartComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'my-orders', component: MyOrderComponent },
    { path: 'order-details/:orderId', component: OrderDetailComponent },
    {
        path: 'admin', component: AdminDashboardComponent,
        children: [
            {
                path: 'dashboard', component: AdminStatisticalComponent
            },
            {
                path: 'products', component: AdminProductComponent
            },
            {
                path: 'users', component: AdminUserComponent
            },
            {
                path: 'orders', component: AdminOrderComponent
            },
            {
                path: 'order-details/:orderId', component: AdminOrderDetailComponent
            },
            {
                path: 'categories', component: AdminCategoryComponent
            },
        ]
    },
];
