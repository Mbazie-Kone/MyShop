import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-spinner',
  standalone: false,
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.css'
})
export class SpinnerComponent {
  @Input() size: string = '50px';
}
