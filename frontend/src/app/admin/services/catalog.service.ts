import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category, Product } from '../../core/models/catalog.model';

@Injectable({
  providedIn: 'root'
})
export class CatalogService {
  private apiUrl = environment.apiCatalogUrl;

  constructor(private http: HttpClient) { }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/categories`);
  }

  createProduct(formData: FormData): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/add-product`, formData);
  }

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products`);
  }

}
