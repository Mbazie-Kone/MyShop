import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { authGuard } from '../core/guards/auth.guard';
import { ViewProductsComponent } from './pages/products/view-products/view-products.component';
import { ProductFormComponent } from '../core/components/admin/product-form/product-form.component';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent, data: { title: 'Dashboard - MyShop' }, canActivate: [authGuard] },
  { path: 'view-products', component: ViewProductsComponent, data: { title: 'Products List - MyShop' }, },
  { path: 'add-product', component: ProductFormComponent, data: { title: 'Add Product - MyShop' }, },
  { path: 'edit-product/:id', component: ProductFormComponent, data: { title: 'Edit Product - MyShop' }, }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
