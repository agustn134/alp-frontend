import { Injectable } from '@angular/core';

export interface ToastInfo {
  message: string;
  classname?: string;
  delay?: number;
}
@Injectable({
  providedIn: 'root',
})
export class Toast {
  toasts: ToastInfo[] = [];
  show(message: string, options: any = {}) {
    const toast: ToastInfo = { message, delay: 5000, ...options };
    this.toasts.push(toast);

    if (toast.delay) {
      setTimeout(() => this.remove(toast), toast.delay);
    }
  }
  showSuccess(message: string) {
    this.show(message, { classname: 'text-bg-success' });
  }

  showError(message: string) {
    this.show(message, { classname: 'text-bg-danger' });
  }

  remove(toast: ToastInfo) {
    this.toasts = this.toasts.filter(t => t !== toast);
  }
}
