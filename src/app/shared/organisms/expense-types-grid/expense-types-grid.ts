import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DxDataGridModule } from 'devextreme-angular';
import { ExpenseTypesService } from '../../../core/services/expense-types.service';
import CustomStore from 'devextreme/data/custom_store';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-expense-types-grid',
  standalone: true,
  imports: [CommonModule, DxDataGridModule],
  templateUrl: './expense-types-grid.html',
  styleUrl: './expense-types-grid.css',
})
export class ExpenseTypesGridComponent implements OnInit {
  dataSource: any;
  isEditing = false;
  editingRowState = true;
  editingRowKey: any = null;
  gridInstance: any;
  formInstance: any;
  initialState = true;
  stateChanged = false;

  customizeStateText = (cellInfo: any) => {
    return cellInfo.isActive === true ? 'Activo' : 'Inactivo';
  };

  constructor(private expenseTypesService: ExpenseTypesService) {
    this.dataSource = new CustomStore({
      key: 'id',
      load: () => lastValueFrom(this.expenseTypesService.getAll()),
      insert: (values) => {
        // Usar el valor actual de editingRowState que puede haber sido modificado por toggleStateInForm
        const newValues = {
          ...values,
          isActive: this.editingRowState !== undefined ? this.editingRowState : true,
        };
        return lastValueFrom(this.expenseTypesService.create(newValues)).catch((err) => {
          const msg = this.extractErrorMessage(err);
          throw new Error(msg);
        });
      },
      update: (key, values) => {
        // Siempre incluir el estado actual
        const updatedValues = { ...values, isActive: this.editingRowState };
        return lastValueFrom(this.expenseTypesService.update(String(key), updatedValues)).catch(
          (err) => {
            const msg = this.extractErrorMessage(err);
            throw new Error(msg);
          }
        );
      },
    });
  }

  ngOnInit(): void {}

  onEditorPreparing(e: any) {
    if (e.dataField === 'isActive' && e.row && e.row.data) {
      const isActiveValue = e.row.data.isActive;
      this.editingRowState = isActiveValue === true;
      this.initialState = this.editingRowState;
      this.editingRowKey = e.row.key;
    }
  }

  onEditingStart(e: any) {
    this.isEditing = true;

    if (e.data) {
      const isActiveValue = e.data.isActive;
      this.editingRowState = isActiveValue === true;
      this.initialState = this.editingRowState;
      this.editingRowKey = e.key;
    } else {
      this.editingRowState = true;
      this.initialState = true;
      this.editingRowKey = null;
    }
    this.stateChanged = false;

    // Capturar la instancia del formulario
    setTimeout(() => {
      if (e.component) {
        const editing = e.component.getController('editing');
        if (editing && editing._editForm) {
          this.formInstance = editing._editForm;
        }
      }
    }, 0);
  }

  onEditCanceled() {
    this.isEditing = false;
    this.editingRowKey = null;
    this.editingRowState = true;
  }

  toggleStateInForm() {
    this.editingRowState = !this.editingRowState;
    this.stateChanged = this.editingRowState !== this.initialState;
    if (this.formInstance) {
      this.formInstance.updateData('isActive', this.editingRowState);
    }
  }

  onSaving(e: any) {
    if (
      this.stateChanged &&
      (!e.changes ||
        e.changes.length === 0 ||
        (e.changes.length > 0 && Object.keys(e.changes[0].data || {}).length === 0))
    ) {
      e.cancel = true;

      let key = this.editingRowKey;

      if (!key && this.gridInstance) {
        const editRowKey = this.gridInstance.option('editing.editRowKey');
        key = editRowKey;
      }

      if (!key) {
        alert('Error: No se pudo identificar el registro a actualizar');
        return;
      }

      e.promise = this.expenseTypesService
        .update(String(key), { isActive: this.editingRowState })
        .toPromise()
        .then(() => {
          this.stateChanged = false;
          // Cerrar el popup de edición
          if (this.gridInstance) {
            this.gridInstance.cancelEditData();
          }
          // Recargar los datos
          this.gridInstance.refresh();
        })
        .catch((err) => {
          const msg = err.error?.readableMessage || err.error?.message || 'Error al actualizar';
          alert(msg);
          throw err;
        });
    } else if (this.stateChanged && e.changes && e.changes.length > 0) {
      // Si hay cambios y el estado también cambió, agregar isActive
      e.changes[0].data.isActive = this.editingRowState;
    }
  }

  onRowUpdating(e: any) {
    if (this.stateChanged && Object.keys(e.newData).length === 0) {
      // Cancelar el guardado automático y hacerlo manualmente
      e.cancel = true;

      // Hacer la actualización manualmente
      this.expenseTypesService
        .update(String(this.editingRowKey), { isActive: this.editingRowState })
        .subscribe({
          next: () => {
            // Recargar los datos del grid
            this.gridInstance.refresh();
            // Cerrar el popup
            this.gridInstance.cancelEditData();
          },
          error: (err) => {
            const msg = err.error?.readableMessage || err.error?.message || 'Error al actualizar';
            alert(msg);
          },
        });
    } else if (this.stateChanged) {
      // Si hay otros cambios, agregar isActive
      e.newData.isActive = this.editingRowState;
    }
  }

  onInitialized(e: any) {
    this.gridInstance = e.component;
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

  private extractErrorMessage(err: any): string {
    // Extraer el mensaje de error del backend
    if (err?.error) {
      // Si el error contiene el mensaje de duplicidad
      if (typeof err.error === 'string') {
        if (err.error.includes('already exists')) {
          return 'Ya existe un tipo de gasto con ese nombre';
        }
        return err.error;
      }

      // Si es un objeto con readableMessage o message
      if (err.error.readableMessage) {
        if (err.error.readableMessage.includes('already exists')) {
          return 'Ya existe un tipo de gasto con ese nombre';
        }
        return err.error.readableMessage;
      }

      if (err.error.message) {
        if (err.error.message.includes('already exists')) {
          return 'Ya existe un tipo de gasto con ese nombre';
        }
        return err.error.message;
      }
    }

    // Si el error tiene mensaje directamente
    if (err?.message) {
      if (err.message.includes('already exists')) {
        return 'Ya existe un tipo de gasto con ese nombre';
      }
      return err.message;
    }

    return 'Ocurrió un error al procesar la solicitud';
  }
}
