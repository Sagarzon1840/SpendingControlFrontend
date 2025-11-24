import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DxTextBoxWrapperComponent } from '../../atoms/dx-text-box-wrapper/dx-text-box-wrapper';
import { DxButtonWrapperComponent } from '../../atoms/dx-button-wrapper/dx-button-wrapper';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [CommonModule, DxTextBoxWrapperComponent, DxButtonWrapperComponent],
  templateUrl: './login-form.html',
  styleUrl: './login-form.css'
})
export class LoginFormComponent {
  @Input() isLoading: boolean = false;
  @Output() onSubmit = new EventEmitter<any>();
  @Output() onRegisterClick = new EventEmitter<void>();

  formData = {
    username: '',
    password: ''
  };

  validationRules = {
    username: [{ type: 'required', message: 'Username is required' }],
    password: [{ type: 'required', message: 'Password is required' }]
  };

  handleSubmit() {
    if (this.formData.username && this.formData.password) {
      this.onSubmit.emit(this.formData);
    }
  }

  handleRegisterClick() {
    this.onRegisterClick.emit();
  }
}
