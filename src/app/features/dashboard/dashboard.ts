import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { FundsGridComponent } from '../../shared/organisms/funds-grid/funds-grid';
import { ExpenseTypesGridComponent } from '../../shared/organisms/expense-types-grid/expense-types-grid';
import { BudgetsGridComponent } from '../../shared/organisms/budgets-grid/budgets-grid';
import { ExpensesGridComponent } from '../../shared/organisms/expenses-grid/expenses-grid';
import { DepositsGridComponent } from '../../shared/organisms/deposits-grid/deposits-grid';
import { MovementsGridComponent } from '../../shared/organisms/movements-grid/movements-grid';
import { BudgetReportComponent } from '../../shared/organisms/budget-report/budget-report';
import { ButtonComponent } from '../../shared/atoms/button/button.component';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroArrowRightOnRectangle } from '@ng-icons/heroicons/outline';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FundsGridComponent,
    ExpenseTypesGridComponent,
    BudgetsGridComponent,
    ExpensesGridComponent,
    DepositsGridComponent,
    MovementsGridComponent,
    BudgetReportComponent,
    ButtonComponent,
    NgIconComponent,
  ],
  viewProviders: [provideIcons({ heroArrowRightOnRectangle })],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardComponent {
  currentView:
    | 'expense-types'
    | 'funds'
    | 'budgets'
    | 'expenses'
    | 'deposits'
    | 'movements'
    | 'reports' = 'expense-types';

  constructor(private authService: AuthService, private router: Router) {}

  setView(
    view: 'expense-types' | 'funds' | 'budgets' | 'expenses' | 'deposits' | 'movements' | 'reports'
  ) {
    this.currentView = view;
  }

  logout() {
    this.authService.logout();
  }
}
