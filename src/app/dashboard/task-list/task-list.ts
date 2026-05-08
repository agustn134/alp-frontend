import { Component, inject, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { TaskService, Task } from '../../core/services/task';
import { CommonModule } from '@angular/common';
import { TaskForm } from '../task-form/task-form';


@Component({
  selector: 'app-task-list',
  imports: [
    CommonModule, TaskForm
  ],
  templateUrl: './task-list.html',
  styleUrl: './task-list.scss',
})
export class TaskList implements OnInit {
  private taskService = inject(TaskService);

  tasks: Task[] = [];
  filteredTasks: Task[] = [];

  showModal = false;
  selectedTask: Task | null = null;

  filterValues = {
    text: '',
    priority: 'ALL'
  };

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.taskService.getTasks().subscribe({
      next: (data) => {
        this.tasks = data;
        this.applyFilters();
      }
    });
  }



  applyTextFilter(event: Event) {
    this.filterValues.text = (event.target as HTMLInputElement).value;
    this.applyFilters();
  }

  applyPriorityFilter(value: string) {
    this.filterValues.priority = value;
    this.applyFilters();
  }


  applyFilters() {
    this.filteredTasks = this.tasks.filter(task => {
      let priorityMatch = true;
      if (this.filterValues.priority !== 'ALL') {
        const isHigh = this.filterValues.priority === 'TRUE';
        priorityMatch = task.priority === isHigh;
      }

      let textMatch = true;
      if (this.filterValues.text) {
        const searchString = `${task.name} ${task.description}`.toLowerCase();
        textMatch = searchString.includes(this.filterValues.text.toLowerCase());
      }

      return priorityMatch && textMatch;
    });
  }

  deleteTask(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
      this.taskService.deleteTask(id).subscribe({
        next: () => {
          this.loadTasks();
        }
      });
    }
  }

  openCreateTask() {
    this.selectedTask = null;
    this.showModal = true;
  }

  openEditTask(task: Task) {
    this.selectedTask = task;
    this.showModal = true;
  }

  closeModal(reload: boolean) {
    this.showModal = false;
    this.selectedTask = null;
    if (reload) {
      this.loadTasks();
    }
  }
}
