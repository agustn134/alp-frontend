import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { TaskService, Task } from '../../core/services/task';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { TaskForm } from '../task-form/task-form';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-task-list',
  imports: [MatTableModule, MatButtonModule, MatIconModule, MatCardModule, MatChipsModule],
  templateUrl: './task-list.html',
  styleUrl: './task-list.scss',
})
export class TaskList implements OnInit {
  private taskService = inject(TaskService);
  private dialog = inject(MatDialog);
  private cdr = inject(ChangeDetectorRef);

  tasks: Task[] = [];
  displayedColumns: string[] = ['id', 'name', 'description', 'priority', 'actions'];

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.taskService.getTasks().subscribe({
      next: (data) => {
        this.tasks = data;
        this.cdr.detectChanges(); //?es para manejar el ciclo de vida de Angular de forma segura
        //?es decir, para que se reflejen los cambios en la vista  y no quede en un estado inconsistente
      }
    });
  }

  deleteTask(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
      this.taskService.deleteTask(id).subscribe({
        next: () => {
          //?recargamos la lista después de que se borre
          this.loadTasks();
        }
      });
    }
  }

  openCreateTask() {
    const dialogRef = this.dialog.open(TaskForm, {
      width: '500px',
      data: null //?Null significa que es pa tarea nueva
    });

    dialogRef.afterClosed().subscribe({
      next: (result) => {
        if (result) {
          this.loadTasks(); //?recargamos la lista si se guardó
        }
      }
    });
  }

  openEditTask(task: Task) {
    const dialogRef = this.dialog.open(TaskForm, {
      width: '500px',
      data: task //?pasamos la tarea actual para editarla
    });

    dialogRef.afterClosed().subscribe({
      next: (result) => {
        if (result) {
          this.loadTasks(); //?se hace una recarga de la lista si se editó
        }
      }
    });
  }
}
