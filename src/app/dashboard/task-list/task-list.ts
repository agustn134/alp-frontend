import { Component, inject, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { TaskService, Task } from '../../core/services/task';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { TaskForm } from '../task-form/task-form';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-task-list',
  imports: [
    MatTableModule, 
    MatPaginatorModule, 
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule, 
    MatIconModule, 
    MatCardModule, 
    MatChipsModule
  ],
  templateUrl: './task-list.html',
  styleUrl: './task-list.scss',
})
export class TaskList implements OnInit {
  private taskService = inject(TaskService);
  private dialog = inject(MatDialog);
  private cdr = inject(ChangeDetectorRef);

  dataSource = new MatTableDataSource<Task>([]);
  displayedColumns: string[] = ['id', 'name', 'description', 'priority', 'actions'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // Estado interno para múltiples combinaciones de búsqueda
  filterValues = {
    text: '',
    priority: 'ALL'
  };

  ngOnInit() {
    // Sobreescribimos el filtro para leer el objeto parseado
    this.dataSource.filterPredicate = (data: Task, filterStr: string) => {
      const searchTerms = JSON.parse(filterStr);
      
      let priorityMatch = true;
      if (searchTerms.priority !== 'ALL') {
        const isHigh = searchTerms.priority === 'TRUE';
        priorityMatch = data.priority === isHigh;
      }

      let textMatch = true;
      if (searchTerms.text) {
        const searchString = `${data.name} ${data.description}`.toLowerCase();
        textMatch = searchString.indexOf(searchTerms.text.toLowerCase()) !== -1;
      }

      return priorityMatch && textMatch;
    };

    this.loadTasks();
  }

  loadTasks() {
    this.taskService.getTasks().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
        this.cdr.detectChanges(); 
      }
    });
  }

  applyTextFilter(event: Event) {
    this.filterValues.text = (event.target as HTMLInputElement).value;
    this.triggerFilter();
  }

  applyPriorityFilter(value: string) {
    this.filterValues.priority = value;
    this.triggerFilter();
  }

  triggerFilter() {
    this.dataSource.filter = JSON.stringify(this.filterValues);
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
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
