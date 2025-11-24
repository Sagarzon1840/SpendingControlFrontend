import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DxDataGridModule } from 'devextreme-angular';
import { FundsService } from '../../../core/services/funds.service';
import CustomStore from 'devextreme/data/custom_store';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-funds-grid',
  standalone: true,
  imports: [CommonModule, DxDataGridModule],
  templateUrl: './funds-grid.html',
  styleUrl: './funds-grid.css',
})
export class FundsGridComponent implements OnInit {
  dataSource: any;
  fundTypes = [
    { id: 'BankAccount', name: 'Bank Account' },
    { id: 'Cash', name: 'Cash' },
  ];
  popupHeight = 420;

  constructor(private fundsService: FundsService) {
    this.dataSource = new CustomStore({
      key: 'id',
      load: () => lastValueFrom(this.fundsService.getAll()),
      insert: (values) => lastValueFrom(this.fundsService.create(values)),
      update: (key, values) => lastValueFrom(this.fundsService.update(key, values)),
      remove: (key) => lastValueFrom(this.fundsService.delete(key)),
    });
  }

  ngOnInit(): void {}

  handleGridError(e: any) {
    const err = e?.error;
    let msg: string | undefined;
    if (typeof err === 'string') {
      msg = err;
    } else if (err) {
      msg = err.readableMessage || err.message;
    }
    if (!msg) {
      msg = 'Ocurrió un error';
    }
    // DevExtreme muestra e.error en la barra roja; lo reemplazamos por string legible.
    e.error = msg;
  }
}
