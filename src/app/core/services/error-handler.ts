import { Injectable, inject, NgZone } from '@angular/core';
import { Toast } from './toast';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  private zone = inject(NgZone);
  private toast = inject(Toast);

  handleError(error: any): void {
    let errorMessage = 'Ocurrió un error inesperado. Intenta de nuevo.';

    if (error.status === 429) {
      errorMessage = 'ThrottlerException - Demasiados intentos rápidos. Por favor, espera unos segundos por seguridad.';
    }
    else if (error.error && error.error.message) {
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
    } else {
      errorMessage = 'Error de conexión con el servidor. Intenta más tarde.';
    }

    this.zone.run(() => {
      this.toast.showError(errorMessage);
    });
  }
}
