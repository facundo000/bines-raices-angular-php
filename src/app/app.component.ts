import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './core/services/auth/auth.service';
import { AuthStatus } from './core/services/interfaces';
import { privateGuard } from './core/services/guards';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  title = 'bienesraices_angular';

  private authService = inject( AuthService );
  // private router = inject( Router );


  ngOnInit(){
    this.authService.checkAuthStatus().subscribe(privateGuard => {
      console.log('Usuario autenticado', privateGuard);
    })
  }
  // public finishedAuthCheck = computed<boolean>(() => {
  //   if( this.authService.authStatus() === AuthStatus.cheking ){
  //     return false;
  //   }

  //   return true;
  // });
}
