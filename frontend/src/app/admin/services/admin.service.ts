import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginResponse } from '../../core/models/login-response.model';
import { LoginRequest, RegisterRequest } from '../../core/models/auth-request.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  register(data: RegisterRequest): Observable<any> {

    return this.http.post(`${this.apiUrl}/register`, data);
  }

  login(data: LoginRequest): Observable<LoginResponse> {

    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, data);
  }

  getRoles(): Observable<any[]> {

    return this.http.get<any[]>(`${this.apiUrl}/roles`);
  }
}
