import { Component } from '@angular/core';
import { LayoutService } from '../../../services/layout.service';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-admin-layout',
  standalone: false,
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css'
})
export class AdminLayoutComponent {
  pageTitle: string = '';

  // COLLAPSED
  constructor(public layoutService: LayoutService, private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.setPageTitle(this.router.url);
    });
  }

  private setPageTitle(url: string): void {
    if (url.includes('/administration/dashboard')) {
      this.pageTitle = 'MyShop';
    } else if (url.includes('/administration/view-products')) {
      this.pageTitle = 'Products';
    }
  }
}
