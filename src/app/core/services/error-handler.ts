import { Injectable, inject, NgZone } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  private snackBar = inject(MatSnackBar);
  private zone = inject(NgZone);

  handleError(error: any): void {
    let errorMessage = 'Ocurrió un error inesperado. Intenta de nuevo.';

    if (error.error && error.error.message) {
      errorMessage = Array.isArray(error.error.message)
        ? error.error.message.join(' | ')
        : error.error.message;
    }
    else if (error.status === 401) {
      errorMessage = 'Tu sesión ha expirado o las credenciales son incorrectas.';
    } else if (error.status === 403) {
      errorMessage = 'No tienes los permisos necesarios para ver esto.';
    } else if (error.status === 404) {
      errorMessage = 'El recurso que buscas no existe.';
    } else if (error.status === 500) {
      errorMessage = 'Error interno del servidor. Repórtalo al administrador.';
    }

    this.zone.run(() => {
      this.snackBar.open(errorMessage, 'Cerrar', {
        duration: 6000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
        panelClass: ['error-snackbar']
      });
    });
  }
}
