import { Component, Inject, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Task, TaskService } from '../../core/services/task';

@Component({
  selector: 'app-task-form',
  imports: [ReactiveFormsModule],
  templateUrl: './task-form.html',
  styleUrl: './task-form.scss',
})
export class TaskForm implements OnInit {

  private fb = inject(FormBuilder);
  private taskService = inject(TaskService);

  constructor() { }

  taskForm!: FormGroup;

  ngOnInit(): void {
    //?comienzo del formulario con las validaciones del backend, el CreateTaskDto en C:\ProyectosDom\alp-api\src\modules\task\dto\create-task.dto.ts
    this.taskForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100), Validators.pattern(/.*\S.*/)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500), Validators.pattern(/.*\S.*/)]],
      priority: [false, [Validators.required]] //? dejo false por defecto
    });
  }

  onSubmit(): void {
    if (this.taskForm.invalid) return;

    //?extraemos los valores crudos del formulario
    const rawValue = this.taskForm.value;

    //?formateamos y blindamos los datos antes de enviarlos a NestJS
    const taskData: Task = {
      name: rawValue.name,
      description: rawValue.description,
      //?si por error venía vacío, nulo o indefinido, se convertirá de forma en false.
      priority: rawValue.priority === true || rawValue.priority === 'true'
    };

  }
}

//?Reactive Forms para proteger los insputs de una inyección de código xss

