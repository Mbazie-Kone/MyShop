import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService, ThemeMode } from '../../core/services/theme.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="theme-toggle-container">
      <button 
        type="button" 
        class="btn btn-outline-secondary theme-toggle-btn"
        (click)="toggleTheme()"
        [title]="getTooltipText()"
        aria-label="Toggle theme">
        <i [class]="getIconClass()"></i>
        <span class="theme-label">{{ getThemeLabel() }}</span>
      </button>
    </div>
  `,
  styles: [`
    .theme-toggle-container {
      display: flex;
      align-items: center;
    }

    .theme-toggle-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 0.75rem;
      border-radius: 0.5rem;
      transition: all 0.3s ease;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: inherit;
      font-size: 0.9rem;
      min-height: 36px;
    }

    .theme-toggle-btn:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .theme-toggle-btn i {
      font-size: 1rem;
    }

    .theme-label {
      font-size: 0.85rem;
      font-weight: 500;
    }

    /* Dark mode styles */
    @media (prefers-color-scheme: dark) {
      .theme-toggle-btn {
        background: rgba(255, 255, 255, 0.05);
        border-color: rgba(255, 255, 255, 0.1);
      }

      .theme-toggle-btn:hover {
        background: rgba(255, 255, 255, 0.1);
      }
    }

    /* Theme-specific styles */
    .theme-light .theme-toggle-btn {
      background: rgba(0, 0, 0, 0.05);
      border-color: rgba(0, 0, 0, 0.1);
      color: #374151;
    }

    .theme-light .theme-toggle-btn:hover {
      background: rgba(0, 0, 0, 0.1);
    }

    .theme-dark .theme-toggle-btn {
      background: rgba(255, 255, 255, 0.05);
      border-color: rgba(255, 255, 255, 0.1);
      color: #e2e8f0;
    }

    .theme-dark .theme-toggle-btn:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    /* Responsive */
    @media (max-width: 768px) {
      .theme-label {
        display: none;
      }

      .theme-toggle-btn {
        padding: 0.5rem;
        min-width: 36px;
        justify-content: center;
        gap: 0;
      }
    }

    /* Extra small screens */
    @media (max-width: 576px) {
      .theme-toggle-btn {
        min-width: 32px;
        padding: 0.4rem;
      }
      
      .theme-toggle-btn i {
        font-size: 0.9rem;
      }
    }
  `]
})
export class ThemeToggleComponent implements OnInit, OnDestroy {
  private subscription: Subscription = new Subscription();
  public currentTheme: ThemeMode = 'system';

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    // Setup listener per i cambiamenti di preferenza del sistema
    this.themeService.setupSystemThemeListener();
    
    // Sottoscriviti ai cambiamenti del tema
    this.subscription.add(
      this.themeService.currentTheme$.subscribe(theme => {
        this.currentTheme = theme;
        console.log('Theme changed to:', theme); // Debug log
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  toggleTheme(): void {
    console.log('Toggle theme clicked, current theme:', this.currentTheme); // Debug log
    this.themeService.toggleTheme();
  }

  getCurrentTheme(): ThemeMode {
    return this.currentTheme;
  }

  getIconClass(): string {
    const theme = this.getCurrentTheme();
    switch (theme) {
      case 'light':
        return 'icon-light';
      case 'dark':
        return 'icon-dark';
      case 'system':
        return 'icon-adjust';
      default:
        return 'icon-adjust';
    }
  }

  getThemeLabel(): string {
    const theme = this.getCurrentTheme();
    switch (theme) {
      case 'light':
        return 'Light';
      case 'dark':
        return 'Dark';
      case 'system':
        return 'Auto';
      default:
        return 'Auto';
    }
  }

  getTooltipText(): string {
    const theme = this.getCurrentTheme();
    switch (theme) {
      case 'light':
        return 'Switch to Dark Mode';
      case 'dark':
        return 'Switch to System Preference';
      case 'system':
        return 'Switch to Light Mode';
      default:
        return 'Toggle Theme';
    }
  }
} 