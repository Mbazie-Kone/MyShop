import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category, Product } from '../../core/models/catalog.model';
import { ViewAllProductsDto } from '../../core/models/view-all-products.dto';

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

  getAllProducts(): Observable<ViewAllProductsDto[]> {
    return this.http.get<ViewAllProductsDto[]>(`${this.apiUrl}/products`);
  }

}
