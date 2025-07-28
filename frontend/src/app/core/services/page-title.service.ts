import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PageTitleService {
  private pageTitleSubject = new BehaviorSubject<string>('Admin');
  pageTitle$ = this.pageTitleSubject.asObservable();

  constructor(private title: Title) {}

  setTitle(browserTitle: string, pageTitle?: string): void {
    // Set browser tab title
    this.title.setTitle(browserTitle);
    
    // Set page title (if not provided, extract from browser title)
    const internalTitle = pageTitle || this.extractPageTitle(browserTitle);
    this.pageTitleSubject.next(internalTitle);
  }

  private extractPageTitle(browserTitle: string): string {
    // Remove " - MyShop" suffix if present
    return browserTitle.replace(' - MyShop', '');
  }

  get currentTitle(): string {
    return this.pageTitleSubject.value;
  }
}
