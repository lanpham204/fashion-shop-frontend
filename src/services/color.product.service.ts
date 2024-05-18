import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from '../models/user';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../app/environments/environment';
import { Observable } from 'rxjs';
import { HttpUtilService } from './http.util.service';
import { Product } from '../models/product';
import { Category } from '../models/category';
import { Obj } from '@popperjs/core';
import { ColorProduct } from '../models/color.product';

@Injectable({
  providedIn: 'root'
})
export class ColorProductService {
  private apiColorProduct = environment.apiBaseUrl+'/color-products';
  constructor(private http: HttpClient,
    private httpUtilService: HttpUtilService) { }
  getByProductId(product_id: number): Observable<any> {
    const params = new HttpParams().set('product_id',product_id)
    return this.http.get<ColorProduct[]>(this.apiColorProduct,{params});
  }
  create(colorProduct: Object): Observable<any> {
    return this.http.post(this.apiColorProduct,colorProduct);
  }
  delete(product_id:number, color_id: number): Observable<any> {
    const params = new HttpParams().set('product_id',product_id).set('color_id',color_id)
    return this.http.delete(`${this.apiColorProduct}`,{params});
  }
} 
