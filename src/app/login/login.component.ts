import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      // Simulación del manejo de autenticación
      this.simulateLogin(email, password)
        .then(() => {
          this.errorMessage = null;
          alert('Login successful!');
        })
        .catch(err => {
          this.errorMessage = err.message || 'Login failed. Please try again.';
        });
    } else {
      this.errorMessage = 'Please fill in all required fields correctly.';
    }
  }

  private simulateLogin(email: string, password: string): Promise<void> {
    return new Promise((resolve, reject) => {
      // Simula una API de autenticación
      if (email === 'test@example.com' && password === 'password123') {
        resolve();
      } else {
        reject({ message: 'Invalid email or password.' });
      }
    });
  }
}
