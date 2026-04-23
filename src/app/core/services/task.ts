import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

//creamos la interfaz
export interface Task {
  id?: number;
  name: string;
  description: string;
  priority: boolean;
  user_id?: number;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/task';

  //obtener todas las tareas del usuario logueado
  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/get-tasks`);
  }

  //obtener una tarea por ID
  getTaskById(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${id}`);
  }

  //para crear tarea
  createTask(task: Task): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task);
  }

  //para actualizar tarea
  updateTask(id: number, task: Partial<Task>): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${id}`, task);
  }

  //para eliminar tarea
  deleteTask(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}