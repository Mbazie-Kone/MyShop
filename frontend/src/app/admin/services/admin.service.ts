import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) {}

  register(data: any) {

    return this.http.post(`${this.apiUrl}/register`, data);
  }

  login(data: any) {

    return this.http.post(`${this.apiUrl}/login`, data);
  }
}
