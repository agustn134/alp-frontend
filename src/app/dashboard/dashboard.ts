import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../core/services/auth.service.ts';
import { Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { TaskList } from './task-list/task-list.js';
import { AuditLogs } from "./audit-logs/audit-logs";
import { UserManagement } from "./user-management/user-management";

@Component({
  selector: 'app-dashboard',
  imports: [MatToolbarModule, MatButtonModule, MatCardModule, TaskList, AuditLogs, UserManagement],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class DashboardComponent implements OnInit {

  private authService = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  user: any = null;

  ngOnInit() {
    this.authService.getMe().subscribe({
      next: (data) => {
        this.user = data; //?para mostrar el nombre del usuario al inicio de la pantalla
        this.cdr.detectChanges();
      }
    });
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}
