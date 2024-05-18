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
export class SizeService {
  private apiSize = environment.apiBaseUrl+'/sizes';
  constructor(private http: HttpClient,
    private httpUtilService: HttpUtilService) { }
  private apiConfig = {
    headers: this.httpUtilService.createHeaders(),
  };
  getAll(): Observable<any> {
    return this.http.get(this.apiSize);
  }
  getById(id: number) {
    return this.http.get<Category[]>(this.apiSize+`/${id}`);
  }
  
} 
