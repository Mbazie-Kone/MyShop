import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from './spinner/spinner.component';
import { CardComponent } from './card/card.component';
import { CardHeaderComponent } from './card/card-header/card-header.component';
import { LoadingWrapperComponent } from './loading-wrapper/loading-wrapper.component';
import { LoadingTestComponent } from './loading-test/loading-test.component';
import { LanguageSwitcherComponent } from './language-switcher/language-switcher.component';

@NgModule({
  declarations: [
    SpinnerComponent, 
    CardComponent, 
    CardHeaderComponent, 
    LoadingWrapperComponent, 
    LoadingTestComponent,
    LanguageSwitcherComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    SpinnerComponent, 
    CardComponent, 
    CardHeaderComponent, 
    LoadingWrapperComponent, 
    LoadingTestComponent,
    LanguageSwitcherComponent
  ]
})
export class SharedModule { }
