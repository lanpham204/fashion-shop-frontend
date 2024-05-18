import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { Order } from '../../../../models/order';
import { OrderService } from '../../../../services/order.service';
import { environment } from '../../../environments/environment';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { OrderDetail } from '../../../../models/order.detail';
import { OrderDetailService } from '../../../../services/order.details.service';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-admin-order-detail',
  standalone: true,
  imports: [RouterLink, CommonModule, ReactiveFormsModule, FormsModule, ButtonModule, ConfirmDialogModule
    , DialogModule, OverlayPanelModule,],
  templateUrl: './admin-order-detail.component.html',
  styleUrl: './admin-order-detail.component.scss'
})
export class AdminOrderDetailComponent {
  orderId: number = 0
  order?: Order;
  totalAmount: number = 0
  constructor(private orderService: OrderService, private active: ActivatedRoute,private orderDetailService: OrderDetailService,
    private toastr: ToastrService, private confirmationService: ConfirmationService
  ) { }
  ngOnInit(): void {
    this.orderId = this.active.snapshot.params['orderId']
    this.orderService.getOrderById(this.orderId).subscribe({
      next: (response: any) => {
        debugger
        this.order = response
        this.total()
      }
    })
  }
  incraseQuantity(orderDetail: OrderDetail) {
    orderDetail.quantity++
    this.updateOrderDetail(orderDetail)
  }
  descraseQuantity(orderDetail: OrderDetail) {
    orderDetail.quantity--
    this.updateOrderDetail(orderDetail)
  }
  updateOrderDetail(orderDetail: OrderDetail) {
    this.total()
    const orderDetailDto = {
      id: orderDetail.id,
      order_id: orderDetail.order_id,
      price: orderDetail.price,
      product_id: orderDetail.product.id,
      quantity: orderDetail.quantity,
      size: orderDetail.size,
      color: orderDetail.color,
      totalMoney: orderDetail.price*orderDetail.quantity,
      total_money_order: this.totalAmount
    }
    this.orderDetailService.updateOrderDetail(orderDetailDto,orderDetail.id).subscribe({
      next: (response: any) => {
      },
      error: (error: any) => {
        this.toastr.error(`Sửa thất bại: ${error.error}`, 'Thất bại')

      },
    })
  }
  deleteOrder(event: Event, id: number, index: number) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Bạn có muốn xóa sản phẩm : ' + id + ' không ',
      header: 'Xóa sản phẩm',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: "p-button-danger p-button-text",
      rejectButtonStyleClass: "p-button-text p-button-text",
      acceptIcon: "none",
      rejectIcon: "none",

      accept: () => {
        this.orderDetailService.deleteOrderDetail(id).subscribe({
          next: (response: any) => {
            this.order?.order_details.splice(index,1)
            this.toastr.success('Xóa thành công', 'Thành công')
          }, error: (error: any) => {
            debugger
            this.toastr.error(`Xóa thất bại: ${error.error}`, 'Thất bại')
          },
        })

      },
      reject: () => {

      }
    });

  }
  total() {
    this.totalAmount = this.order!.order_details.reduce(
      (total, item) => total + item.price * item.quantity, 0
    );
  }
}
