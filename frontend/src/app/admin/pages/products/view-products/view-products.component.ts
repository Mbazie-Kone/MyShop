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
  currentPage = 1;
  itemsPerPage = 10;

  // Filter
  searchTerm = '';
  selectedCategory = '';
  selectedStatus = '';
  filteredProducts: ViewAllProductsDto[] = [];

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

  applyFilters() {
    this.filteredProducts = this.products.filter(p => {
      const matchesName = this.searchTerm === '' || p.productName.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesCategory = this.selectedCategory === '' || p.categoryName === this.selectedCategory;
      const matchesStatus = this.selectedStatus === '' || (p.isActive ? 'Active' : 'Deactivate') === this.selectedStatus;

      return matchesName && matchesCategory && matchesStatus;
    });
    this.currentPage = 1;
  }

  get uniqueCategories(): string[] {
    const categories = this.products.map(p => p.categoryName);

    return [...new Set(categories)];
  }
}
