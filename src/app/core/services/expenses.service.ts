import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ExpensesService {
  private endpoint = '/expenses';

  constructor(private api: ApiService) {}

  getAll(params: any = {}): Observable<any> {
    let httpParams = new HttpParams();
    Object.keys(params).forEach((key) => {
      if (params[key] !== null && params[key] !== undefined) {
        httpParams = httpParams.set(key, params[key]);
      }
    });
    return this.api.get<any>(this.endpoint, httpParams);
  }

  getById(id: string): Observable<any> {
    return this.api.get<any>(`${this.endpoint}/${id}`);
  }

  create(expense: any): Observable<any> {
    return this.api.post(this.endpoint, expense);
  }

  update(id: string, expense: any): Observable<any> {
    return this.api.patch(`${this.endpoint}/${id}`, expense);
  }

  delete(id: string): Observable<any> {
    return this.api.delete(`${this.endpoint}/${id}`);
  }
}
