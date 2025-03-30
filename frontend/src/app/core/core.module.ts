import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/myshop/header/header.component';
import { FooterComponent } from './components/myshop/footer/footer.component';
import { SidebarComponent } from './components/myshop/sidebar/sidebar.component';
import { LayoutComponent } from './components/myshop/layout/layout.component';
import { HeaderSidebarComponent } from './components/admin/header-sidebar/header-sidebar.component';
import { AdminLayoutComponent } from './components/admin/layout/admin-layout.component';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    LayoutComponent,
    HeaderSidebarComponent,
    AdminLayoutComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    LayoutComponent,
    HeaderSidebarComponent,
    AdminLayoutComponent
  ]
})
export class CoreModule { }
