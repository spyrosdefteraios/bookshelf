import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./features/auth/register/register').then(m => m.Register) },
  { path: 'dashboard', loadComponent: () => import('./features/dashboard/dashboard').then(m => m.Dashboard), canActivate: [authGuard] },
  { path: 'books', loadComponent: () => import('./features/books/books').then(m => m.Books), canActivate: [authGuard] },
  { path: 'books/:id', loadComponent: () => import('./features/books/book-detail/book-detail').then(m => m.BookDetail), canActivate: [authGuard] },
  { path: 'profile', loadComponent: () => import('./features/profile/profile').then(m => m.Profile), canActivate: [authGuard] },
  { path: 'admin', loadComponent: () => import('./features/admin/admin').then(m => m.Admin), canActivate: [authGuard, adminGuard] },
  { path: '**', redirectTo: '/dashboard' }
];