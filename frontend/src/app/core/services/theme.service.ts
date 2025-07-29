import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ThemeState {
  isDarkMode: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'myshop-theme-preference';
  private themeSubject = new BehaviorSubject<ThemeState>({ isDarkMode: false });
  
  public theme$ = this.themeSubject.asObservable();

  constructor() {
    this.loadThemePreference();
  }

  private loadThemePreference(): void {
    const savedTheme = localStorage.getItem(this.THEME_KEY);
    if (savedTheme) {
      const themeState = JSON.parse(savedTheme);
      this.themeSubject.next(themeState);
      this.applyTheme(themeState.isDarkMode);
    } else {
      // Default to light mode if no preference is saved
      this.themeSubject.next({ isDarkMode: false });
      this.applyTheme(false);
    }
  }

  public toggleDarkMode(): void {
    const currentState = this.themeSubject.value;
    const newState = { isDarkMode: !currentState.isDarkMode };
    
    this.themeSubject.next(newState);
    this.applyTheme(newState.isDarkMode);
    this.saveThemePreference(newState);
  }

  public setDarkMode(isDark: boolean): void {
    const newState = { isDarkMode: isDark };
    this.themeSubject.next(newState);
    this.applyTheme(isDark);
    this.saveThemePreference(newState);
  }

  public getCurrentTheme(): ThemeState {
    return this.themeSubject.value;
  }

  private applyTheme(isDark: boolean): void {
    const body = document.body;
    if (isDark) {
      body.classList.add('dark-mode');
      body.classList.remove('light-mode');
    } else {
      body.classList.add('light-mode');
      body.classList.remove('dark-mode');
    }
  }

  private saveThemePreference(themeState: ThemeState): void {
    localStorage.setItem(this.THEME_KEY, JSON.stringify(themeState));
  }
} 