import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { LayoutService } from '../../../services/layout.service';

@Component({
  selector: 'app-header-sidebar',
  standalone: false,
  templateUrl: './header-sidebar.component.html',
  styleUrl: './header-sidebar.component.css'
})
export class HeaderSidebarComponent implements OnInit {
  showUserCard = false;
  username = '';

  constructor(private authService: AuthService, private router: Router, private eRef: ElementRef, public layoutService: LayoutService) {}

  ngOnInit() {
    const tokenData = this.authService.decodeToken();
    this.username = tokenData?.username || 'User';
  }

  toggleUserCard() {
    this.showUserCard  = !this.showUserCard;
  }

  logout(): void {
    this.authService.clearToken();
    this.router.navigate(['/admin/login']);
  }

  @HostListener('document:click', ['$event'])
  onclickOutside(event: MouseEvent) {
    if (this.showUserCard && !this.eRef.nativeElement.contains(event.target)) {
      this.showUserCard = false;
    }
  }

  // COLLAPSED
  toggleSidebar() {
    this.layoutService.toggle();
  }

  // Check if current route is related to products
  isProductsActive(): boolean {
    const currentUrl = this.router.url;
    return currentUrl.includes('/administration/view-products') || 
           currentUrl.includes('/administration/add-product') || 
           currentUrl.includes('/administration/edit-product');
  }

}
