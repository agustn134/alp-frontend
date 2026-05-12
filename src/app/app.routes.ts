import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login.component.ts/login.component';
import { DashboardComponent } from './dashboard/dashboard';
import { authGuard } from './core/guards/auth-guard';
import { Register } from './auth/register/register';
import { TaskList } from './dashboard/task-list/task-list';
import { SalaAuditorias } from './dashboard/sala-auditorias/sala-auditorias';
import { PerfilUsuario } from './dashboard/perfil-usuario/perfil-usuario';
import { UserManagement } from './dashboard/user-management/user-management';
import { AuditLogs } from './dashboard/audit-logs/audit-logs';
import { TaskForm } from './dashboard/task-form/task-form';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'register', component: Register },
    {
        path: 'dashboard',
        canActivate: [authGuard],
        children: [
            { path: '', component: DashboardComponent, pathMatch: 'full' },
            { path: 'tareas', component: TaskList },
            { path: 'perfil-usuario', component: PerfilUsuario },
            { path: 'sala-auditorias', component: SalaAuditorias },
        ]
    },

    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: '**', redirectTo: '/login' }
];

