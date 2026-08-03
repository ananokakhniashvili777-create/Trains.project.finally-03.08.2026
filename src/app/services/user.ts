import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'https://trains.stepacademy.ge/api/users';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  // Headers ავტორიზაციის ტოკენით
  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // 1. GET /api/users/me (ჩემი პროფილის წამოღება)
  getProfile(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/me`, {
      headers: this.getAuthHeaders()
    });
  }

  // 2. PUT /api/users (პროფილის რედაქტირება)
  updateProfile(data: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    address?: string;
    pictureUrl?: string;
    dateOfBirth?: string;
  }): Observable<any> {
    return this.http.put<any>(this.apiUrl, data, {
      headers: this.getAuthHeaders()
    });
  }

  // 3. PUT /api/users/change-password (პაროლის შეცვლა)
  changePassword(passwords: { currentPassword: string; newPassword: string }): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/change-password`, passwords, {
      headers: this.getAuthHeaders()
    });
  }

  // 4. DELETE /api/users/delete-profile (ანგარიშის წაშლა)
  deleteProfile(): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete-profile`, {
      headers: this.getAuthHeaders()
    });
  }
}