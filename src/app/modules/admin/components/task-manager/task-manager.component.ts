import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../../sevices/task.sevice';
import { Task } from '../../models/task.model'; 
import { Router } from '@angular/router';

@Component({
  selector: 'app-task-manager',
  templateUrl: './task-manager.component.html',
  styleUrls: ['./task-manager.component.css']
})
export class TaskManagerComponent implements OnInit {
  tasks: Task[] = []; 
  isLoggedIn: boolean = false;
  showEditTaskForm: boolean = false;
  editTask: Task = { id: '', name: '', column: '', dueDate: '', dueTime: '' }; 
  editTaskErrors = {
    name: '',
    dueDate: '',
    dueTime: ''
  };

  constructor(private taskService: TaskService, private router: Router) {}

  ngOnInit() {
    this.checkLoginStatus();
    if (this.isLoggedIn) {
      this.taskService.loadTasksFromLocalStorage();
      this.loadTasks();
    } else { 
      this.router.navigate(['/login']);
    }
  }

  checkLoginStatus() {
    this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  }

  loadTasks() {
    this.taskService.tasks$.subscribe(tasks => this.tasks = tasks);
  }

  hasTasks(column: string): boolean {
    return this.tasks.some(task => task.column === column);
  }

  getTaskCount(column: string): number {
    return this.tasks.filter(task => task.column === column).length;
  }

  allowDrop(event: DragEvent): void {
    event.preventDefault();
  }

  dropTask(column: string, event: DragEvent): void {
    event.preventDefault();
    const taskId = event.dataTransfer?.getData('text');
    const task = this.tasks.find(t => t.id === taskId);
    if (task) {
      task.column = column;
      this.taskService.updateTask(task);
    }
  }

  startDrag(event: DragEvent, task: Task): void {
    event.dataTransfer?.setData('text', task.id);
  }

  endDrag(): void {}

  showEditForm(task: Task): void {
    this.editTask = { ...task }; 
    this.showEditTaskForm = true;
  }

  deleteTask(task: Task): void {
    this.taskService.deleteTask(task.id);
  }

  validateTask(task: Task): any {
    const errors = {
      name: '',
      dueDate: '',
      dueTime: ''
    };

    if (!task.name) {
      errors.name = 'Task name is required.';
    }
    if (!task.dueDate) {
      errors.dueDate = 'Due date is required.';
    }
    if (!task.dueTime) {
      errors.dueTime = 'Due time is required.';
    }

    return errors;
  }

  editCurrentTask(): void {
    if (this.editTask) {
      this.editTaskErrors = this.validateTask(this.editTask);

      if (Object.values(this.editTaskErrors).every(error => !error)) {
        this.taskService.updateTask(this.editTask);
        this.editTask = { id: '', name: '', column: '', dueDate: '', dueTime: '' };
        this.showEditTaskForm = false;
      }
    }
  }

  isOverdue(task: Task): boolean {
    if (!task.dueDate || !task.dueTime) return false;
    const now = new Date();
    const dueDateTime = new Date(`${task.dueDate}T${task.dueTime}`);
    return dueDateTime < now && task.column !== 'done';
  }
}
