import { inject, Injectable, NgZone } from '@angular/core';

export interface ToastInfo {
  message: string;
  classname?: string;
  delay?: number;
}
@Injectable({
  providedIn: 'root',
})
export class Toast {
  private zone = inject(NgZone);
  toasts: ToastInfo[] = [];
  show(message: string, options: any = {}) {
    this.zone.run(() => {
      const toast: ToastInfo = { message, delay: 3000, ...options };
      this.toasts.push(toast);

      if (toast.delay) {
        setTimeout(() => this.remove(toast), toast.delay);
      }

    });
  }
  showSuccess(message: string) {
    this.show(message, { classname: 'text-bg-success' });
  }

  showError(message: string) {
    this.show(message, { classname: 'text-bg-secondary' });
  }

  remove(toast: ToastInfo) {
    this.toasts = this.toasts.filter(t => t !== toast);
  }
}
