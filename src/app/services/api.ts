import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'https://trainsapi.stepacademy.ge/api';

  constructor(private http: HttpClient) {}

  getStations(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/stations`).pipe(
      catchError(() => of([]))
    );
  }

  getTrains(): Observable<any> {
    return this.http.get(`${this.baseUrl}/trains`).pipe(
      catchError(() => of([]))
    );
  }
}