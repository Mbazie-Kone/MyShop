import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminModule } from './admin/admin.module';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { CoreModule } from './core/core.module';
import { MyshopModule } from './myshop/myshop.module';
import { ErrorsModule } from './errors/errors.module';
import { RouterModule } from '@angular/router';
import { SpinnerComponent } from './shared/spinner/spinner.component';

@NgModule({
  declarations: [
    AppComponent,
    SpinnerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AdminModule,
    CoreModule,
    MyshopModule,
    ErrorsModule,
    RouterModule
  ],
  providers: [
   provideHttpClient(withInterceptorsFromDi())
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
