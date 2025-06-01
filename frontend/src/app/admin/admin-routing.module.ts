import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { authGuard } from '../core/guards/auth.guard';
import { ViewProductsComponent } from './pages/products/view-products/view-products.component';
import { AddProductComponent } from './pages/products/add-product/add-product.component';
import { EditProductComponent } from './pages/products/edit-product/edit-product.component';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent, data: { title: 'Dashboard - MyShop' }, canActivate: [authGuard] },
  { path: 'view-products', component: ViewProductsComponent, data: { title: 'Products List - MyShop' }, },
  { path: 'add-product', component: AddProductComponent, data: { title: 'Add Product - MyShop' }, },
  { path: 'edit-product/:id', component: EditProductComponent, data: { title: 'Edit Product - MyShop' }, }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
