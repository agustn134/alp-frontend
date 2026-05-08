import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const token = sessionStorage.getItem('access_token');

  //?si hay token o esta logueado, lo dejamos pasar
  if (authService.isLoggedIn.value || sessionStorage.getItem('isLoggedIn') === 'true' || token) {
    return true;
  }

  //?si no hay token, lo mandamos al login y le bloqueamos el paso
  router.navigate(['/login']);
  return false;
};
