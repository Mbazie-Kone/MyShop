import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header-sidebar',
  standalone: false,
  templateUrl: './header-sidebar.component.html',
  styleUrl: './header-sidebar.component.css'
})
export class HeaderSidebarComponent {
  isMenuOpen = false;

  constructor(private authService: AuthService, private router: Router) {}

  toggleMenu(): void {
    this.isMenuOpen  = !this.isMenuOpen;
  }

  logout(): void {
    this.authService.clearToken();
    this.router.navigate(['/admin/login']);
  }
}
