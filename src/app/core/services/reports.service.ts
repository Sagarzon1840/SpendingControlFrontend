import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReportsService {
  private endpoint = '/reports';

  constructor(private api: ApiService) {}

  getBudgetVsExecution(from: string, to: string): Observable<any[]> {
    let httpParams = new HttpParams().set('from', from).set('to', to);
    return this.api.get<any[]>(`${this.endpoint}/budget-vs-execution`, httpParams);
  }
}
