import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './admin/pages/login/login.component';
import { RegisterComponent } from './admin/pages/register/register.component';
import { AdminLayoutComponent } from './core/components/admin/layout/admin-layout.component';
import { LayoutComponent } from './core/components/myshop/layout/layout.component';
import { ErrorPageComponent } from './errors/error-page/error-page.component';

const routes: Routes = [
  { path: 'admin', redirectTo: 'admin/login', pathMatch: 'full'},
  { path: 'admin/login', component: LoginComponent },
  { path: 'admin/register', component: RegisterComponent },
  {
    path: 'administration',
    component: AdminLayoutComponent,
    children: [
      { path: '', redirectTo: 'admin/login', pathMatch: 'full'},
      { path: '',  loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) }
    ]
  },
  { 
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'catalog', pathMatch: 'full' },
      { path: 'catalog', loadChildren: () => import('./myshop/myshop.module').then(m => m.MyshopModule) }
    ]
  },
  { path: '**', component: ErrorPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
