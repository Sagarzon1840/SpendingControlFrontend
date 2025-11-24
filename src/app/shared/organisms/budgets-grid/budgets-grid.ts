import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  DxDataGridModule,
  DxDateBoxModule,
  DxNumberBoxModule,
  DxButtonModule,
} from 'devextreme-angular';
import { BudgetsService } from '../../../core/services/budgets.service';
import { ExpenseTypesService } from '../../../core/services/expense-types.service';
import CustomStore from 'devextreme/data/custom_store';
import DataSource from 'devextreme/data/data_source';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-budgets-grid',
  standalone: true,
  imports: [CommonModule, DxDataGridModule, DxDateBoxModule, DxNumberBoxModule, DxButtonModule],
  templateUrl: './budgets-grid.html',
  styleUrl: './budgets-grid.css',
})
export class BudgetsGridComponent implements OnInit {
  dataSource: DataSource;
  expenseTypesDataSource: DataSource;
  expenseTypesStore: CustomStore;
  budgetsStore: CustomStore;
  selectedDate: Date = new Date();
  selectedYear: number = new Date().getFullYear();
  selectedMonth: number = new Date().getMonth() + 1;

  constructor(
    private budgetsService: BudgetsService,
    private expenseTypesService: ExpenseTypesService
  ) {
    this.expenseTypesStore = new CustomStore({
      key: 'id',
      load: () =>
        lastValueFrom(this.expenseTypesService.getAll()).then((data) =>
          data.filter((item: any) => item.isActive === true)
        ),
    });

    this.expenseTypesDataSource = new DataSource({
      store: this.expenseTypesStore,
    });

    this.budgetsStore = new CustomStore({
      key: 'id',
      load: () => {
        return lastValueFrom(this.budgetsService.getAll(this.selectedYear, this.selectedMonth));
      },
      insert: (values) => {
        const budget = {
          ...values,
          year: this.selectedYear,
          month: this.selectedMonth,
        };
        return lastValueFrom(this.budgetsService.create(budget)).catch((error) => {
          if (
            error.error &&
            typeof error.error === 'string' &&
            error.error.includes('Budget already exists')
          ) {
            throw new Error(
              'Ya existe un presupuesto para este tipo de gasto en el mes seleccionado'
            );
          }
          throw error;
        });
      },
      update: (key, values) => lastValueFrom(this.budgetsService.update(key, values)),
      remove: (key) => lastValueFrom(this.budgetsService.delete(key)),
    });

    this.dataSource = new DataSource({
      store: this.budgetsStore,
    });
  }

  ngOnInit(): void {
    this.expenseTypesDataSource.load();
  }

  previousMonth(): void {
    const newDate = new Date(this.selectedDate);
    newDate.setMonth(newDate.getMonth() - 1);
    this.selectedDate = newDate;
    this.selectedYear = newDate.getFullYear();
    this.selectedMonth = newDate.getMonth() + 1;
  }

  nextMonth(): void {
    const newDate = new Date(this.selectedDate);
    newDate.setMonth(newDate.getMonth() + 1);
    this.selectedDate = newDate;
    this.selectedYear = newDate.getFullYear();
    this.selectedMonth = newDate.getMonth() + 1;
  }

  onDateChanged(e: any) {
    if (e.value) {
      const date = new Date(e.value);
      this.selectedYear = date.getFullYear();
      this.selectedMonth = date.getMonth() + 1;
      this.refreshGrid();
    }
  }

  refreshGrid() {
    // Reload the grid with new year/month
    this.dataSource.reload();
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
