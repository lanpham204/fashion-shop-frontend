import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from '../models/user';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../app/environments/environment';
import { Observable } from 'rxjs';
import { HttpUtilService } from './http.util.service';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductImageService {
  private apiProductImage = environment.apiBaseUrl+'/product-images';
  constructor(private http: HttpClient,
    private httpUtilService: HttpUtilService) { }
  createProductImage(product_id: number, file: File): Observable<any> {
    const formData = new FormData();
      formData.append('file',file);
    return this.http.post(this.apiProductImage+`/create/${product_id}`,formData)
  }
  updateProductImage(id: number, file: File): Observable<any> {
    const formData = new FormData();
      formData.append('file',file);
    return this.http.put(this.apiProductImage+`/${id}`,formData)
  }
  deleteProductImage(id: number): Observable<any> {
    return this.http.delete(this.apiProductImage+`/${id}`)
  }
} 
