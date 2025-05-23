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

  setTitle(title: string): void {
    this.pageTitleSubject.next(title);
    this.title.setTitle(title); // Browser title
  }

  get currentTitle(): string {
    return this.pageTitleSubject.value;
  }

}
