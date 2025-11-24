import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private formatErrors(error: HttpErrorResponse) {
    let readable = 'Unexpected error';
    const payload = error.error;
    if (payload) {
      if (typeof payload === 'string') {
        readable = payload;
      } else if (typeof payload === 'object') {
        const parts: string[] = [];
        for (const key of Object.keys(payload)) {
          const val: any = (payload as any)[key];
          if (Array.isArray(val)) {
            parts.push(`${key}: ${val.join(', ')}`);
          } else if (typeof val === 'string') {
            parts.push(`${key}: ${val}`);
          }
        }
        if (parts.length) {
          readable = parts.join(' | ');
        }
      }
    } else if (error.message) {
      readable = error.message;
    }
    const extended = Object.assign(error, { readableMessage: readable });
    return throwError(() => extended);
  }

  get<T>(path: string, params: HttpParams = new HttpParams()): Observable<T> {
    return this.http
      .get<T>(`${this.baseUrl}${path}`, { params })
      .pipe(catchError(this.formatErrors));
  }

  post<T>(path: string, body: Object = {}): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${path}`, body).pipe(catchError(this.formatErrors));
  }

  patch<T>(path: string, body: Object = {}): Observable<T> {
    return this.http.patch<T>(`${this.baseUrl}${path}`, body).pipe(catchError(this.formatErrors));
  }

  delete<T>(path: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}${path}`).pipe(catchError(this.formatErrors));
  }
}
