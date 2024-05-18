import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from '../models/user';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../app/environments/environment';
import { Observable } from 'rxjs';
import { HttpUtilService } from './http.util.service';
import { Product } from '../models/product';
import { Category } from '../models/category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiCategory = environment.apiBaseUrl+'/categories';
  constructor(private http: HttpClient,
    private httpUtilService: HttpUtilService) { }
  private apiConfig = {
    headers: this.httpUtilService.createHeaders(),
  };
  getAll(): Observable<any> {
    return this.http.get(this.apiCategory);
  }
  getById(id: number) {
    return this.http.get<Category[]>(this.apiCategory+`/${id}`);
  }
  create(category: Object) {
    return this.http.post(this.apiCategory,category);
  }
  update(category: Object,id: number) {
    return this.http.put(this.apiCategory+`/${id}`,category);
  }
  delete(id: number) {
    return this.http.delete(this.apiCategory+`/${id}`);
  }
  
} 
