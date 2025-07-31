import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from './spinner/spinner.component';
import { CardComponent } from './card/card.component';
import { CardHeaderComponent } from './card/card-header/card-header.component';
import { LoadingWrapperComponent } from './loading-wrapper/loading-wrapper.component';

@NgModule({
  declarations: [
    SpinnerComponent, 
    CardComponent, 
    CardHeaderComponent, 
    LoadingWrapperComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    SpinnerComponent, 
    CardComponent, 
    CardHeaderComponent, 
    LoadingWrapperComponent
  ]
})
export class SharedModule { }
