import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class BudgetsService {
  private endpoint = '/budgets';

  constructor(private api: ApiService) {}

  getAll(year?: number, month?: number): Observable<any[]> {
    let params = new HttpParams();
    if (year) params = params.set('year', year.toString());
    if (month) params = params.set('month', month.toString());
    return this.api.get<any[]>(this.endpoint, params);
  }

  getById(id: string): Observable<any> {
    return this.api.get<any>(`${this.endpoint}/${id}`);
  }

  create(budget: {
    spendTypeId: string;
    year: number;
    month: number;
    amount: number;
  }): Observable<any> {
    return this.api.post(this.endpoint, budget);
  }

  update(id: string, budget: { amount?: number }): Observable<any> {
    return this.api.patch(`${this.endpoint}/${id}`, budget);
  }

  delete(id: string): Observable<any> {
    return this.api.delete(`${this.endpoint}/${id}`);
  }
}
