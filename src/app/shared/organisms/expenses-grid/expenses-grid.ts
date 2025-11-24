import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DxDataGridModule } from 'devextreme-angular';
import { ExpensesService } from '../../../core/services/expenses.service';
import { FundsService } from '../../../core/services/funds.service';
import { ExpenseTypesService } from '../../../core/services/expense-types.service';
import CustomStore from 'devextreme/data/custom_store';
import DataSource from 'devextreme/data/data_source';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-expenses-grid',
  standalone: true,
  imports: [CommonModule, DxDataGridModule],
  templateUrl: './expenses-grid.html',
  styleUrl: './expenses-grid.css',
})
export class ExpensesGridComponent implements OnInit {
  dataSource: any;
  documentTypes = ['Receipt', 'Invoice', 'Other'];
  fundsDataSource: DataSource;
  expenseTypesDataSource: DataSource;
  expenseTypesStore: CustomStore;
  fundsEditorOptions: any;
  currentDetailsData: any;
  currentDetailsValue: any[] = [];
  expenseTypesMap: Map<number, string> = new Map();

  calculateExpenseTypes = (rowData: any) => {
    if (!rowData.details || !Array.isArray(rowData.details) || rowData.details.length === 0) {
      return '';
    }

    const typeNames = rowData.details
      .map((detail: any) => {
        const typeName = this.expenseTypesMap.get(detail.expenseTypeId);
        return typeName || `ID: ${detail.expenseTypeId}`;
      })
      .filter((name: string, index: number, self: string[]) => self.indexOf(name) === index);

    return typeNames.join(', ');
  };

  calculateStatus = (rowData: any) => {
    return rowData.isValid === false ? 'Inactivo' : 'Activo';
  };

  validateDetails = (e: any) => {
    const details = e.value;
    if (!details || !Array.isArray(details) || details.length === 0) {
      return false;
    }
    return details.every((d: any) => d.expenseTypeId > 0 && d.amount > 0);
  };

  onDetailsGridInitialized(e: any, data: any) {
    this.currentDetailsData = data;
  }

  onDetailsChanged(e: any) {
    // Update the stored details whenever the grid changes
    if (e.component && this.currentDetailsData) {
      const gridInstance = e.component;
      const dataSource = gridInstance.option('dataSource') || [];
      this.currentDetailsValue = [...dataSource];
      // Update the form value
      if (this.currentDetailsData.setValue) {
        this.currentDetailsData.setValue(this.currentDetailsValue);
      }
    }
  }

  onEditingStart(e: any) {
    if (e.data && e.data.details) {
      // Cargar los detalles existentes en el valor actual
      this.currentDetailsValue = [...e.data.details];
    } else {
      this.currentDetailsValue = [];
    }
  }

  constructor(
    private expensesService: ExpensesService,
    private fundsService: FundsService,
    private expenseTypesService: ExpenseTypesService
  ) {
    // Create DataSource for funds
    this.fundsDataSource = new DataSource({
      store: new CustomStore({
        key: 'id',
        load: () => lastValueFrom(this.fundsService.getAll()),
      }),
    });

    // Create Store for expense types
    this.expenseTypesStore = new CustomStore({
      key: 'id',
      load: () => lastValueFrom(this.expenseTypesService.getAll()),
    });

    // Create DataSource for expense types
    this.expenseTypesDataSource = new DataSource({
      store: this.expenseTypesStore,
    });

    this.fundsEditorOptions = {
      dataSource: this.fundsDataSource,
      displayExpr: 'name',
      valueExpr: 'id',
      searchEnabled: true,
      placeholder: 'Select a fund...',
    };

    this.dataSource = new CustomStore({
      key: 'id',
      load: (loadOptions: any) => {
        const params: any = {};
        if (loadOptions.skip) params.page = loadOptions.skip / (loadOptions.take || 10) + 1;
        if (loadOptions.take) params.size = loadOptions.take;
        return lastValueFrom(this.expensesService.getAll(params)).then((data: any) => {
          return {
            data: data.data || data,
            totalCount: data.totalCount || 0,
          };
        });
      },
      insert: (values) => {
        // Use stored details if values.details is empty
        const detailsToUse =
          Array.isArray(values.details) && values.details.length > 0
            ? values.details
            : this.currentDetailsValue;

        // Asegurar que details sea un array válido antes de enviar
        const expense = {
          ...values,
          details:
            Array.isArray(detailsToUse) && detailsToUse.length > 0
              ? detailsToUse.filter((d: any) => d.expenseTypeId && d.amount > 0)
              : [],
        };

        // Validar que tenga al menos un detalle
        if (expense.details.length === 0) {
          return Promise.reject(
            new Error('Se requiere al menos un detalle válido con tipo de gasto y monto')
          );
        }

        return lastValueFrom(this.expensesService.create(expense));
      },
      update: (key, values) => {
        const detailsToUse =
          Array.isArray(values.details) && values.details.length > 0
            ? values.details
            : this.currentDetailsValue;

        const expense = {
          ...values,
          details:
            Array.isArray(detailsToUse) && detailsToUse.length > 0
              ? detailsToUse.filter((d: any) => d.expenseTypeId && d.amount > 0)
              : undefined,
        };

        return lastValueFrom(this.expensesService.update(key, expense));
      },
      remove: (key) => lastValueFrom(this.expensesService.delete(key)),
    });
  }

  ngOnInit(): void {
    // Load funds data into the DataSource
    this.fundsDataSource.load();
    // Load expense types data and populate the map
    this.expenseTypesDataSource.load().then(() => {
      this.expenseTypesDataSource.items().forEach((type: any) => {
        this.expenseTypesMap.set(type.id, type.name);
      });
    });
  }

  handleGridError(e: any) {
    const err = e?.error;
    let msg: string | undefined;
    if (typeof err === 'string') {
      msg = err;
    } else if (err) {
      msg = err.readableMessage || err.message;
      // Mostrar warnings de sobregiro si existen
      if (err?.error?.overdraftWarnings && Array.isArray(err.error.overdraftWarnings)) {
        const warnings = err.error.overdraftWarnings
          .map(
            (w: any) =>
              `${w.expenseTypeName}: Budget ${w.budget}, Executed ${w.executed}, Overdraft ${w.overdraft}`
          )
          .join(' | ');
        msg = (msg ? msg + ' - ' : '') + 'Warnings: ' + warnings;
      }
    }
    if (!msg) {
      msg = 'Ocurrió un error';
    }
    e.error = msg;
  }

  onRowInserted(e: any) {
    // Mostrar warnings de sobregiro si vienen en la respuesta
    const warnings = e.data?.overdraftWarnings;
    if (warnings && Array.isArray(warnings) && warnings.length > 0) {
      const msg = warnings
        .map(
          (w: any) =>
            `⚠️ ${w.expenseTypeName}: Presupuesto ${w.budget}, Ejecutado ${w.executed}, Sobregiro ${w.overdraft}`
        )
        .join('\n');
      alert('Gasto creado con advertencias:\n' + msg);
    }
  }
}
