import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private jwtHelperService = new JwtHelperService();
  private readonly TOKEN_KEY = 'access_token';
  constructor() { }
  setToken(token: string) {
    localStorage.setItem(this.TOKEN_KEY,token)
  }
  getToken(): string|null {
    return localStorage.getItem(this.TOKEN_KEY)
  }
  removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY)
  }
  isTokenExpired(): boolean {
    if(this.getToken == null) {
      return false;
    }
    return this.jwtHelperService.isTokenExpired(this.getToken()!);
  }
  getUserIdByToken():number {
    const userObject = this.jwtHelperService.decodeToken(this.getToken() ??'');
    if(userObject == null) {
      return 0;
    }
    return 'userId' in userObject ? parseInt(userObject['userId']):0;
  }
  getRoleIdByToken():number {
    const userObject = this.jwtHelperService.decodeToken(this.getToken() ??'');
    if(userObject == null) {
      return 0;
    }
    return 'roleId' in userObject ? parseInt(userObject['roleId']):0;
  }
}
