import { Component, inject } from '@angular/core';
import { Navbar } from "../../shared/components/navbar/navbar";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Toast } from '../../core/services/toast';
import { NgClass, NgIf } from "@angular/common";
import { DirectivaDatos } from '../../shared/directivas/diirectivadatos';

@Component({
  selector: 'app-perfil-usuario',
  imports: [Navbar, ReactiveFormsModule, NgClass, NgIf, DirectivaDatos],
  templateUrl: './perfil-usuario.html',
  styleUrl: './perfil-usuario.scss',
})
export class PerfilUsuario {

  private constructorFormulario = inject(FormBuilder);
  private servicioAuth = inject(AuthService);
  private servicioToast = inject(Toast);

  formularioPerfil!: FormGroup;
  ocultarContrasena = true;
  idUsuarioActual: number | null = null;

  ngOnInit() {
    this.inicializarFormulario();
    this.cargarDatosUsuario();
  }

  inicializarFormulario() {
    this.formularioPerfil = this.constructorFormulario.group({
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)]],
      apellido: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)]],
      username: ['', [Validators.required, Validators.minLength(4), Validators.pattern(/^[a-zA-Z0-9_.-]+$/)]],
      password: ['', [
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,}$/)
      ]],
      confirmarPassword: ['']
    }, { validators: this.validarCoincidenciaContrasenas });
  }

  validarCoincidenciaContrasenas(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmarPassword')?.value;

    if (password && password !== confirmPassword) {
      control.get('confirmarPassword')?.setErrors({ mismatch: true });
      return { mismatch: true };
    } else {
      const confirmErrors = control.get('confirmarPassword')?.errors;
      if (confirmErrors) {
        delete confirmErrors['mismatch'];
        control.get('confirmarPassword')?.setErrors(Object.keys(confirmErrors).length > 0 ? confirmErrors : null);
      }
    }
    return null;
  }

  cargarDatosUsuario() {
    this.servicioAuth.getMe().subscribe({
      next: (usuario) => {
        this.idUsuarioActual = usuario.id;
        this.formularioPerfil.patchValue({
          nombre: usuario.name,
          apellido: usuario.lastname,
          username: usuario.username
        });
      },
      error: (err) => {
        console.error("Error al cargar perfil:", err);
        this.servicioToast.showError("No se pudo cargar la información del perfil.");
      }
    });
  }

  obtenerErrorValidacion(campo: string, tipoError: string) {
    const control = this.formularioPerfil.get(campo);
    return control?.hasError(tipoError) && (control?.touched || control?.dirty);
  }

  alternarVisibilidadContrasena() {
    this.ocultarContrasena = !this.ocultarContrasena;
  }

  actualizarPerfil() {
    if (this.formularioPerfil.invalid) {
      this.formularioPerfil.markAllAsTouched();
      this.servicioToast.showError("Corrige los errores antes de actualizar.");
      return;
    } else {
      this.servicioToast.showSuccess("Perfil actualizado correctamente.");
    }

    const valoresFormulario = this.formularioPerfil.value;

    const datosActualizados: any = {
      name: valoresFormulario.nombre.trim(),
      lastname: valoresFormulario.apellido.trim(),
      username: valoresFormulario.username.trim()
    };

    if (!datosActualizados.name || !datosActualizados.lastname) {
      this.servicioToast.showError("El nombre y apellido no pueden estar vacíos o contener solo espacios.");
      return;
    } else {
      this.servicioToast.showSuccess("Nombre y apellido actualizados correctamente.");
    }

    if (valoresFormulario.password) {
      datosActualizados.password = valoresFormulario.password;
    }

    this.servicioAuth.updateProfile(this.idUsuarioActual!, datosActualizados).subscribe({
      next: () => {
        this.servicioToast.showSuccess("Perfil actualizado correctamente.");
        this.formularioPerfil.patchValue({ password: '', confirmarPassword: '' });
        this.formularioPerfil.markAsPristine();
      },
      error: (err) => {
        if (err.status === 409 || err.error?.message?.includes('username')) {
          this.formularioPerfil.get('username')?.setErrors({ inUse: true });
          this.servicioToast.showError("Ese nombre de usuario ya está en uso por otra persona.");
        } else {
          this.servicioToast.showError(err.error?.message || "Ocurrió un error al actualizar el perfil.");
        }
      }
    });
  }

}
