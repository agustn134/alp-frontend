import { Component, inject, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuditService } from '../../core/services/audit';
import { AuthService } from '../../core/services/auth.service.ts';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-audit-logs',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatTableModule, MatCardModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule,
    MatDatepickerModule, MatNativeDateModule, MatChipsModule, MatPaginatorModule
  ],
  templateUrl: './audit-logs.html',
  styleUrl: './audit-logs.scss'
})
export class AuditLogs implements OnInit {
  private auditSvc = inject(AuditService);
  private authSvc = inject(AuthService);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);

  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ['timestamp', 'user_id', 'action', 'severity', 'statuscode', 'error'];
  isAdmin: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  filterForm: FormGroup = this.fb.group({
    startDate: [null],
    endDate: [null],
    severity: [''],
    userId: ['']
  });

  ngOnInit() {
    this.authSvc.getMe().subscribe({
      next: (user) => {
        // Verificamos si el usuario es administrador
        this.isAdmin = user.role === 'ADMIN';
        this.cdr.detectChanges();
        this.loadLogs();
      }
    });
  }

  loadLogs() {
    if (this.isAdmin) {
      this.auditSvc.getAllLogs(this.filterForm.value).subscribe({
        next: (data) => {
          this.dataSource.data = data;
          this.dataSource.paginator = this.paginator;
          this.cdr.detectChanges();
        }
      });
    } else {
      this.auditSvc.getMyLogs().subscribe({
        next: (data) => {
          this.dataSource.data = data;
          this.dataSource.paginator = this.paginator;
          this.cdr.detectChanges();
        }
      });
    }
  }

  onFilter() {
    this.loadLogs();
  }

  clearFilters() {
    this.filterForm.reset();
    this.loadLogs();
  }
}