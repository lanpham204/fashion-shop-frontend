import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from '../models/user';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../app/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUser = environment.apiBaseUrl+'/users';
  constructor(private http: HttpClient) { }
  private apiConfig = {
    headers: this.createHeader(),
  };
  private createHeader(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
    });
  }
  register(user: Object): Observable<any> {
    return this.http.post(this.apiUser+'/register',user,this.apiConfig);
  }
  login(email: string,password: string): Observable<any> {
    const user = {email,password};
    return this.http.post(this.apiUser+'/login',user);
  }
  update(user: User,token: string): Observable<any> {
    return this.http.put(this.apiUser+`/${user.id}`,{
      headers: new HttpHeaders({
        "Content-Type":"application/json",
        Authorization:`Bearer ${token}`
      })
    });
  }
  delete(id: number): Observable<any> {
    return this.http.delete(this.apiUser+`/${id}`,this.apiConfig)
  }
  getByToken(token: string):Observable<any> {
    return this.http.get(this.apiUser+'/details',{headers: new HttpHeaders({
      "Content-Type":"application/json",
        Authorization:`Bearer ${token}`
    })});
  }
  getAll(): Observable<any> {
    return this.http.get(this.apiUser);
  }
 
  getUser() : User|null  {
    try {
      const user = localStorage.getItem('user');
      if(user == null || user == undefined) {
        return null;
      } 
      return JSON.parse(user!);
    } catch (error) {
      console.log('Error retrieving use response from local storage:', error);
      return null;
    }
  }
  setUser(user?: User): void {
    try {
      if (user == null || !user) {
        return;
      }
      localStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
      console.log('error saving user local storage: ', error);
    }
  }
  removeUser() :void {
    localStorage.removeItem('user');
  }
  getStatisticalCountUsers() {
    return this.http.get(this.apiUser+`/count`)
  }
} 
