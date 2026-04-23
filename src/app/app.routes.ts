import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login.component.ts/login.component';
import { DashboardComponent } from './dashboard/dashboard';
import { authGuard } from './core/guards/auth-guard';
import { Register } from './auth/register/register';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'register', component: Register },
    { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },

    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: '**', redirectTo: '/login' }
];
