import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CatalogService {
  private apiUrl = environment.apiCatalogUrl;

  constructor(private http: HttpClient) { }

  createProduct(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/add-product`, formData);
  }

  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/categories`);
  }
}
