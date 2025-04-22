import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { authGuard } from '../core/guards/auth.guard';
import { ViewProductsComponent } from './pages/products/view-products/view-products.component';
import { AddProductComponent } from './pages/products/add-product/add-product.component';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'view-products', component: ViewProductsComponent},
  { path: 'add-product', component: AddProductComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
