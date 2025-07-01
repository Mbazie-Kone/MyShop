import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from './spinner/spinner.component';
import { CardComponent } from './card/card.component';
import { CardHeaderComponent } from './card/card-header/card-header.component';

@NgModule({
  declarations: [SpinnerComponent, CardComponent, CardHeaderComponent],
  imports: [
    CommonModule
  ],
  exports: [SpinnerComponent, CardComponent]
})
export class SharedModule { }
