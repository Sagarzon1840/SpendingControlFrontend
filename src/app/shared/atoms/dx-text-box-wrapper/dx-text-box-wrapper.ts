import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DxTextBoxModule, DxValidatorModule } from 'devextreme-angular';

@Component({
  selector: 'app-dx-text-box-wrapper',
  standalone: true,
  imports: [CommonModule, DxTextBoxModule, DxValidatorModule],
  templateUrl: './dx-text-box-wrapper.html',
  styleUrl: './dx-text-box-wrapper.css'
})
export class DxTextBoxWrapperComponent {
  @Input() value: string = '';
  @Input() placeholder: string = '';
  @Input() label: string = '';
  @Input() mode: 'text' | 'password' | 'email' = 'text';
  @Input() showClearButton: boolean = true;
  @Input() disabled: boolean = false;
  @Input() validationRules: any[] = [];

  @Output() valueChange = new EventEmitter<string>();

  onValueChanged(e: any) {
    this.value = e.value;
    this.valueChange.emit(this.value);
  }
}
