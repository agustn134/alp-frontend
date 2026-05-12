import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../core/services/auth.service';
import { Router } from '@angular/router';
import { TaskList } from './task-list/task-list.js';
import { Navbar } from '../shared/components/navbar/navbar.js';

@Component({
  selector: 'app-dashboard',
  imports: [Navbar],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
})
export class DashboardComponent implements OnInit {

  private authService = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  user: any = null;
  
  activeSlide = 0;
  totalSlides = 3;
  intervalo: any;

  ngOnInit() {
    this.authService.getMe().subscribe({
      next: (data) => {
        this.user = data;
        this.cdr.detectChanges();
      }
    });

    this.iniciarCarrusel();
  }

  ngOnDestroy() {
    if (this.intervalo) {
      clearInterval(this.intervalo);
    }
  }

  iniciarCarrusel() {
    this.intervalo = setInterval(() => {
      this.nextSlide();
    }, 4000);
  }

  nextSlide() {
    this.activeSlide = (this.activeSlide + 1) % this.totalSlides;
  }

  prevSlide() {
    this.activeSlide = (this.activeSlide - 1 + this.totalSlides) % this.totalSlides;
  }

  goToSlide(index: number) {
    this.activeSlide = index;
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  navegar(url: string) {
    this.router.navigate(["/" + url]);
  }

}
