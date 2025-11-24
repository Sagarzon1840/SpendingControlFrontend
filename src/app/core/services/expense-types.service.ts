import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ExpenseTypesService {
  private endpoint = '/expense-types';

  constructor(private api: ApiService) {}

  getAll(): Observable<any[]> {
    return this.api.get<any[]>(this.endpoint);
  }

  getById(id: string): Observable<any> {
    return this.api.get<any>(`${this.endpoint}/${id}`);
  }

  create(expenseType: { name: string; isActive?: boolean }): Observable<any> {
    return this.api.post(this.endpoint, expenseType);
  }

  update(id: string, expenseType: { name?: string; isActive?: boolean }): Observable<any> {
    return this.api.patch(`${this.endpoint}/${id}`, expenseType);
  }

  delete(id: string): Observable<any> {
    return this.api.delete(`${this.endpoint}/${id}`);
  }
}
