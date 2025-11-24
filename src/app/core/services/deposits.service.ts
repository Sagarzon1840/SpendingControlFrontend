import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DepositsService {
  private endpoint = '/deposits';

  constructor(private api: ApiService) {}

  getAll(filters?: { from?: string; to?: string }): Observable<any[]> {
    let params = new HttpParams();
    if (filters?.from) params = params.set('from', filters.from);
    if (filters?.to) params = params.set('to', filters.to);
    return this.api.get<any[]>(this.endpoint, params);
  }

  getById(id: string): Observable<any> {
    return this.api.get<any>(`${this.endpoint}/${id}`);
  }

  create(deposit: {
    fundId: string;
    date?: string;
    amount: number;
    description?: string;
  }): Observable<any> {
    return this.api.post(this.endpoint, deposit);
  }
}
