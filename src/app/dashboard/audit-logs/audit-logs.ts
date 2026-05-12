import { Component, inject, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuditService } from '../../core/services/audit';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { Navbar } from "../../shared/components/navbar/navbar";


@Component({
  selector: 'app-audit-logs',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    Navbar
  ],
  templateUrl: './audit-logs.html',
  styleUrl: './audit-logs.scss'
})
export class AuditLogs implements OnInit {
  private auditSvc = inject(AuditService);
  private authSvc = inject(AuthService);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);

  logs: any[] = [];
  displayedColumns: string[] = ['timestamp', 'user_id', 'action', 'severity', 'statuscode', 'error'];
  isAdmin: boolean = false;

  filterForm: FormGroup = this.fb.group({
    startDate: [null],
    endDate: [null],
    severity: [''],
    userId: ['']
  });

  ngOnInit() {
    this.authSvc.getMe().subscribe({
      next: (user) => {
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
          this.logs = data;
          this.cdr.detectChanges();
        }
      });
    } else {
      this.auditSvc.getMyLogs().subscribe({
        next: (data) => {
          this.logs = data;
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
