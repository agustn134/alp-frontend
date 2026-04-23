import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service.ts';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, MatCardModule, MatInputModule, MatButtonModule, MatIconModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  errorMessage: string | null = null;
  isLoading: boolean = false;

  //definimos el formulario y ponemos sus validaciones (independientes del HTML)
  loginForm: FormGroup = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(200)]]
  });

  hidePassword = true; // Para el ojito de la contraseña

  onSubmit() {
    //si el profe hackea el HTML y quita el disabled del botón, esta línea lo frena al profe
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = null;

    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        console.log('Login exitoso');
        // Forzamos la navegación
        this.router.navigate(['/dashboard']).then(nav => {
          if (!nav) {
            console.error('La navegación al dashboard falló. Revisa tus rutas.');
          }
        });
      },
      error: (err) => {
        this.errorMessage = 'Usuario o contraseña incorrectos';
        this.isLoading = false;
      }
    });
  }
}