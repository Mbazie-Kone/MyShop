import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/myshop/header/header.component';
import { FooterComponent } from './components/myshop/footer/footer.component';
import { SidebarComponent } from './components/myshop/sidebar/sidebar.component';
import { LayoutComponent } from './components/myshop/layout/layout.component';
import { HeaderSidebarComponent } from './components/admin/header-sidebar/header-sidebar.component';
import { AdminLayoutComponent } from './components/admin/layout/admin-layout.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    LayoutComponent,
    HeaderSidebarComponent,
    AdminLayoutComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    LayoutComponent,
    HeaderSidebarComponent,
    AdminLayoutComponent,
    FooterComponent
  ]
})
export class CoreModule { }
