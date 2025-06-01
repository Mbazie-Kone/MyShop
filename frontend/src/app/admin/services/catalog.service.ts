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

  // GET
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/categories`);
  }

  getAllProducts(): Observable<ViewAllProductsDto[]> {
    return this.http.get<ViewAllProductsDto[]>(`${this.apiUrl}/products`);
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/product/${id}`);
  }

  // POST
  createProduct(formData: FormData): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/add-product`, formData);
  }

  // PUT
  updateProduct(id: number, formData: FormData): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/product/${id}`, formData);
  }

  // DELETE
  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete-product/${id}`);
  }

}
