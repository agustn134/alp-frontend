import { Component, EventEmitter, Inject, inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Task, TaskService } from '../../core/services/task';
import { Toast } from '../../core/services/toast';
import { DirectivaDatos } from '../../shared/directivas/diirectivadatos';

@Component({
  selector: 'app-task-form',
  imports: [ReactiveFormsModule, CommonModule, DirectivaDatos],
  templateUrl: './task-form.html',
  styleUrl: './task-form.scss',
})
export class TaskForm implements OnInit {

  private fb = inject(FormBuilder);
  private toastService = inject(Toast);
  private taskService = inject(TaskService);

  constructor() { }

  @Input() tareaAEditar: Task | null = null;
  @Output() cerrarModal = new EventEmitter<boolean>();

  taskForm!: FormGroup;
  modoEdicion = false;

  ngOnInit(): void {
    this.inicializarFormulario();

    if (this.tareaAEditar) {
      this.modoEdicion = true;
      this.taskForm.patchValue({
        name: this.tareaAEditar.name,
        description: this.tareaAEditar.description,
        priority: this.tareaAEditar.priority ? 'true' : 'false'
      });
    } else {
      this.modoEdicion = false;
    }
  }

  inicializarFormulario() {

    const patronTextoValido = /^(?!\s*$).+/;

    this.taskForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100), Validators.pattern(patronTextoValido)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500), Validators.pattern(patronTextoValido)]],
      priority: ['false', [Validators.required]]
    });
  }

  cancelarAccion() {
    this.cerrarModal.emit(false);
  }

  obtenerErrorValidacion(campo: string, tipoError: string) {
    return this.taskForm.get(campo)?.hasError(tipoError) && this.taskForm.get(campo)?.touched;
  }

  manejarTecladoDescripcion(evento: KeyboardEvent) {
    if (evento.key === 'Enter') {
      evento.preventDefault();
      const areaTexto = evento.target as HTMLTextAreaElement;
      const posicionInicio = areaTexto.selectionStart;
      const posicionFin = areaTexto.selectionEnd;
      let valorActualDescripcion = this.taskForm.get('description')?.value || '';

      const textoPrevioCursor = valorActualDescripcion.substring(0, posicionInicio);
      const lineasTextoPrevio = textoPrevioCursor.split('\n');
      const lineaEnEdicion = lineasTextoPrevio[lineasTextoPrevio.length - 1];

      if (lineaEnEdicion.trim() === '- [ ]' || lineaEnEdicion.trim() === '- [x]') {
        const nuevaPosicion = posicionInicio - lineaEnEdicion.length;
        const textoResultante = valorActualDescripcion.substring(0, nuevaPosicion) + '\n' + valorActualDescripcion.substring(posicionFin);
        this.taskForm.get('description')?.setValue(textoResultante);

        setTimeout(() => {
          areaTexto.selectionStart = areaTexto.selectionEnd = nuevaPosicion + 1;
        }, 0);
        return;
      }

      let textoAInsertar = '\n- [ ] ';
      if (valorActualDescripcion.trim() === '') {
        textoAInsertar = '- [ ] ';
      }

      const textoActualizado = valorActualDescripcion.substring(0, posicionInicio) + textoAInsertar + valorActualDescripcion.substring(posicionFin);
      this.taskForm.get('description')?.setValue(textoActualizado);

      setTimeout(() => {
        areaTexto.selectionStart = areaTexto.selectionEnd = posicionInicio + textoAInsertar.length;
      }, 0);
    }
  }

  procesarEnvioFormulario(): void {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      this.toastService.showError('Por favor, verifique los datos ingresados en el formulario.');
      return;
    }

    const valoresCrudos = this.taskForm.value;

    let descripcionBruta = valoresCrudos.description || '';
    let descripcionLimpia = descripcionBruta
      .split('\n')
      .filter((linea: string) => {
        const lineaSinEspacios = linea.trim();
        return lineaSinEspacios !== '- [ ]' && lineaSinEspacios !== '- [x]' && lineaSinEspacios !== '';
      })
      .join('\n')
      .trim();

    if (descripcionLimpia.length < 10) {
      this.toastService.showError('La descripción real (sin subtareas vacías) debe tener al menos 10 caracteres.');
      return;
    }

    const datosProcesadosTarea: Task = {
      name: valoresCrudos.name.trim(),
      description: descripcionLimpia,
      priority: valoresCrudos.priority === 'true'
    };

    if (this.modoEdicion && this.tareaAEditar?.id) {
      this.taskService.updateTask(this.tareaAEditar.id, datosProcesadosTarea).subscribe({
        next: () => {
          this.toastService.showSuccess('Información actualizada correctamente.');
          this.cerrarModal.emit(true);
        },
        error: (err) => {
          const mensajeErrorServidor = err.error?.message || 'Fallo en la comunicación con el servidor al actualizar.';
          this.toastService.showError(mensajeErrorServidor);
        }
      });
    } else {
      this.taskService.createTask(datosProcesadosTarea).subscribe({
        next: () => {
          this.toastService.showSuccess('Nueva tarea registrada exitosamente.');
          this.cerrarModal.emit(true);
        },
        error: (err) => {
          const mensajeErrorServidor = err.error?.message || 'Fallo en la comunicación con el servidor al registrar.';
          this.toastService.showError(mensajeErrorServidor);
        }
      });
    }
  }


}

//?Reactive Forms para proteger los insputs de una inyección de código xss

