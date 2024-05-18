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
export class ProductService {
  private apiProduct = environment.apiBaseUrl+'/products';
  constructor(private http: HttpClient,
    private httpUtilService: HttpUtilService) { }
  private apiConfig = {
    headers: this.httpUtilService.createHeaders(),
  };
  getProducts(page:number, size:number, keyword:string, cateId:number):Observable<Product[]>{
    const params=new HttpParams().set('page',page.toString()).set("size",size.toString()).set("cateId",cateId).set("keyword",keyword);
    return this.http.get<Product[]>(this.apiProduct,{params});
  }
  getAll(): Observable<any> {
    return this.http.get<Product[]>(this.apiProduct+'/all');
  }
  getProductById(id: number) {
    return this.http.get<Product>(this.apiProduct+`/${id}`)
  }
  createProduct(product: Object): Observable<any> {
    return this.http.post(this.apiProduct,product,this.apiConfig)
  }
  upadateProduct(id: number,product: Object): Observable<any> {
    return this.http.put(this.apiProduct+`/${id}`,product)
  }
  deleteProduct(id: number): Observable<any> {
    return this.http.delete(this.apiProduct+`/${id}`)
  }
  createProductImages(id: number, files: File[]): Observable<any> {
    const formData = new FormData();
    for (let index = 0; index < files.length; index++) {
      formData.append('files',files[index]);
    }
    return this.http.post(this.apiProduct+`/uploads/${id}`,formData)
  }
} 
