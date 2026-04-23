import { Component, Inject, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { Task, TaskService } from '../../core/services/task';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-task-form',
  imports: [ReactiveFormsModule, MatDialogModule, MatButtonModule, MatInputModule, MatSelectModule],
  templateUrl: './task-form.html',
  styleUrl: './task-form.scss',
})
export class TaskForm implements OnInit {

  private fb = inject(FormBuilder);
  private taskService = inject(TaskService);

  constructor(
    public dialogRef: MatDialogRef<TaskForm>,
    @Inject(MAT_DIALOG_DATA) public data: Task | null //?si data existe pues es edición pero si es null entonces ps es creación
  ) { }

  taskForm!: FormGroup;

  ngOnInit(): void {
    //?comienzo del formulario con las validaciones del backend, el CreateTaskDto en C:\ProyectosDom\alp-api\src\modules\task\dto\create-task.dto.ts
    this.taskForm = this.fb.group({
      name: [this.data?.name || '', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      description: [this.data?.description || '', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      priority: [this.data ? this.data.priority : false, [Validators.required]] //? dejo false por defecto
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

    if (this.data && this.data.id) {
      //?formulario en modo edición
      this.taskService.updateTask(this.data.id, taskData).subscribe({
        next: () => {
          this.dialogRef.close(true); //? Cerramos el modal
        }
      });
    } else {
      //?formulario en modo creación
      this.taskService.createTask(taskData).subscribe({
        next: () => {
          this.dialogRef.close(true); //? Cerramos el modal
        }
      });
    }
  }

  //?Reactive Forms para proteger los insputs de una inyección de código xss
}
