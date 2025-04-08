import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header-sidebar',
  standalone: false,
  templateUrl: './header-sidebar.component.html',
  styleUrl: './header-sidebar.component.css'
})
export class HeaderSidebarComponent implements OnInit {
  showUserCard = false;
  username = '';
  isCollapsed = false;

  constructor(private authService: AuthService, private router: Router, private eRef: ElementRef) {}

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

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }
}
