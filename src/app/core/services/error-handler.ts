import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  //?Este we es mas que nada pa MANEJAR ERRORES QUE VIENEN DEL SERVIDOR
  //?lit, solo mostrar MENSAJES GENERICOS y no mostrar rutas de carpetas del servidor al usuario final
  //?y que no se vea tan feo el error jeje


  constructor(private snackBar: MatSnackBar) { }

  //?metodo centralizado para mostrar y manejar errores de cualquier tipo
  public handleError(error: HttpErrorResponse): void {
    let errorMessage = 'Ocurrió un error inesperado. Inténtalo de nuevo.';

    if (error.error instanceof ErrorEvent) {
      //?para los errores del lado del cliente
      errorMessage = `Error de conexión: ${error.error.message}`;
    } else {
      //?para los errores del backend
      if (error.status === 401) errorMessage = 'Credenciales inválidas o sesión expirada.';
      if (error.status === 403) errorMessage = 'No tienes permiso para realizar esta acción.';
      if (error.status === 404) errorMessage = 'Recurso no encontrado.';
      if (error.error && error.error.message) {
        //?si la api manda un mensaje específico, lo usamos si nó usamos el mensaje de error que viene en el error
        errorMessage = error.error.message;
      }
    }

    this.showError(errorMessage);
  }

  private showError(message: string): void {
    //?uso el snackbar de Material Design para mostrar el error elegantemente
    this.snackBar.open(message, 'Cerrar', {
      duration: 5000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['error-snackbar'] //?clase de estilo rojo  solo apariencia
    });
  }
}
