import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/myshop/header/header.component';
import { FooterComponent } from './components/myshop/footer/footer.component';
import { SidebarComponent } from './components/myshop/sidebar/sidebar.component';
import { LayoutComponent } from './components/myshop/layout/layout.component';
import { HeaderSidebarComponent } from './components/admin/header-sidebar/header-sidebar.component';
import { AdminLayoutComponent } from './components/admin/layout/admin-layout.component';
import { RouterModule } from '@angular/router';
import { AdminFooterComponent } from './components/admin/admin-footer/admin-footer.component';
import { ProductFormComponent } from './components/admin/product-form/product-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    LayoutComponent,
    HeaderSidebarComponent,
    AdminLayoutComponent,
    FooterComponent,
    AdminFooterComponent,
    ProductFormComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    SharedModule
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    LayoutComponent,
    HeaderSidebarComponent,
    AdminLayoutComponent,
    FooterComponent,
    AdminFooterComponent
  ]
})
export class CoreModule { }
