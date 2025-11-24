import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { InputComponent } from '../../atoms/input/input.component';
import { SelectComponent } from '../../atoms/select/select.component';
import { TextareaComponent } from '../../atoms/textarea/textarea.component';

@Component({
  selector: 'app-form-field',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputComponent, SelectComponent, TextareaComponent],
  template: `
    <div class="mb-4">
      <label *ngIf="label" [for]="fieldId" class="block text-sm font-medium text-gray-700 mb-1">
        {{ label }}
        <span *ngIf="required" class="text-red-500">*</span>
      </label>

      <ng-container [ngSwitch]="type">
        <app-input
          *ngSwitchCase="'text'"
          [type]="inputType"
          [placeholder]="placeholder"
          [disabled]="disabled"
          [hasError]="hasError"
          [formControl]="control"
        ></app-input>

        <app-input
          *ngSwitchCase="'email'"
          type="email"
          [placeholder]="placeholder"
          [disabled]="disabled"
          [hasError]="hasError"
          [formControl]="control"
        ></app-input>

        <app-input
          *ngSwitchCase="'password'"
          type="password"
          [placeholder]="placeholder"
          [disabled]="disabled"
          [hasError]="hasError"
          [formControl]="control"
        ></app-input>

        <app-input
          *ngSwitchCase="'number'"
          type="number"
          [placeholder]="placeholder"
          [disabled]="disabled"
          [hasError]="hasError"
          [formControl]="control"
        ></app-input>

        <app-input
          *ngSwitchCase="'date'"
          type="date"
          [placeholder]="placeholder"
          [disabled]="disabled"
          [hasError]="hasError"
          [formControl]="control"
        ></app-input>

        <app-select
          *ngSwitchCase="'select'"
          [options]="options"
          [valueField]="valueField"
          [labelField]="labelField"
          [placeholder]="placeholder"
          [disabled]="disabled"
          [hasError]="hasError"
          [formControl]="control"
        ></app-select>

        <app-textarea
          *ngSwitchCase="'textarea'"
          [placeholder]="placeholder"
          [disabled]="disabled"
          [rows]="rows"
          [hasError]="hasError"
          [formControl]="control"
        ></app-textarea>
      </ng-container>

      <p *ngIf="errorMessage && hasError" class="mt-1 text-sm text-red-600">
        {{ errorMessage }}
      </p>

      <p *ngIf="helpText && !hasError" class="mt-1 text-sm text-gray-500">
        {{ helpText }}
      </p>
    </div>
  `,
})
export class FormFieldComponent {
  @Input() label = '';
  @Input() type: 'text' | 'email' | 'password' | 'number' | 'date' | 'select' | 'textarea' = 'text';
  @Input() inputType: 'text' | 'email' | 'password' | 'number' | 'date' = 'text';
  @Input() placeholder = '';
  @Input() disabled = false;
  @Input() required = false;
  @Input() errorMessage = '';
  @Input() helpText = '';
  @Input() control!: FormControl;
  @Input() fieldId = '';

  // For select
  @Input() options: any[] = [];
  @Input() valueField = 'id';
  @Input() labelField = 'name';

  // For textarea
  @Input() rows = 3;

  get hasError(): boolean {
    return this.control && this.control.invalid && (this.control.dirty || this.control.touched);
  }
}
