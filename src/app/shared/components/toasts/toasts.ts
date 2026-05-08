import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Toast } from '../../../core/services/toast';

@Component({
  selector: 'app-toasts',
  imports: [CommonModule],
  template: ` 
  <div class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 1200">
      <div *ngFor="let toast of toastService.toasts"
           class="toast show align-items-center border-0 mb-2 {{ toast.classname }}"
           role="alert" aria-live="assertive" aria-atomic="true">
        <div class="d-flex">
          <div class="toast-body">
            {{ toast.message }}
          </div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" 
                  aria-label="Close" (click)="toastService.remove(toast)"></button>
        </div>
      </div>
    </div>
     `,
  styles: ``,
})
export class Toasts {
  toastService = inject(Toast);
}
