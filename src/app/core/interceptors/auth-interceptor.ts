import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { ErrorHandlerService } from '../services/error-handler';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const errorHandler = inject(ErrorHandlerService);

  const authReq = req.clone({
    withCredentials: true
  });

  return next(authReq).pipe(
    catchError((error) => {
      if (error.status === 401) {
        router.navigate(['/login']);
      }

      errorHandler.handleError(error);

      return throwError(() => error);
    })
  );
};
