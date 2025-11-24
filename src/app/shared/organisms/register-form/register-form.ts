import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DxTextBoxWrapperComponent } from '../../atoms/dx-text-box-wrapper/dx-text-box-wrapper';
import { DxButtonWrapperComponent } from '../../atoms/dx-button-wrapper/dx-button-wrapper';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [CommonModule, DxTextBoxWrapperComponent, DxButtonWrapperComponent],
  templateUrl: './register-form.html',
  styleUrl: './register-form.css'
})
export class RegisterFormComponent {
  @Input() isLoading: boolean = false;
  @Output() onSubmit = new EventEmitter<any>();
  @Output() onLoginClick = new EventEmitter<void>();

  formData = {
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  validationRules = {
    username: [{ type: 'required', message: 'Username is required' }],
    email: [{ type: 'required', message: 'Email is required' }, { type: 'email', message: 'Invalid email' }],
    password: [{ type: 'required', message: 'Password is required' }],
    confirmPassword: [{ type: 'required', message: 'Confirm Password is required' }, 
      { type: 'compare', comparisonTarget: () => this.formData.password, message: 'Passwords do not match' }]
  };

  handleSubmit() {
    if (this.formData.username && this.formData.password && this.formData.email && this.formData.password === this.formData.confirmPassword) {
      this.onSubmit.emit(this.formData);
    }
  }

  handleLoginClick() {
    this.onLoginClick.emit();
  }
}
