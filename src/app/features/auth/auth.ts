import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { ButtonComponent } from '../../shared/atoms/button/button.component';
import { InputComponent } from '../../shared/atoms/input/input.component';
import { finalize } from 'rxjs/operators';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroCheckCircle, heroXCircle, heroCurrencyDollar } from '@ng-icons/heroicons/outline';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent, InputComponent, NgIconComponent],
  viewProviders: [provideIcons({ heroCheckCircle, heroXCircle, heroCurrencyDollar })],
  templateUrl: './auth.html',
  styleUrl: './auth.css',
})
export class AuthComponent {
  isLoginMode = true;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  loginForm: FormGroup;
  registerForm: FormGroup;

  passwordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;

      const hasLetter = /[a-zA-Z]/.test(value);
      const hasDigit = /\d/.test(value);

      if (!hasLetter || !hasDigit) {
        return { passwordPattern: true };
      }

      return null;
    };
  }

  constructor(private authService: AuthService, private router: Router, private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      name: ['', [Validators.required]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(100),
          this.passwordValidator(),
        ],
      ],
      confirmPassword: ['', [Validators.required]],
    });
  }

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    this.errorMessage = '';
    this.successMessage = '';
    this.loginForm.reset();
    this.registerForm.reset();
  }

  onLogin() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.authService
      .login(this.loginForm.value)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.errorMessage =
            err.error?.readableMessage ||
            err.error?.message ||
            'Error de inicio de sesión. Verifica tus credenciales.';
        },
      });
  }

  onRegister() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const { username, name, password, confirmPassword } = this.registerForm.value;
    if (password !== confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const registerData = { username, name, password };

    this.authService
      .register(registerData)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: () => {
          this.successMessage = 'Registro exitoso! Por favor inicia sesión.';
          this.isLoginMode = true;
          this.registerForm.reset();
        },
        error: (err) => {
          this.errorMessage =
            err.error?.readableMessage || err.error?.message || 'Error en el registro.';
        },
      });
  }

  getErrorMessage(form: FormGroup, field: string): string {
    const control = form.get(field);
    if (!control || !control.errors || !control.touched) return '';

    const fieldNames: Record<string, string> = {
      username: 'Usuario',
      name: 'Nombre',
      password: 'Contraseña',
      confirmPassword: 'Confirmación de contraseña',
    };
    const fieldName = fieldNames[field] || field;

    if (control.errors['required']) return `${fieldName} es requerido`;
    if (control.errors['email']) return 'Formato de correo inválido';
    if (control.errors['minlength'])
      return `Debe tener al menos ${control.errors['minlength'].requiredLength} caracteres`;
    if (control.errors['maxlength'])
      return `Debe tener máximo ${control.errors['maxlength'].requiredLength} caracteres`;
    if (control.errors['passwordPattern']) return 'La contraseña debe contener letras y números';

    return '';
  }
}
