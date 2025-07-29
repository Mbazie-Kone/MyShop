import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Components
import { AdminLayoutComponent } from './components/admin/layout/admin-layout.component';
import { HeaderSidebarComponent } from './components/admin/header-sidebar/header-sidebar.component';
import { AdminFooterComponent } from './components/admin/admin-footer/admin-footer.component';
import { LayoutComponent } from './components/myshop/layout/layout.component';
import { HeaderComponent } from './components/myshop/header/header.component';
import { FooterComponent } from './components/myshop/footer/footer.component';
import { SidebarComponent } from './components/myshop/sidebar/sidebar.component';
import { ProductFormComponent } from './components/admin/product-form/product-form.component';

// Services
import { AuthService } from './services/auth.service';
import { DashboardService } from './services/dashboard.service';
import { LayoutService } from './services/layout.service';
import { PageTitleService } from './services/page-title.service';
import { AnalyticsService } from './services/analytics.service';
import { I18nService } from './services/i18n.service';
import { SecurityService } from './services/security.service';
import { ThemeService } from './services/theme.service';

// Guards
import { authGuard } from './guards/auth.guard';

// Interceptors
import { authInterceptor } from './interceptors/auth.interceptor';

// Pipes
import { Nl2brPipe } from '../shared/pipes/nl2br.pipe';

// Standalone Components
import { ThemeToggleComponent } from '../shared/theme-toggle/theme-toggle.component';

// Shared Module
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    AdminLayoutComponent,
    HeaderSidebarComponent,
    AdminFooterComponent,
    LayoutComponent,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    ProductFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    SharedModule,
    ThemeToggleComponent,
    Nl2brPipe
  ],
  exports: [
    AdminLayoutComponent,
    HeaderSidebarComponent,
    AdminFooterComponent,
    LayoutComponent,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    ProductFormComponent,
    ThemeToggleComponent,
    Nl2brPipe
  ],
  providers: [
    AuthService,
    DashboardService,
    LayoutService,
    PageTitleService,
    AnalyticsService,
    I18nService,
    SecurityService,
    ThemeService,
    { provide: 'authGuard', useValue: authGuard },
    { provide: 'authInterceptor', useValue: authInterceptor }
  ]
})
export class CoreModule { }
