import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginResponse } from '../../core/models/login-response.model';
import { LoginRequest, RegisterRequest } from '../../core/models/auth-request.model';
import { Role, UserDto } from '../../core/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = environment.apiAdminUrl;

  constructor(private http: HttpClient) {}

  register(data: RegisterRequest): Observable<UserDto> {
    return this.http.post<UserDto>(`${this.apiUrl}/register`, data);
  }

  login(data: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, data);
  }

  getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(`${this.apiUrl}/roles`);
  }
}
