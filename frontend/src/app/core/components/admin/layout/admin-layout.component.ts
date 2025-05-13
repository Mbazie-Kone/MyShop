import { Component } from '@angular/core';
import { LayoutService } from '../../../services/layout.service';

@Component({
  selector: 'app-admin-layout',
  standalone: false,
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css'
})
export class AdminLayoutComponent {
  // COLLAPSED
  constructor(public layoutService: LayoutService) {}
}
