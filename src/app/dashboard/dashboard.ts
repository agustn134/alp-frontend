import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../core/services/auth.service';
import { Router } from '@angular/router';
import { TaskList } from './task-list/task-list.js';

@Component({
  selector: 'app-dashboard',
  imports: [TaskList],
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
