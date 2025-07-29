import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-wrapper',
  standalone: false,
  templateUrl: './loading-wrapper.component.html',
  styleUrl: './loading-wrapper.component.css'
})
export class LoadingWrapperComponent {
  @Input() loading: boolean = false;
  @Input() spinnerSize: string = '60px';
  @Input() minHeight: string = '300px';
  @Input() showSpinner: boolean = true;
} 