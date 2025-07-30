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

import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { Nl2brPipe } from '../shared/pipes/nl2br.pipe';

// Services
import { AnalyticsService } from './services/analytics.service';
import { I18nService } from './services/i18n.service';
import { SecurityService } from './services/security.service';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    LayoutComponent,
    HeaderSidebarComponent,
    AdminLayoutComponent,
    FooterComponent,
    AdminFooterComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    SharedModule,
    Nl2brPipe
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
  ],
  providers: [
    AnalyticsService,
    I18nService,
    SecurityService
  ]
})
export class CoreModule { }
