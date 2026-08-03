import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  // ინახავს ტოკენს localStorage-ში ან აბრუნებს მას
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // ტოკენის შენახვა
  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  // სისტემიდან გამოსვლა
  logout(): void {
    localStorage.removeItem('token');
  }
}