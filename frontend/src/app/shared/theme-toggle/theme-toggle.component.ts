import { Component, OnInit, OnDestroy } from '@angular/core';
import { ThemeService, ThemeState } from '../../core/services/theme.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  template: `
    <button 
      type="button" 
      class="btn btn-outline-secondary theme-toggle-btn"
      (click)="toggleTheme()"
      [title]="currentTheme.isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
      [attr.aria-label]="currentTheme.isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
      [attr.aria-pressed]="currentTheme.isDarkMode">
      <i [class]="currentTheme.isDarkMode ? 'icon-sun' : 'icon-moon'"></i>
      <span class="theme-toggle-text">
        {{ currentTheme.isDarkMode ? 'Light Mode' : 'Dark Mode' }}
      </span>
    </button>
  `,
  styles: [`
    .theme-toggle-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.3s ease;
      border-radius: 20px;
      padding: 0.5rem 1rem;
    }

    .theme-toggle-btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    }

    .theme-toggle-btn:focus {
      outline: 2px solid #4e73df;
      outline-offset: 2px;
    }

    .theme-toggle-text {
      font-size: 0.875rem;
      font-weight: 500;
    }

    /* Dark mode styles for the toggle button itself */
    :host-context(.dark-mode) .theme-toggle-btn {
      background-color: #2d3748;
      border-color: #4a5568;
      color: #e2e8f0;
    }

    :host-context(.dark-mode) .theme-toggle-btn:hover {
      background-color: #4a5568;
      border-color: #718096;
    }

    /* Light mode styles */
    :host-context(.light-mode) .theme-toggle-btn {
      background-color: #ffffff;
      border-color: #d1d5db;
      color: #374151;
    }

    :host-context(.light-mode) .theme-toggle-btn:hover {
      background-color: #f9fafb;
      border-color: #9ca3af;
    }

    /* Reduced motion support */
    @media (prefers-reduced-motion: reduce) {
      .theme-toggle-btn {
        transition: none;
      }
      
      .theme-toggle-btn:hover {
        transform: none;
      }
    }

    /* Print styles */
    @media print {
      .theme-toggle-btn {
        display: none !important;
      }
    }
  `]
})
export class ThemeToggleComponent implements OnInit, OnDestroy {
  currentTheme: ThemeState = { isDarkMode: false };
  private subscription: Subscription = new Subscription();

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    this.subscription.add(
      this.themeService.theme$.subscribe(theme => {
        this.currentTheme = theme;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  toggleTheme(): void {
    this.themeService.toggleDarkMode();
  }
} 