import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from '../models/user';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../app/environments/environment';
import { Observable } from 'rxjs';
import { HttpUtilService } from './http.util.service';
import { Product } from '../models/product';
import { Category } from '../models/category';
import { SizeProduct } from '../models/size.product';
import { Obj } from '@popperjs/core';

@Injectable({
  providedIn: 'root'
})
export class SizeProductService {
  private apiSizeProduct = environment.apiBaseUrl+'/size-products';
  constructor(private http: HttpClient,
    private httpUtilService: HttpUtilService) { }
  private apiConfig = {
    headers: this.httpUtilService.createHeaders(),
  };
  getByProductId(product_id: number): Observable<any> {
    const params = new HttpParams().set('product_id',product_id)
    return this.http.get<SizeProduct[]>(this.apiSizeProduct,{params});
  }
  create(sizeProduct: Object): Observable<any> {
    return this.http.post(this.apiSizeProduct,sizeProduct);
  }
  delete(product_id:number, size_id: number): Observable<any> {
    const params = new HttpParams().set('product_id',product_id).set('size_id',size_id)

    return this.http.delete(`${this.apiSizeProduct}`,{params});
  }
} 
