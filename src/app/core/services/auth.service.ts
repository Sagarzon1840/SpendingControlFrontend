import { Injectable, signal } from '@angular/core';
import { ApiService } from './api.service';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenKey = 'auth_token';
  currentUser = signal<any>(null); // Simplified user state

  constructor(private apiService: ApiService, private router: Router) {
    const token = this.getToken();
    if (token) {
      // Ideally we would validate the token or decode it to get user info
      this.currentUser.set({ token });
    }
  }

  login(credentials: any): Observable<any> {
    // The backend uses JWT Bearer. Assuming a login endpoint exists or we use a token endpoint.
    // Based on context, it says "Autenticación: JWT Bearer". It doesn't explicitly list a /login endpoint in the summary,
    // but usually it's /auth/login or similar. I'll assume /auth/login for now or ask user if it fails.
    // Wait, the context says "Todas las rutas de controladores están protegidas".
    // It doesn't mention the Auth controller. I'll assume standard /auth/login or similar.
    // Let's assume a standard POST /login or /auth/login. I'll use /auth/login.
    return this.apiService.post('/auth/login', credentials).pipe(
      tap((response: any) => {
        this.setToken(response.token);
        this.currentUser.set({ token: response.token });
      })
    );
  }

  register(data: any): Observable<any> {
    return this.apiService.post('/auth/register', data);
  }

  logout() {
    this.removeToken();
    this.currentUser.set(null);
    this.router.navigate(['/auth']);
  }

  getToken(): string | null {
    return sessionStorage.getItem(this.tokenKey);
  }

  private setToken(token: string) {
    sessionStorage.setItem(this.tokenKey, token);
  }

  private removeToken() {
    sessionStorage.removeItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
