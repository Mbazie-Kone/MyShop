import { Component } from '@angular/core';
import { PageTitleService } from '../../../../core/services/page-title.service';
import { Product } from '../../../../core/models/catalog.model';
import { CatalogService } from '../../../services/catalog.service';

@Component({
  selector: 'app-view-products',
  standalone: false,
  templateUrl: './view-products.component.html',
  styleUrl: './view-products.component.css'
})
export class ViewProductsComponent {
  pageTitle: string = '';

  products: Product[] = [];

  constructor(private pageTitleService: PageTitleService, private catalogService: CatalogService) {
    this.pageTitleService.pageTitle$.subscribe(title => {
      this.pageTitle = title;
    });
  }

  ngOnInit(): void {
    this.catalogService.getAllProducts().subscribe(data => {
      this.products = data;
    })
  }
}
