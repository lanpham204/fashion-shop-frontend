import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from '../models/user';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../app/environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartItem } from '../models/cart.item';
import { get } from 'http';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItemsSubject: BehaviorSubject<CartItem[]> = new BehaviorSubject<CartItem[]>([]);
  public cartItems$ = this.cartItemsSubject.asObservable();
  constructor(private tokenService:TokenService) {
    this.cartItemsSubject.next(this.getCart((tokenService.getUserIdByToken())));
   }
  getCart(userId: number): CartItem[] {
    return JSON.parse(localStorage.getItem('cart_'+userId) || '[]'); 
  }
  addToCart(cartItem: CartItem,userId: number): void {
    let cartItems: CartItem[] = this.getCart(userId);
  let existingProduct = cartItems.find(item =>
    item.product.id === cartItem.product.id && 
    item.color_id === cartItem.color_id && 
    item.size_id === cartItem.size_id
  );
  if (existingProduct) {
    existingProduct.quantity += cartItem.quantity;
  } else {
    cartItems.push(cartItem);
  } 

  this.saveCartToLocalStorage(cartItems,userId);
  this.cartItemsSubject.next(cartItems);
  }
  addQuantityCart(cartItem: CartItem,method: string,userId: number): void {
    let cartItems: CartItem[] = this.getCart(userId);
    let existingProduct = cartItems.find(item =>
      item.product.id === cartItem.product.id && 
      item.color_id === cartItem.color_id && 
      item.size_id === cartItem.size_id
    );
    if(existingProduct) {
      if(method === '+') {
        existingProduct.quantity =  existingProduct.quantity + 1
      } else if(method === '-') {
        if(existingProduct.quantity == 1) {
          existingProduct.quantity = 1;
        } else {
        existingProduct.quantity =  existingProduct.quantity - 1
        }
      }
    }
    this.saveCartToLocalStorage(cartItems,userId);
    this.cartItemsSubject.next(cartItems);
  }
  removeItemFromCart(cartItem: CartItem,userId: number): void {
    debugger
    let cartItems: CartItem[] = this.getCart(userId);
    const removedIndex = cartItems.findIndex(item => {
      debugger
      return item.product.id == cartItem.product.id && item.color_id == cartItem.color_id && item.size_id == cartItem.size_id})
      if(removedIndex != -1) {
        cartItems.splice(removedIndex,1)
        this.saveCartToLocalStorage(cartItems,userId);
        this.cartItemsSubject.next(cartItems);
      }
      
    
  }

  deleteCart(userId: number): void {
    localStorage.removeItem('cart_'+userId);
    this.cartItemsSubject.next([]);
  }


  private saveCartToLocalStorage(cartItems: CartItem[],userId: number): void {
    localStorage.setItem('cart_'+userId, JSON.stringify(cartItems));
  }
} 
