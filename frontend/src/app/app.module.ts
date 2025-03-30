import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminModule } from './admin/admin.module';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AdminLayoutComponent } from './core/components/admin/admin-layout/admin-layout.component';
import { HeaderSidebarComponent } from './core/components/myshop/header-sidebar/header-sidebar.component';
import { LayoutComponent } from './core/components/myshop/layout/layout.component';
import { HeaderComponent } from './core/components/myshop/header/header.component';
import { SidebarComponent } from './core/components/myshop/sidebar/sidebar.component';
import { FooterComponent } from './core/components/myshop/footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    HeaderSidebarComponent,
    LayoutComponent,
    HeaderComponent,
    SidebarComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AdminModule
  ],
  providers: [provideHttpClient(withInterceptorsFromDi())],
  bootstrap: [AppComponent],
  exports: [
    AdminLayoutComponent,
    HeaderSidebarComponent,
    LayoutComponent,
    HeaderComponent,
    SidebarComponent,
    FooterComponent
  ]
})
export class AppModule { }
