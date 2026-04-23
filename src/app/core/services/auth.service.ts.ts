import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;  //para el LOGIN
  private userUrl = environment.userUrl; //para obtener los datos del USUARIO

  private currentUserSubject = new BehaviorSubject<boolean>(false);
  public isLoggedIn$ = this.currentUserSubject.asObservable();

  // Or if the user exactly referred to `isLoggedIn` as a behavior subject:
  public isLoggedIn = new BehaviorSubject<boolean>(false);

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials, {
      withCredentials: true
    }).pipe(
      tap((response: any) => {
        this.currentUserSubject.next(true);
        this.isLoggedIn.next(true);
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
