import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Toast } from '../../../core/services/toast';

@Component({
  selector: 'app-toasts',
  imports: [CommonModule],
  template: ` 
  <div class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 1200">
      
      <div *ngFor="let toast of toastService.toasts"
           class="toast show border-0 mb-2 {{ toast.classname }}"
           role="alert" aria-live="assertive" aria-atomic="true" data-bs-theme="light">
        
        <div class="toast-header border-bottom border-light border-opacity-25 bg-transparent text-white">
          <i class="bi bi-bell-fill me-2"></i>
          <strong class="me-auto">Sistema</strong>
          <small>Justo ahora</small>
          <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close" 
                  (click)="toastService.remove(toast)"></button>
        </div>
        
        <div class="toast-body">
          {{ toast.message }}
        </div>
        
      </div>

  </div>
     `,
  styles: ``,
})
export class Toasts {
  toastService = inject(Toast);
}
