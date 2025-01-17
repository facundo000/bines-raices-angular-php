import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../core/services/auth/auth.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private AuthService = inject(AuthService);
  private router = inject(Router);

  public myForm: FormGroup = this.fb.group({
    email: ['example@google.com', [Validators.required, Validators.email]],
    password: ['Abc123456', [Validators.required, Validators.minLength(6)]]
  })

  login(){
    const { email, password } = this.myForm.value

    this.AuthService.login(email, password).subscribe({
      next: () => this.router.navigate(['/home']),
      error: (message) => {
        Swal.fire( 'Error', message, 'error' );
      }
    })
  }
}
