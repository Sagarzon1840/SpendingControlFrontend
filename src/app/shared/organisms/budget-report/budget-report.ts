import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  DxDataGridModule,
  DxDateBoxModule,
  DxButtonModule,
  DxChartModule,
} from 'devextreme-angular';
import { ReportsService } from '../../../core/services/reports.service';

@Component({
  selector: 'app-budget-report',
  standalone: true,
  imports: [CommonModule, DxDataGridModule, DxDateBoxModule, DxButtonModule, DxChartModule],
  templateUrl: './budget-report.html',
  styleUrl: './budget-report.css',
})
export class BudgetReportComponent implements OnInit {
  fromDate: Date | null = null;
  toDate: Date | null = null;
  reportData: any[] = [];
  isLoading = false;

  constructor(private reportsService: ReportsService) {
    // Inicializar con el mes actual
    const now = new Date();
    this.fromDate = new Date(now.getFullYear(), now.getMonth(), 1);
    this.toDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  }

  ngOnInit(): void {
    this.loadReport();
  }

  loadReport(): void {
    if (!this.fromDate || !this.toDate) {
      alert('Por favor seleccione ambas fechas');
      return;
    }

    this.isLoading = true;
    const from = this.fromDate.toISOString();
    const to = this.toDate.toISOString();
    this.reportsService.getBudgetVsExecution(from, to).subscribe({
      next: (data) => {
        this.reportData = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading report:', err);
        const msg = err?.readableMessage || err?.message || 'Error cargando reporte';
        alert(msg);
        this.isLoading = false;
      },
    });
  }

  calculateVariance(item: any): number {
    return item.budget - item.executed;
  }

  calculateVariancePercent(item: any): number {
    if (item.budget === 0) return 0;
    return (item.executed / item.budget) * 100;
  }

  customizePercentText = (cellInfo: any) => {
    return cellInfo.valueText;
  };
}
