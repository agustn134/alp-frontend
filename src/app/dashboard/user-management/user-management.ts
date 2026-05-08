import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../core/services/user';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './user-management.html',
  styleUrl: './user-management.scss'
})
export class UserManagement implements OnInit {
  private userSvc = inject(UserService);

  users: any[] = [];
  filteredUsers: any[] = [];

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.userSvc.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.filteredUsers = data;
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredUsers = this.users.filter(user =>
      user.username.toLowerCase().includes(filterValue) ||
      user.name.toLowerCase().includes(filterValue) ||
      user.role.toLowerCase().includes(filterValue)
    );
  }

  promptResetPassword(user: any) {
    const newPass = prompt(`Introduce la nueva contraseña para ${user.username}:`);
    if (newPass && newPass.length >= 6) {
      this.userSvc.resetPassword(user.id, newPass).subscribe({
        next: () => {
          alert('Contraseña actualizada y evento registrado en auditoría');
        }
      });
    } else if (newPass) {
      alert('La contraseña debe tener al menos 6 caracteres');
    }
  }
}