import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule, Router, NavigationEnd } from '@angular/router';

import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { AuthGuard } from './auth.guard'; // Import the AuthGuard

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('src/app/layouts/admin-layout/admin-layout.module').then(m => m.AdminLayoutModule)
      }
    ],
    canActivate: [AuthGuard] // Apply the AuthGuard to the admin layout routes
  },
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('src/app/layouts/auth-layout/auth-layout.module').then(m => m.AuthLayoutModule)
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes, {
      useHash: true
    })
  ],
  exports: [],
  providers: [AuthGuard] // Provide the AuthGuard
})
export class AppRoutingModule {
  constructor(private router: Router) {
    this.checkTokenAndRedirect();
  }

  private checkTokenAndRedirect(): void {
    const token = localStorage.getItem('token');
    const isAdminLayout = this.router.config.find(route => {
      return route.component === AdminLayoutComponent;
    });

    if (!token && isAdminLayout) {
      this.router.navigate(['/login']);
    }
  }
}
