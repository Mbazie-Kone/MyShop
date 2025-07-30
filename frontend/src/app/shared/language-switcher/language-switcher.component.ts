import { Component, OnInit } from '@angular/core';
import { I18nService } from '../../core/services/i18n.service';

@Component({
  selector: 'app-language-switcher',
  standalone: false,
  templateUrl: './language-switcher.component.html',
  styleUrl: './language-switcher.component.css'
})
export class LanguageSwitcherComponent implements OnInit {
  currentLanguage = 'en';
  supportedLanguages: string[] = [];

  constructor(private i18nService: I18nService) {}

  ngOnInit(): void {
    this.currentLanguage = this.i18nService.getCurrentLanguage();
    this.supportedLanguages = this.i18nService.getSupportedLanguages();
  }

  changeLanguage(language: string): void {
    this.i18nService.setLanguage(language);
    this.currentLanguage = language;
  }

  getLanguageName(languageCode: string): string {
    return this.i18nService.getLanguageName(languageCode);
  }
} 