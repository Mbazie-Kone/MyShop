import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category, ProductInputDto } from '../../core/models/catalog.model';
import { ViewAllProductsDto } from '../../core/models/view-all-products.dto';
import { UpdateProductDetailsDto } from '../../core/models/update-product-details.dto';

@Injectable({
  providedIn: 'root'
})
export class CatalogService {
  private apiUrl = environment.apiCatalogUrl;

  private http = inject(HttpClient);

  // GET
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/categories`);
  }

  getAllProducts(): Observable<ViewAllProductsDto[]> {
    return this.http.get<ViewAllProductsDto[]>(`${this.apiUrl}/products`);
  }

  getProductById(id: number): Observable<UpdateProductDetailsDto> {
    return this.http.get<UpdateProductDetailsDto>(`${this.apiUrl}/product/${id}`);
  }

  // POST
  createProduct(formData: FormData): Observable<ProductInputDto> {
    return this.http.post<ProductInputDto>(`${this.apiUrl}/add-product`, formData);
  }

  // PUT
  updateProduct(id: number, formData: FormData): Observable<UpdateProductDetailsDto> {
    return this.http.put<UpdateProductDetailsDto>(`${this.apiUrl}/update-product/${id}`, formData);
  }

  // DELETE
  deleteProduct(id: number): Observable<unknown> {
    return this.http.delete(`${this.apiUrl}/delete-product/${id}`);
  }

  // OTHERS
  
  // SKU Generation
  generateSku(categoryId: number, productName: string): Observable<{sku: string, message: string}> {

    return this.http.get<{sku: string, message: string}>(`${this.apiUrl}/generate-sku`, {
      params: {
        categoryId: categoryId.toString(),
        productName: productName
      }
    });
  }

}
