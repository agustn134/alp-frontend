import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = environment.userUrl;

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { withCredentials: true });
  }

  resetPassword(userId: number, newPassword: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${userId}/password`,
      { password: newPassword },
      { withCredentials: true }
    );
  }

  deleteUser(userId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${userId}`, { withCredentials: true });
  }

  updateRole(userId: number, newRole: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${userId}/role`,
      { role: newRole },
      { withCredentials: true }
    );
  }
}