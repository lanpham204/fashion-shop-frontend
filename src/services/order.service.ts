import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from '../models/user';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../app/environments/environment';
import { Observable } from 'rxjs';
import { HttpUtilService } from './http.util.service';
import { Product } from '../models/product';
import { Order } from '../models/order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiOrder = environment.apiBaseUrl+'/orders';
  constructor(private http: HttpClient,
    private httpUtilService: HttpUtilService) { }
  private apiConfig = {
    headers: this.httpUtilService.createHeaders(),
  };
  getOrders(page:number, size:number, keyword:string, status: string):Observable<Order[]>{
    const params=new HttpParams().set('page',page.toString()).set("size",size.toString()).set("keyword",keyword).set("status",status);
    return this.http.get<Order[]>(this.apiOrder,{params});
  }
  createOrder(order: any ):Observable<any> {
    return this.http.post(this.apiOrder,order,this.apiConfig)
  }
  createPayment(amount: number,orderId: number):Observable<any> {
    const params=new HttpParams().set('amount',amount).set('orderId',orderId);
    return this.http.get(this.apiOrder+'/create-payment',{params})
  }
  getOrderByUserId(userId: number) {
    return this.http.get<Order[]>(this.apiOrder+`/user/${userId}`)
  }
  getOrderById(orderId: number) {
    return this.http.get<Order>(this.apiOrder+`/${orderId}`)
  }
  updateOrder(order: any, orderId: number ):Observable<any> {
    return this.http.put(this.apiOrder+`/${orderId}`,order,this.apiConfig)
  }
  deleteOrder(orderId: number):Observable<any> {
    return this.http.delete(this.apiOrder+`/${orderId}`)
  }
  getCountOrderByDate(date: string) {
    return this.http.get(this.apiOrder+`/count/${date}`)
  }
  getRevenueByDate(date: string) {
    return this.http.get(this.apiOrder+`/revenue/${date}`)
  }
  getRevenueByMonth(month: string) {
    return this.http.get(this.apiOrder+`/revenue/month/${month}`)
  }
  getRevenueByYear(year: string) {
    return this.http.get(this.apiOrder+`/revenue/year/${year}`)
  }
  getMonthOfYear() {
    return this.http.get(this.apiOrder+`/months`)
  }
 
} 
