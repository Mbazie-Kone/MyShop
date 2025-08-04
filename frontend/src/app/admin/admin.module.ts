import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ViewProductsComponent } from './pages/products/view-products/view-products.component';
import { SharedModule } from '../shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { CoreModule } from '../core/core.module';
import { ProductFormComponent } from '../core/components/admin/product-form/product-form.component';

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    ViewProductsComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    NgxPaginationModule,
    FormsModule,
    CoreModule,
    ProductFormComponent
  ]
})
export class AdminModule { }
