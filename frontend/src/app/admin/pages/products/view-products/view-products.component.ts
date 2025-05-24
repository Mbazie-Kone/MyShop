import { Component } from '@angular/core';
import { PageTitleService } from '../../../../core/services/page-title.service';

@Component({
  selector: 'app-view-products',
  standalone: false,
  templateUrl: './view-products.component.html',
  styleUrl: './view-products.component.css'
})
export class ViewProductsComponent {
  pageTitle: string = '';

  constructor(private pageTitleService: PageTitleService) {
    this.pageTitleService.pageTitle$.subscribe(title => {
      this.pageTitle = title;
    });
  }
}
