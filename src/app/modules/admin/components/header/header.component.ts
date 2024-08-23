import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../../sevices/task.sevice';
import { Task } from '../../models/task.model'; 
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  tasks: Task[] = [];
  showLoginForm: boolean = false;
  isLoggedIn: boolean = false;
  showAddTaskForm: boolean = false;
  showLogoutModal: boolean = false;
  newTask = {
    name: '',
    dueDate: '',
    dueTime: ''
  };
  newTaskErrors = {
    name: '',
    dueDate: '',
    dueTime: ''
  };
  loginData = { 
    email: '', 
    password: '' 
  };
  registerData = { 
    username: '',
    email: '', 
    password: '' 
  };

  constructor(private taskService: TaskService, private router: Router) {}

  ngOnInit() {
    this.checkLoginStatus();
  if (!this.isLoggedIn) {
    this.router.navigate(['/login']); 
  } else {
    this.loadFormData();
    this.loadTasks();
  }
}

  initializeApp() {
    this.checkLoginStatus();
    if (this.isLoggedIn) {
      this.loadFormData();
    } else {
      this.router.navigate(['/login']);
    }
  }

  // Login Methods
  checkLoginStatus() {
    this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  }

  // Form Data Management
  loadFormData() {
    this.loginData = JSON.parse(localStorage.getItem('loginData') || '{}');
    this.registerData = JSON.parse(localStorage.getItem('registerData') || '{}'); 
  }

  loadTasks() {
    this.taskService.tasks$.subscribe(tasks => this.tasks = tasks);
  }

  showTaskForm(): void {
    this.showAddTaskForm = true;
  }

  addTask(): void {
    this.newTaskErrors = this.validateTask(this.newTask);

    if (Object.values(this.newTaskErrors).every(error => !error)) {
      const task: Task = {
        id: Date.now().toString(), // Generate a unique ID
        ...this.newTask,
        column: 'todo'
      };
      this.taskService.addTask(task);

      this.newTask = {
        name: '',
        dueDate: '',
        dueTime: ''
      };
      this.showAddTaskForm = false;
    }
  }

  validateTask(task: any): any {
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

  logout(): void {
    this.showLogoutModal = true;
  }

  confirmLogout(): void {
    this.showLogoutModal = false;
    this.isLoggedIn = false;
    localStorage.setItem('isLoggedIn', 'false');
    localStorage.removeItem('tasks');
    this.router.navigate(['/login']); 
  }

  closeLogoutModal(): void {
    this.showLogoutModal = false;
  }
}
