import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DxDataGridModule, DxSelectBoxModule } from 'devextreme-angular';
import { DepositsService } from '../../../core/services/deposits.service';
import { FundsService } from '../../../core/services/funds.service';
import CustomStore from 'devextreme/data/custom_store';
import DataSource from 'devextreme/data/data_source';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-deposits-grid',
  standalone: true,
  imports: [CommonModule, DxDataGridModule, DxSelectBoxModule],
  templateUrl: './deposits-grid.html',
  styleUrl: './deposits-grid.css',
})
export class DepositsGridComponent implements OnInit {
  dataSource: any;
  fundsDataSource: DataSource;
  fundsSelectDataSource: any[] = [];
  funds: any[] = [];
  selectedFund: any = null;
  selectedFundId: string = '';

  constructor(
    private depositsService: DepositsService,
    private fundsService: FundsService,
    private cdr: ChangeDetectorRef
  ) {
    this.fundsDataSource = new DataSource({
      store: new CustomStore({
        key: 'id',
        load: () => lastValueFrom(this.fundsService.getAll()),
      }),
    });

    this.dataSource = new CustomStore({
      key: 'id',
      load: () => lastValueFrom(this.depositsService.getAll()),
      insert: (values) => {
        const deposit = {
          ...values,
          date: values.date ? new Date(values.date).toISOString() : undefined,
        };
        return lastValueFrom(this.depositsService.create(deposit));
      },
    });
  }

  ngOnInit(): void {
    // Cargar fondos una sola vez
    this.fundsService.getAll().subscribe({
      next: (data) => {
        this.funds = data;
        this.fundsSelectDataSource = [...data];

        if (this.funds.length > 0) {
          // Establecer el primer fondo como seleccionado
          this.selectedFund = this.funds[0];
          this.selectedFundId = this.selectedFund.id;

          // Forzar detección de cambios para que el select box se actualice
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        console.error('[DepositsGrid] Error loading funds:', err);
      },
    });
  }

  onFundChange(e: any): void {
    // Este evento solo se dispara cuando el usuario cambia la selección manualmente
    const selectedId = e.selectedItem?.id;
    if (selectedId) {
      this.selectedFundId = selectedId;
      this.selectedFund = e.selectedItem;
    }
  }

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
    e.error = msg;
  }
}
