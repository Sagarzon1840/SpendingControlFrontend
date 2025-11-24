import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MovementsService {
  private endpoint = '/movements';

  constructor(private api: ApiService) {}

  getAll(
    params: { from?: string; to?: string; page?: number; size?: number } = {}
  ): Observable<any> {
    let httpParams = new HttpParams();
    Object.keys(params).forEach((key) => {
      const value = (params as any)[key];
      if (value !== null && value !== undefined) {
        httpParams = httpParams.set(key, value.toString());
      }
    });
    return this.api.get<any>(this.endpoint, httpParams);
  }
}
