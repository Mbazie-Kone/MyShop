import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'auth_token';

  constructor() {
    // Service initialization
  }

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {

    return localStorage.getItem(this.tokenKey);
  }

  decodeToken(): { username: string, role: string } | null {
    const token = this.getToken();

    return token ? jwtDecode<{ username: string, role: string }>(token) : null;
  }

  clearToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  isLoggedIn(): boolean {

    return !!this.getToken();
  }
}
