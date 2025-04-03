import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginResponse } from '../../core/models/login-response.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  register(data: any) {

    return this.http.post(`${this.apiUrl}/register`, data);
  }

  login(data: any): Observable<LoginResponse> {

    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, data);
  }

  getRoles(): Observable<any[]> {

    return this.http.get<any[]>(`${this.apiUrl}/roles`);
  }
}
