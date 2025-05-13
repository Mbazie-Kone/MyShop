import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  private _collapsed = new BehaviorSubject<boolean>(false);
  collapsed$ = this._collapsed.asObservable();

  toggle() {
    this._collapsed.next(!this._collapsed.value);
  }

  isCollapsed(): boolean {
    return this._collapsed.value;
  }
}