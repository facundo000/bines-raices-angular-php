import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { AuthStatus } from '../interfaces/auth-status.enum';

//is authenticated
export const publicGuard: CanActivateFn = (route, state) => {
  
  const authService = inject( AuthService );
  const router = inject( Router );

  if( authService.authStatus() === AuthStatus.authenticated ){
    return true;
  }

  router.navigateByUrl('/admin')
  
  return false;
};
