import { Component } from '@angular/core';
import { PageTitleService } from '../../../../core/services/page-title.service';
import { CatalogService } from '../../../services/catalog.service';
import { ViewAllProductsDto } from '../../../../core/models/view-all-products.dto';

@Component({
  selector: 'app-view-products',
  standalone: false,
  templateUrl: './view-products.component.html',
  styleUrl: './view-products.component.css'
})
export class ViewProductsComponent {
  pageTitle: string = '';
  products: ViewAllProductsDto[] = [];

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

  constructor(private pageTitleService: PageTitleService, private catalogService: CatalogService) {
    this.pageTitleService.pageTitle$.subscribe(title => {
      this.pageTitle = title;
    });
  }

  ngOnInit(): void {
    this.catalogService.getAllProducts().subscribe(data => {
      console.log('Products:', data);
      this.products = data;
      this.applyFilters();
    });
  }

  get totalPages(): number {
    return Math.ceil(this.filteredProducts.length / this.itemsPerPage);
  }
  
  get totalPagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  applyFilters() {
    this.filteredProducts = this.products.filter(p => {
      const matchesName = this.searchTerm === '' || p.productName.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesCategory = this.selectedCategory === '' || p.categoryName === this.selectedCategory;
      const matchesStatus = this.selectedStatus === '' || (p.isActive ? 'Active' : 'Deactivate') === this.selectedStatus;

      return matchesName && matchesCategory && matchesStatus;
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
