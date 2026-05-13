import { Directive, HostListener, Input, inject } from '@angular/core';
import { Toast } from '../../core/services/toast';

@Directive({
  selector: '[appSafeInput]',
  standalone: true
})
export class DirectivaDatos {
  @Input() permitirCaracteresTarea: boolean = false;

  private servicioToast = inject(Toast);

  @HostListener('paste', ['$event'])
  alPegar(event: ClipboardEvent) {
    event.preventDefault();
    this.servicioToast.showError('Por seguridad, no está permitido pegar texto en este campo.');
  }

  @HostListener('drop', ['$event'])
  alSoltar(event: DragEvent) {
    event.preventDefault();
  }

  @HostListener('keypress', ['$event'])
  alPresionarTecla(event: KeyboardEvent) {
    const teclasControl = ['Enter', 'Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'];
    if (teclasControl.includes(event.key)) {
      return;
    }
    let regex = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s.,@_]+$/;

    if (this.permitirCaracteresTarea) {
      regex = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s.,@_\-\[\]]+$/;
    }

    if (!regex.test(event.key)) {
      event.preventDefault();
    }
  }
}
