import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from '../models/user';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../app/environments/environment';
import { Observable } from 'rxjs';
import { HttpUtilService } from './http.util.service';
import { Product } from '../models/product';
import { Category } from '../models/category';
import { ReplyComment } from '../models/reply.comment';

@Injectable({
  providedIn: 'root'
})
export class ReplyCommentService {
  private apiReplyComment = environment.apiBaseUrl+'/reply-comments';
  constructor(private http: HttpClient,
    private httpUtilService: HttpUtilService) { }
  private apiConfig = {
    headers: this.httpUtilService.createHeaders(),
  };
  getAll(): Observable<any> {
    return this.http.get<ReplyComment[]>(this.apiReplyComment);
  }
  getAllByRatingId(rating_id: number) : Observable<any> {
    return this.http.get<ReplyComment[]>(this.apiReplyComment+`/rating/${rating_id}`);
  }
  getById(id: number) : Observable<any> {
    return this.http.get<ReplyComment>(this.apiReplyComment+`/${id}`);
  }
  create(replyComment: Object) : Observable<any> {
    return this.http.post(this.apiReplyComment,replyComment);
  }
  update(replyComment: Object,id: number) : Observable<any> {
    return this.http.put(this.apiReplyComment+`/${id}`,replyComment);
  }
  delete(id: number) : Observable<any> {
    return this.http.delete(this.apiReplyComment+`/${id}`);
  }
  
} 
