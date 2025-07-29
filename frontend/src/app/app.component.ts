import { Component, OnInit } from '@angular/core';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'frontend';

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    // Inizializza il tema all'avvio dell'applicazione
    console.log('App initialized, current theme:', this.themeService.getCurrentTheme());
    
    // Test del sistema di temi
    setTimeout(() => {
      this.themeService.testThemeSystem();
    }, 1000);
  }
}
