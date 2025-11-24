import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [CommonModule],
  template: `
    <select
      [disabled]="disabled"
      [class]="selectClasses"
      [value]="value"
      (change)="onChangeEvent($event)"
      (blur)="onTouched()"
    >
      <option value="" *ngIf="placeholder">{{ placeholder }}</option>
      <option *ngFor="let option of options" [value]="getOptionValue(option)">
        {{ getOptionLabel(option) }}
      </option>
    </select>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
  ],
})
export class SelectComponent implements ControlValueAccessor {
  @Input() options: any[] = [];
  @Input() valueField = 'id';
  @Input() labelField = 'name';
  @Input() placeholder = 'Seleccione...';
  @Input() disabled = false;
  @Input() hasError = false;

  value: any = '';
  onChange: any = () => {};
  onTouched: any = () => {};

  get selectClasses(): string {
    const baseClasses =
      'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors';
    const errorClasses = this.hasError
      ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500';
    const disabledClasses = this.disabled
      ? 'bg-gray-100 cursor-not-allowed'
      : 'bg-white cursor-pointer';

    return `${baseClasses} ${errorClasses} ${disabledClasses}`;
  }

  getOptionValue(option: any): any {
    return typeof option === 'object' ? option[this.valueField] : option;
  }

  getOptionLabel(option: any): string {
    return typeof option === 'object' ? option[this.labelField] : option;
  }

  onChangeEvent(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.value = select.value;
    this.onChange(this.value);
  }

  writeValue(value: any): void {
    this.value = value || '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
