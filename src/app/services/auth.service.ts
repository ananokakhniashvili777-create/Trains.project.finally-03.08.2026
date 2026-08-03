import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // 👈 პროქსის გამო დომენი აღარ გვჭირდება, ვტოვებთ ცარიელს:
  private baseUrl = '';

  constructor(private http: HttpClient) {}

  // 1. შესვლა (Login)
  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/auth/login`, credentials);
  }

  // 2. მიმდინარე მომხმარებლის მონაცემები
  getCurrentUser(): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/users/me`);
  }
}