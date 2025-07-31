import { Component, inject } from '@angular/core';
import { LayoutService } from '../../../services/layout.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { PageTitleService } from '../../../services/page-title.service';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-admin-layout',
  standalone: false,
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css'
})
export class AdminLayoutComponent {
  pageTitle = '';

  public layoutService = inject(LayoutService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private pagetitleService = inject(PageTitleService);

  constructor() {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => this.getCurrentRoute(this.activatedRoute)),
        filter(route => route.outlet === 'primary'),
        map(route => route.snapshot.data['title'])
      )
      .subscribe((browserTitle: string) => {
        const finalBrowserTitle = browserTitle || 'Admin - MyShop';
        this.pagetitleService.setTitle(finalBrowserTitle);
      });

    this.pagetitleService.pageTitle$.subscribe(title => {
      this.pageTitle = title;
    });
  }

  private getCurrentRoute(route: ActivatedRoute): ActivatedRoute {
    while (route.firstChild) {
      route = route.firstChild;
    }

    return route;
  }

}
