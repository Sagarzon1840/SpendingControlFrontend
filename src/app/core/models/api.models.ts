// DTOs matching backend models

export interface MonetaryFundCreateDto {
  name: string; // 1-200 chars
  type: 'BankAccount' | 'Cash';
  accountNumberOrDescription?: string; // max 100 chars
  initialBalance: number; // >= 0
}

export interface MonetaryFundResponseDto {
  id: string;
  name: string;
  type: string;
  accountNumberOrDescription?: string;
  initialBalance: number;
  currentBalance: number;
}

export interface SpendingDetailCreateDto {
  expenseTypeId: number; // > 0
  amount: number; // > 0
  description?: string;
}

export interface SpendingHeaderCreateDto {
  monetaryFundId: string;
  date: string; // ISO date
  merchantName?: string; // max 200 chars
  observations?: string; // max 1000 chars
  documentType: 'Receipt' | 'Invoice' | 'Other';
  details: SpendingDetailCreateDto[]; // min 1
}

export interface SpendingDetailResponseDto {
  id: string;
  expenseTypeId: number;
  amount: number;
  description?: string;
}

export interface OverdraftWarning {
  expenseTypeName: string;
  budget: number;
  executed: number;
  overdraft: number;
}

export interface SpendingHeaderResponseDto {
  id: string;
  monetaryFundId: string;
  date: string;
  merchantName?: string;
  observations?: string;
  documentType: string;
  details: SpendingDetailResponseDto[];
  overdraftWarnings?: OverdraftWarning[];
}

export interface MovementDto {
  // Revisar Swagger en ejecución para estructura real
  [key: string]: any;
}

export interface BudgetVsExecutionItem {
  expenseTypeId?: number;
  expenseTypeName?: string;
  budget: number;
  executed: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  page: number;
  size: number;
}
