import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ThemeMode = 'light' | 'dark' | 'system';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private currentThemeSubject = new BehaviorSubject<ThemeMode>('system');
  public currentTheme$ = this.currentThemeSubject.asObservable();

  private readonly THEME_KEY = 'app-theme';

  constructor() {
    this.initializeTheme();
  }

  private initializeTheme(): void {
    const savedTheme = localStorage.getItem(this.THEME_KEY) as ThemeMode;
    if (savedTheme) {
      this.setTheme(savedTheme);
    } else {
      this.setTheme('system');
    }
  }

  public setTheme(theme: ThemeMode): void {
    console.log('Setting theme to:', theme); // Debug log
    this.currentThemeSubject.next(theme);
    localStorage.setItem(this.THEME_KEY, theme);
    this.applyTheme(theme);
  }

  public getCurrentTheme(): ThemeMode {
    return this.currentThemeSubject.value;
  }

  public toggleTheme(): void {
    const currentTheme = this.getCurrentTheme();
    console.log('Toggling theme from:', currentTheme); // Debug log
    if (currentTheme === 'system') {
      // Se è system, passa a light
      this.setTheme('light');
    } else if (currentTheme === 'light') {
      // Se è light, passa a dark
      this.setTheme('dark');
    } else {
      // Se è dark, passa a system
      this.setTheme('system');
    }
  }

  public getEffectiveTheme(): 'light' | 'dark' {
    const currentTheme = this.getCurrentTheme();
    
    if (currentTheme === 'system') {
      // Controlla la preferenza del sistema
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    
    return currentTheme;
  }

  private applyTheme(theme: ThemeMode): void {
    const body = document.body;
    
    console.log('Applying theme:', theme); // Debug log
    
    // Rimuovi le classi esistenti
    body.classList.remove('theme-light', 'theme-dark');
    
    if (theme === 'system') {
      // Per system, usa le media queries CSS
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const effectiveTheme = isDark ? 'theme-dark' : 'theme-light';
      body.classList.add(effectiveTheme);
      console.log('System theme applied:', effectiveTheme); // Debug log
    } else {
      // Per light/dark espliciti, aggiungi la classe corrispondente
      body.classList.add(`theme-${theme}`);
      console.log('Explicit theme applied: theme-' + theme); // Debug log
    }
    
    console.log('Body classes after theme application:', body.className); // Debug log
  }

  // Listener per i cambiamenti di preferenza del sistema
  public setupSystemThemeListener(): void {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    mediaQuery.addEventListener('change', (e) => {
      if (this.getCurrentTheme() === 'system') {
        this.applyTheme('system');
      }
    });
  }

  // Metodo di test per verificare il funzionamento
  public testThemeSystem(): void {
    console.log('=== THEME SYSTEM TEST ===');
    console.log('Current theme:', this.getCurrentTheme());
    console.log('Effective theme:', this.getEffectiveTheme());
    console.log('Body classes:', document.body.className);
    console.log('System prefers dark:', window.matchMedia('(prefers-color-scheme: dark)').matches);
    console.log('LocalStorage theme:', localStorage.getItem(this.THEME_KEY));
    console.log('========================');
  }
} 