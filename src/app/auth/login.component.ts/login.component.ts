import { ChangeDetectorRef, Component, NgZone, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
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
  @ViewChild('loginForm') loginForm!: NgForm;
  loginData = { username: '', password: '' };
  hidePassword = true;

  constructor(
    private authService: AuthService,
    private router: Router,
    private zone: NgZone,
    private toastService: Toast
  ) { }

  onLogin() {
    if (this.loginForm.invalid) {
      return;
    }

    this.authService.login(this.loginData).subscribe({
      next: () => {
        this.zone.run(() => {
          this.toastService.showSuccess('¡Bienvenido de nuevo!');
          this.router.navigate(['/dashboard']);
        });
      },
      error: () => {
      }
    });
  }
}