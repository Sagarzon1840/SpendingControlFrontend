import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DxButtonModule } from 'devextreme-angular';

@Component({
  selector: 'app-dx-button-wrapper',
  standalone: true,
  imports: [DxButtonModule],
  templateUrl: './dx-button-wrapper.html',
  styleUrl: './dx-button-wrapper.css'
})
export class DxButtonWrapperComponent {
  @Input() text: string = '';
  @Input() type: 'normal' | 'default' | 'success' | 'danger' = 'normal';
  @Input() stylingMode: 'text' | 'outlined' | 'contained' = 'contained';
  @Input() width: string | number | undefined;
  @Input() disabled: boolean = false;
  @Input() icon: string = '';
  
  @Output() onClick = new EventEmitter<any>();

  handleClick(e: any) {
    this.onClick.emit(e);
  }
}
