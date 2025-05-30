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

  constructor(private pageTitleService: PageTitleService, private catalogService: CatalogService) {
    this.pageTitleService.pageTitle$.subscribe(title => {
      this.pageTitle = title;
    });
  }

  ngOnInit(): void {
    this.catalogService.getAllProducts().subscribe(data => {
      console.log('Products:', data);
      this.products = data;
    });
  }
}
