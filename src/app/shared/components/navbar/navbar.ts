import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {

  private authService = inject(AuthService);
  private router = inject(Router);

  isDropdownOpen = false;
  isMenuOpen = false;

  toggleDropdown(event: Event) {
    event.preventDefault();
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  navegar(destino: string) {
    this.isDropdownOpen = false;
    this.isMenuOpen = false;

    switch (destino) {
      case 'inicio':
        this.router.navigate(['/dashboard']);
        break;
      case 'tareas':
        this.router.navigate(['/dashboard/tareas']);
        break;
      case 'auditoria':
        this.router.navigate(['/dashboard/sala-auditorias']);
        break;
      case 'configuracion':
        this.router.navigate(['/dashboard/perfil-usuario']);
        break;
      default:
        this.router.navigate(['/dashboard']);
        break;
    }
  }

  onLogout() {
    this.isDropdownOpen = false;
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
