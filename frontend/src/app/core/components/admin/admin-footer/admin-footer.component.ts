import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-footer',
  standalone: false,
  templateUrl: './admin-footer.component.html',
  styleUrl: './admin-footer.component.css'
})
export class AdminFooterComponent {
  currentYear: number = new Date().getFullYear();
}
