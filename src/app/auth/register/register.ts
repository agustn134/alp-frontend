import { Component, inject, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { Toast } from '../../core/services/toast';
@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterModule, CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private zone = inject(NgZone);
  private toastService = inject(Toast);

  hidePassword = true;
  isSubmitted = false;

  registerForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100), Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+( [a-zA-ZáéíóúÁÉÍÓÚñÑ]+)*$/)]],
    lastname: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(250), Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+( [a-zA-ZáéíóúÁÉÍÓÚñÑ]+)*$/)]],
    username: ['', [Validators.required, Validators.maxLength(100), Validators.pattern(/^\S+$/)]],
    password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]).{8,}$/)]],
    confirmPassword: ['', [Validators.required]]
  }, { validators: this.passwordsMatchValidator });


  onSubmit() {
    this.isSubmitted = true;

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const { confirmPassword, ...userData } = this.registerForm.value;

    const formData = {
      ...userData,
      name: this.registerForm.value.name.trim(),
      lastname: this.registerForm.value.lastname.trim(),
      username: this.registerForm.value.username.trim().toLowerCase()
    };


    this.authService.register(formData).subscribe({
      next: () => {
        this.zone.run(() => {
          this.toastService.showSuccess('¡Cuenta creada exitosamente! Inicia sesión.');
          this.router.navigate(['/login']);
        });
      },
      error: () => { }
    });
  }

  passwordsMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    if (password && confirmPassword && password !== confirmPassword) {
      return { mismatch: true };
    }
    return null;
  }
}
