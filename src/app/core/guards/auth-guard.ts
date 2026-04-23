import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = sessionStorage.getItem('access_token');

  //?si hay token, lo dejamos pasar
  if (token) {
    return true;
  }

  //?si no hay token, lo mandamos al login y le bloqueamos el paso
  router.navigate(['/login']);
  return false;
};
