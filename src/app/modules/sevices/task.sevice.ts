import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Task } from '../admin/models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  tasks$ = this.tasksSubject.asObservable();

  constructor() {
    // Load tasks from localStorage when the service is initialized
    this.loadTasksFromLocalStorage();
  }

  getTasks(): Task[] {
    return this.tasksSubject.getValue();
  }

  setTasks(tasks: Task[]): void {
    this.tasksSubject.next(tasks);
    this.saveTasksToLocalStorage();  // Save tasks to localStorage whenever they are set
  }

  addTask(task: Task): void {
    const tasks = this.getTasks();
    this.setTasks([...tasks, task]);
  }

  updateTask(updatedTask: Task): void {
    const tasks = this.getTasks().map(task =>
      task.id === updatedTask.id ? updatedTask : task
    );
    this.setTasks(tasks);
  }

  deleteTask(taskId: string): void {
    const tasks = this.getTasks().filter(task => task.id !== taskId);
    this.setTasks(tasks);
  }

  private saveTasksToLocalStorage(): void {
    const tasks = this.getTasks();
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  public loadTasksFromLocalStorage(): void {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      const tasks = JSON.parse(storedTasks) as Task[];
      this.setTasks(tasks);
    }
  }
}
