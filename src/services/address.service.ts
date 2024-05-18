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
export class AddressService {
  constructor(private http: HttpClient) { }
  getAllProvinces(): Observable<any> {
    return this.http.get<any>('assets/tinh_tp.json');
  }
  getAllDistricts(): Observable<any> {
    return this.http.get<any>('assets/quan_huyen.json');
  }
  getAllWard(): Observable<any> {
    return this.http.get<any>('assets/phuong_xa.json');
  }
  
} 
