import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DxDataGridModule, DxDateBoxModule } from 'devextreme-angular';
import { MovementsService } from '../../../core/services/movements.service';
import CustomStore from 'devextreme/data/custom_store';
import DataSource from 'devextreme/data/data_source';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-movements-grid',
  standalone: true,
  imports: [CommonModule, DxDataGridModule, DxDateBoxModule],
  templateUrl: './movements-grid.html',
  styleUrl: './movements-grid.css',
})
export class MovementsGridComponent implements OnInit {
  dataSource: DataSource;
  fromDate: Date | null = null;
  toDate: Date | null = null;

  constructor(private movementsService: MovementsService) {
    // Inicializar con el mes actual
    const now = new Date();
    this.fromDate = new Date(now.getFullYear(), now.getMonth(), 1);
    this.toDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    this.dataSource = new DataSource({
      store: new CustomStore({
        load: (loadOptions: any) => {
          const params: any = {};
          if (loadOptions.skip) params.page = loadOptions.skip / (loadOptions.take || 10) + 1;
          if (loadOptions.take) params.size = loadOptions.take;
          if (this.fromDate) params.from = this.fromDate.toISOString();
          if (this.toDate) params.to = this.toDate.toISOString();

          return lastValueFrom(this.movementsService.getAll(params)).then((data: any) => {
            const movements = data.data || data;
            // Add a unique key to each row if it doesn't exist
            const movementsWithKey = Array.isArray(movements)
              ? movements.map((item: any, index: number) => ({
                  ...item,
                  _rowKey: item.id || `${item.type}_${item.date}_${index}`,
                }))
              : [];

            return {
              data: movementsWithKey,
              totalCount: data.totalCount || movementsWithKey.length,
            };
          });
        },
      }),
    });
  }

  ngOnInit(): void {}

  searchMovements(): void {
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
