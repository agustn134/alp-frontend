import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/auth';  //para el LOGIN
  private userUrl = 'http://localhost:3000/api/user'; //para obtener los datos del USUARIO

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        //?guardamos los tokens en memoria de sesión por seguridad
        if (response && response.access_token) {
          sessionStorage.setItem('access_token', response.access_token);
          sessionStorage.setItem('refresh_token', response.refresh_token);
        }
      })
    );
  }

  register(userData: any): Observable<any> {
    return this.http.post(this.userUrl, userData);
  }

  getMe(): Observable<any> {
    return this.http.get(`${this.apiUrl}/me`); //?el interceptor se encarga de mandar el token
  }

  logout(): void {
    sessionStorage.clear();
  }
}
