import { Component } from '@angular/core';
import { CatalogService } from '../../../services/catalog.service';
import { ViewAllProductsDto } from '../../../../core/models/view-all-products.dto';

@Component({
  selector: 'app-view-products',
  standalone: false,
  templateUrl: './view-products.component.html',
  styleUrl: './view-products.component.css'
})
export class ViewProductsComponent {
  products: ViewAllProductsDto[] = [];
  loading: boolean = true; // Aggiunta proprietà per gestire lo stato di caricamento

  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 10;
  filteredProducts: ViewAllProductsDto[] = [];
  paginatedProducts: ViewAllProductsDto[] = [];
  pageSizeOptions: number[] = [10, 25, 50, 100];

  // Filter
  searchTerm = '';
  selectedCategory = '';
  selectedStatus = '';

  constructor(private catalogService: CatalogService) {}

  ngOnInit(): void {
    this.loading = true; // Imposta loading a true all'inizio
    console.log('Loading started:', this.loading);
    
    // Aggiungiamo un delay artificiale per testare lo spinner
    setTimeout(() => {
      this.catalogService.getAllProducts().subscribe({
        next: (data) => {
          console.log('Products loaded:', data);
          this.products = Array.isArray(data) ? data : [];
          this.applyFilters();
          this.loading = false; // Imposta loading a false quando i dati sono caricati
          console.log('Loading finished:', this.loading);
        },
        error: (error) => {
          console.error('Error loading products:', error);
          this.loading = false; // Imposta loading a false anche in caso di errore
          console.log('Loading finished with error:', this.loading);
        }
      });
    }, 3000); // 3 secondi di delay per testare
  }

  // Metodo per testare il loading manualmente
  testLoading(): void {
    this.loading = true;
    console.log('Test loading started:', this.loading);
    setTimeout(() => {
      this.loading = false;
      console.log('Test loading finished:', this.loading);
    }, 2000);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredProducts.length / this.itemsPerPage);
  }
  
  get totalPagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  applyFilters() {
    this.filteredProducts = this.products.filter(p => {
      const matchesCode = this.searchTerm === '' || p.productCode.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesCategory = this.selectedCategory === '' || p.categoryName === this.selectedCategory;
      const matchesStatus = this.selectedStatus === '' || (p.isActive ? 'Available' : 'Not available') === this.selectedStatus;

      return matchesCode && matchesCategory && matchesStatus;
    });
    this.currentPage = 1;
    this.updatePaginatedProducts();
  }

  updatePaginatedProducts(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedProducts = this.filteredProducts.slice(start, end);
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedProducts();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedProducts();
    }
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.updatePaginatedProducts();
  }

  get uniqueCategories(): string[] {
    const categories = this.products.map(p => p.categoryName);

    return [...new Set(categories)];
  }

  confirmDelete(id: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.catalogService.deleteProduct(id).subscribe({
        next: () => {
          this.products = this.products.filter(p => p.productId !== id);
          this.applyFilters();
        },
        error: (err) => {
          console.error('Delete failed', err);
          alert('Error deleting product');
        }
      });
    }
  }
}