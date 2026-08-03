import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'https://trainsapi.stepacademy.ge/api';

  constructor(private http: HttpClient) {}

  // ავტორიზაცია
  register(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/register`, data);
  }

  login(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/login`, data);
  }

  // სადგურები
  getStations(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/stations`);
  }

  // მატარებლები და განრიგები
  getSchedules(trainId?: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/schedules`, { params: trainId ? { trainId } : {} });
  }
}