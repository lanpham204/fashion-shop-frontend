import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from '../models/user';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../app/environments/environment';
import { Observable } from 'rxjs';
import { HttpUtilService } from './http.util.service';
import { Product } from '../models/product';
import { Order } from '../models/order';
import { OrderDetail } from '../models/order.detail';

@Injectable({
  providedIn: 'root'
})
export class OrderDetailService {
  private apiOrderDetail = environment.apiBaseUrl+'/order-details';
  constructor(private http: HttpClient,
    private httpUtilService: HttpUtilService) { }
  private apiConfig = {
    headers: this.httpUtilService.createHeaders(),
  };
  // createOrderDetail(orderDetail: any ):Observable<any> {
  //   return this.http.post(this.apiOrderDetail,orderDetail,this.apiConfig)
  // }

  getOrderDetailById(orderDetailId: number) {
    return this.http.get<OrderDetail>(this.apiOrderDetail+`/${orderDetailId}`)
  }
  updateOrderDetail(order: any, orderId: number ):Observable<any> {
    return this.http.put(this.apiOrderDetail+`/${orderId}`,order,this.apiConfig)
  }
  deleteOrderDetail(orderId: number):Observable<any> {
    return this.http.delete(this.apiOrderDetail+`/${orderId}`)
  }
  
} 
