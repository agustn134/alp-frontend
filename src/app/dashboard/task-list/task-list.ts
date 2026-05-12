import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { TaskService, Task } from '../../core/services/task';
import { CommonModule } from '@angular/common';
import { Navbar } from "../../shared/components/navbar/navbar";
import { TaskForm } from '../task-form/task-form';
import { Toast } from '../../core/services/toast';

@Component({
  selector: 'app-task-list',
  imports: [
    CommonModule,
    Navbar,
    TaskForm
  ],
  templateUrl: './task-list.html',
  styleUrl: './task-list.scss',
})
export class TaskList implements OnInit {
  private taskService = inject(TaskService);
  private toastService = inject(Toast);
  private cdr = inject(ChangeDetectorRef);

  tareas: any[] = [];
  filtrodetareas: Task[] = [];
  tareaSeleccionada: Task | null = null;
  showModal = false;

  mostrarModalEliminar = false;
  idTareaAEliminar: number | null = null;

  valoresFiltro = {
    texto: '',
    prioridad: 'TODAS'
  };

  ngOnInit() {
    this.cargarTareas();
  }

  cargarTareas() {
    this.taskService.getTasks().subscribe({
      next: (data) => {
        this.tareas = data;
        this.aplicarFiltros();
        this.cdr.detectChanges();
      }, error: (err) => {
        console.error("Error al cargar tareas:", err);
      }
    });
  }

  aplicarFiltrotextoo(event: Event) {
    this.valoresFiltro.texto = (event.target as HTMLInputElement).value;
    this.aplicarFiltros();
  }

  aplicarFiltroPrioridad(value: string) {
    this.valoresFiltro.prioridad = value;
    this.aplicarFiltros();
  }


  aplicarFiltros() {
    this.filtrodetareas = this.tareas.filter(tarea => {

      let coincidenciaPrioridad = true;
      if (this.valoresFiltro.prioridad !== 'TODAS') {
        const esAlta = this.valoresFiltro.prioridad === 'TRUE';
        coincidenciaPrioridad = tarea.priority === esAlta;
      }

      let coincidenciaTexto = true;
      if (this.valoresFiltro.texto) {
        const nombre = tarea.name || '';
        const descripcion = tarea.description || '';
        const textoABuscar = `${nombre} ${descripcion}`.toLowerCase();
        coincidenciaTexto = textoABuscar.includes(this.valoresFiltro.texto.toLowerCase());
      }

      return coincidenciaPrioridad && coincidenciaTexto;
    });
  }

  getLineasDescripcion(descripcion: string): string[] {
    return descripcion ? descripcion.split('\n') : [];
  }

  palancaSubtarea(tarea: Task, index: number, event: Event) {
    const estaMarcado = (event.target as HTMLInputElement).checked;
    const lineas = tarea.description.split('\n');
    let linea = lineas[index];
    //si esta marcado el checkbox rnyonvrd reemplazar - [ ] por - [x] y si no esta marcado reemplazar - [x] por - [ ]
    if (estaMarcado) {
      linea = linea.replace(/-\s*\[\s*\]/, '- [x]');
    } else {
      linea = linea.replace(/-\s*\[[xX]\]/, '- [ ]');
    }

    lineas[index] = linea;
    tarea.description = lineas.join('\n');

    this.taskService.updateTask(tarea.id!, { description: tarea.description }).subscribe({
      error: () => {
        this.toastService.showError('Error al guardar la subtarea');
        this.cargarTareas();
      }
    });
  }

  abrirModalEliminar(id: number | undefined) {
    if (id === undefined) return;
    this.idTareaAEliminar = id;
    this.mostrarModalEliminar = true;
  }

  cerrarModalEliminar() {
    this.mostrarModalEliminar = false;
    this.idTareaAEliminar = null;
  }

  confirmarEliminacion() {
    if (this.idTareaAEliminar !== null) {
      this.taskService.deleteTask(this.idTareaAEliminar).subscribe({
        next: () => {
          this.toastService.showSuccess('Tarea eliminada correctamente');
          this.cargarTareas();
          this.cerrarModalEliminar();
        },
        error: (err) => {
          console.error("Error al eliminar la tarea:", err);
          this.cerrarModalEliminar();
        }
      });
    }
  }

  abrirNuevaTarea() {
    this.tareaSeleccionada = null;
    this.showModal = true;
  }

  abrirEditarTarea(tarea: Task) {
    this.tareaSeleccionada = tarea;
    this.showModal = true;
  }

  closeModal(reload: boolean) {
    this.showModal = false;
    this.tareaSeleccionada = null;
    if (reload) {
      this.cargarTareas();
    }
  }
}
