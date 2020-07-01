import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User } from '../interfaces';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  constructor(private http: HttpClient) {}

  public login(user: User): Observable<{accessToken: string}> {
    return this.http.post<{accessToken: string}>('/api/v1/login', user)
      .pipe(tap(({accessToken}) => {
        this.setToken(accessToken);
      }));
  }

  public register(user: User): Observable<{accessToken: string}> {
    return this.http.post<{accessToken: string}>('/api/v1/register', user)
  }

  public setToken(token: string) { localStorage.setItem('auth-token', token) }

  public getToken(): string { return localStorage.getItem('auth-token') }

  public isAuthenticated(): boolean { return !!localStorage.getItem('auth-token') }

  public logout() {
    localStorage.removeItem('auth-token');
  }
}