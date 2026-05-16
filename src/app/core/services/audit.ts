import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { audit, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuditService {
  private http = inject(HttpClient);
  private apiUrl = environment.auditUrl;
  //private apiUrl = 'http://localhost:3000/api/audit';

  getMyLogs(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/my-logs`, { withCredentials: true });
  }

  getAllLogs(filters: any): Observable<any[]> {
    let params = new HttpParams();

    if (filters.startDate) params = params.set('startDate', filters.startDate.toISOString());
    if (filters.endDate) params = params.set('endDate', filters.endDate.toISOString());
    if (filters.severity) params = params.set('severity', filters.severity);
    if (filters.userId) params = params.set('userId', filters.userId);

    return this.http.get<any[]>(`${this.apiUrl}/all`, { params, withCredentials: true });
  }
}
