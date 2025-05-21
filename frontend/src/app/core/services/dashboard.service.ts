import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CategoryProductCount } from '../models/category-product-count.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = environment.apiCatalogUrl;

  constructor(private http: HttpClient) { }

  getProductCountPerCategory(): Observable<CategoryProductCount[]> {
    return this.http.get<CategoryProductCount[]>(`${this.apiUrl}/categories-count`);
  }
}
