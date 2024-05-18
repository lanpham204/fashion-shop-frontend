import { CommonModule } from '@angular/common';
import { Component, Directive, HostListener, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { Order } from '../../../../models/order';
import { OrderService } from '../../../../services/order.service';
import { TokenService } from '../../../../services/token.service';

@Component({
  selector: 'app-admin-order',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, FormsModule, ButtonModule, ConfirmDialogModule
    , DialogModule, OverlayPanelModule, FileUploadModule,],
  templateUrl: './admin-order.component.html',
  styleUrl: './admin-order.component.scss'
})
export class AdminOrderComponent implements OnInit {
  orderForm: FormGroup;
  orders: Order[] = []
  order?: Order
  totalPages: number = 0
  currentPage: number = 0;
  pageSize: number = 6;
  keyword: string = '';
  status: string = ''
  visiblePage: number[] = [];
  visibleUpdate: boolean = false
  constructor(private router: Router,private route: ActivatedRoute,private toastr: ToastrService, private confirmationService: ConfirmationService, private orderService: OrderService, private tokenService: TokenService) {
    this.orderForm = new FormGroup({
      fullname: new FormControl(null, Validators.required),
      phone_number: new FormControl(null, [Validators.required,Validators.pattern('(84|0[3|5|7|8|9])[0-9]{8}')]),
      address: new FormControl(null, Validators.required),
      note: new FormControl(null),
      status: new FormControl(null, Validators.required),
    });
  }
  ngOnInit(): void {
    const userId = this.tokenService.getUserIdByToken();
    this.route.queryParams.subscribe(params => {
      const page = params['page'];
      if (page) {
        this.currentPage = page
      }
      this.searchOrder(this.keyword,this.status, this.currentPage)
    });
    
  }

  searchOrder(keyword: string,status: string, page: number) {
    this.orderService.getOrders(page, this.pageSize, keyword,status).subscribe({
      next: (response: any) => {
        debugger
        this.orders = response.orders;
        this.totalPages = response.totalPages;
        if (this.currentPage <= this.totalPages - 2) {
          this.getVisiblePage();
        }
        console.log(this.orders);

      },
      error: (error: any) => {
        debugger
        console.log(` ${error}`)
      },
    });
  }
  onPageChange(page: number) {
    this.currentPage = page;
    this.searchOrder(this.keyword,this.status, page);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: page },
      queryParamsHandling: 'merge', // to retain other query parameters
    });

    this.scrollToTop();
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  getVisiblePage(): void {
    const totalPagesToShow = 5;
    const visiblePageCount = Math.min(totalPagesToShow, this.totalPages);
    const startPage = Math.max(0, this.currentPage - Math.floor(visiblePageCount / 2));

    this.visiblePage = Array.from({ length: visiblePageCount }, (_, index) => startPage + index);
  }

  onNextPage() {
    if (this.currentPage < this.totalPages - 1) {
      this.onPageChange(this.currentPage + 1);
    }
  }

  onPreviousPage() {
    if (this.currentPage > 0) {
      this.onPageChange(this.currentPage - 1);
    }
  }

  onFirstPage() {
    this.onPageChange(0);
  }

  onLastPage() {
    this.onPageChange(this.totalPages - 1);
  }
  closeAddDiallog() {
    this.visibleUpdate = false
  }
  showUpdateDialog(id: number) {
    this.visibleUpdate = true
    this.orderService.getOrderById(id).subscribe({
      next: (response: any) => {
        debugger
        this.order = response;
        if (this.order) {
          this.orderForm.get('address')?.setValue(this.order.address)
          this.orderForm.get('fullname')?.setValue(this.order.fullname)
          this.orderForm.get('note')?.setValue(this.order.note)
          this.orderForm.get('phone_number')?.setValue(this.order.phone_number)
          this.orderForm.get('status')?.setValue(this.order.status)

        }
      },
      error: (error: any) => {
        debugger
        console.log(` ${error}`)
      },
    })

  }
  updateOrder() {
    const orderDto = {
      user_id: this.order?.user_id,
      fullname:  this.orderForm.get('fullname')?.value,
      phone_number: this.order?.phone_number,
      address: this.orderForm.get('address')?.value,
      payment_method: this.order?.payment_method,
      note: this.orderForm.get('note')?.value,
      status: this.orderForm.get('status')?.value,
    }
    console.log(orderDto);
    
    this.orderService.updateOrder(orderDto, this.order?.id!).subscribe({
      next: (response: any) => {
        const index = this.orders.findIndex(order => order.id === response.id)
        if (index != -1) {
          this.orders.splice(index, 1)
          this.orders.splice(index, 0, response)
        }
        this.visibleUpdate = false
        this.toastr.success(`Sửa thành công`, 'Thành công')

      },
      error: (error: any) => {
        debugger
        this.toastr.error(`Sửa thất bại: ${error.error}`, 'Thất bại')

      },
    })
  }
  deleteOrder(event: Event, id: number, index: number) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Bạn có muốn xóa đơn hàng : ' + id + ' không ',
      header: 'Xóa đơn hàng',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: "p-button-danger p-button-text",
      rejectButtonStyleClass: "p-button-text p-button-text",
      acceptIcon: "none",
      rejectIcon: "none",

      accept: () => {
        this.orderService.deleteOrder(id).subscribe({
          next: (response: any) => {
            this.orders[index].active = false
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
  onClickSearchOrdersByKeyWord(keyword: string) {
    this.keyword = keyword;
    this.currentPage = 0
    this.onPageChange(this.currentPage);
  }

  @Directive({
    selector: '[appEnterSearchOrder]'
  })
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (event.key === "Enter") {
      event.preventDefault(); // Ngăn chặn hành động mặc định của phím Enter (thường là submit form)
      // Thực hiện các hành động của bạn ở đây
      this.onClickSearchOrdersByKeyWord(this.keyword)
    }
  }
  onClickSearchOrderByStatus() {
    this.onPageChange(this.currentPage);
  }
}
