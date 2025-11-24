import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FundsService {
  private endpoint = '/monetary-funds';

  constructor(private api: ApiService) {}

  getAll(): Observable<any[]> {
    return this.api.get<any[]>(this.endpoint);
  }

  getById(id: string): Observable<any> {
    return this.api.get<any>(`${this.endpoint}/${id}`);
  }

  create(fund: any): Observable<any> {
    return this.api.post(this.endpoint, fund);
  }

  update(id: string, fund: any): Observable<any> {
    return this.api.patch(`${this.endpoint}/${id}`, fund);
  }

  delete(id: string): Observable<any> {
    return this.api.delete(`${this.endpoint}/${id}`);
  }
}
