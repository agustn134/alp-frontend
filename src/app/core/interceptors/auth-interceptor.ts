import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { ErrorHandlerService } from '../services/error-handler';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  //??con el httpinterceptor  viaja el token al servidor en cada petición
  //??si hay un token en el sessionStorage, lo clona e inyecta en la cabecera
  //? ?Authorization como un Bearer Token.
  //??es decir, si no hay token, no se manda nada y si hay token, se manda en la cabecera

  //??Mira we, este interceptor es mas que nada pa mandar el token al servidor en cada petición
  //??y si hay un error, lo atrapa y lo manda al manejador de errores global

  //??hago inyeccion de dependencias
  const router = inject(Router);
  const errorService = inject(ErrorHandlerService);

  //?obtengo el token de sessionStorage
  const token = sessionStorage.getItem('access_token');

  //??clono la petición para inyectar el token si existe
  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }

  //?pasa la petición al siguiente paso y atrapa errores globales
  return next(authReq).pipe(
    catchError((error) => {
      //? Si el error es 401 o sea que Token inválido o expirado
      if (error.status === 401) {
        sessionStorage.clear(); //?limpia el rastro
        router.navigate(['/login']); //?lo manda al login
      }

      //?mando el error que surja al manejador de errores global
      errorService.handleError(error);
      return throwError(() => error);
    })
  );
};
