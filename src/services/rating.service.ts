import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from '../models/user';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../app/environments/environment';
import { Observable } from 'rxjs';
import { HttpUtilService } from './http.util.service';
import { Product } from '../models/product';
import { Category } from '../models/category';
import { Rating } from '../models/rating';

@Injectable({
  providedIn: 'root'
})
export class RatingService {
  private apiRating = environment.apiBaseUrl+'/ratings';
  constructor(private http: HttpClient,
    private httpUtilService: HttpUtilService) { }
  private apiConfig = {
    headers: this.httpUtilService.createHeaders(),
  };
  getAll(): Observable<any> {
    return this.http.get<Rating[]>(this.apiRating);
  }
  getAllByProductId(product_id: number) : Observable<any> {
    return this.http.get<Rating[]>(this.apiRating+`/product/${product_id}`);
  }
  getById(id: number) : Observable<any> {
    return this.http.get<Rating>(this.apiRating+`/${id}`);
  }
  create(rating: Object) : Observable<any> {
    return this.http.post(this.apiRating,rating);
  }
  update(rating: Object,id: number) : Observable<any> {
    return this.http.put(this.apiRating+`/${id}`,rating);
  }
  delete(id: number) : Observable<any> {
    return this.http.delete(this.apiRating+`/${id}`);
  }
  
} 
