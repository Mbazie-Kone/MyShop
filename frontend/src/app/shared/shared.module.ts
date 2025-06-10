import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from './spinner/spinner.component';
import { CardComponent } from './card/card.component';

@NgModule({
  declarations: [SpinnerComponent, CardComponent],
  imports: [
    CommonModule
  ],
  exports: [SpinnerComponent, CardComponent]
})
export class SharedModule { }
