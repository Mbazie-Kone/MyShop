import { Component } from '@angular/core';

@Component({
  selector: 'app-loading-test',
  standalone: false,
  templateUrl: './loading-test.component.html',
  styleUrl: './loading-test.component.css'
})
export class LoadingTestComponent {
  loading = false;
  testData: string[] = ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5'];

  startLoading(): void {
    this.loading = true;
    console.log('Loading started');
    
    setTimeout(() => {
      this.loading = false;
      console.log('Loading finished');
    }, 3000);
  }

  startShortLoading(): void {
    this.loading = true;
    console.log('Short loading started');
    
    setTimeout(() => {
      this.loading = false;
      console.log('Short loading finished');
    }, 1000);
  }
} 