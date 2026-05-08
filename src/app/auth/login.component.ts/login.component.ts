import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { Toast } from '../../core/services/toast';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginData = { username: '', password: '' };

  isLoading = false;
  hidePassword = true;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastservice: Toast,
  ) { }

  onLogin() {
    this.isLoading = true;
    this.authService.login(this.loginData).subscribe({
      next: () => {
        ////toast verde de éxito
        this.isLoading = false;
        this.toastservice.showSuccess('¡Inicio de sesión correcto!');
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }
}