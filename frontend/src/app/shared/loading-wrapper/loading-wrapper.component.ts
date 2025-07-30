import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-wrapper',
  standalone: false,
  templateUrl: './loading-wrapper.component.html',
  styleUrl: './loading-wrapper.component.css'
})
export class LoadingWrapperComponent {
  @Input() loading = false;
  @Input() spinnerSize = '60px';
  @Input() minHeight = '300px';
  @Input() showSpinner = true;
} 