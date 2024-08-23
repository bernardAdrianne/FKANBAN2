import { Component,  OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginData = { email: '', password: '' };
  loginErrors = { email: '', password: '' };
  isLoggedIn: boolean = false;
  showLoginForm = true;

  constructor(private router: Router) {}

  ngOnInit() {
    this.loadFormData();
    this.checkLoginStatus();
  }

  checkLoginStatus() {
    this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (this.isLoggedIn) {
      setTimeout(() => {  
        this.router.navigate(['/admin']);
      }, 0);
    } else {
        this.router.navigate(['/login']);  
    }   
  }
  
  loadFormData() {
    const storedLoginData = localStorage.getItem('loginData');
    if (storedLoginData) {
      this.loginData = JSON.parse(storedLoginData);
    }
  }

  saveFormData() {
    localStorage.setItem('loginData', JSON.stringify(this.loginData));
  }

  login() {
    this.loginErrors = { email: '', password: '' };

    if (!this.loginData.email) {
      this.loginErrors.email = 'Email is required';
    } else if (!this.validateEmail(this.loginData.email)) {
      this.loginErrors.email = 'Invalid email format';
    }

    if (!this.loginData.password) {
      this.loginErrors.password = 'Password is required';
    }

    if (this.loginErrors.email || this.loginErrors.password) {
      return;
    }

    console.log('Logging in:', this.loginData);
    this.isLoggedIn = true;
    localStorage.setItem('isLoggedIn', 'true');
    this.saveFormData();
    this.router.navigate(['/admin']);
  }

  validateEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  }

  handleInputFocus(event: FocusEvent) {
    const target = event.target as HTMLInputElement;
    target.classList.add('focused');
  }

  handleInputBlur(event: FocusEvent) {
    const target = event.target as HTMLInputElement;
    target.classList.remove('focused');
    this.validateField(target);
  }

  validateField(input: HTMLInputElement) {
    if (input.classList.contains('input-error')) {
      input.classList.add('input-error');
    } else {
      input.classList.remove('input-error');
    }
  }

  handleKeydown(event: KeyboardEvent, currentInput: HTMLInputElement, nextInput: HTMLInputElement | null) {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (currentInput.value.trim() === '') {
        this.validateField(currentInput);
      } else if (nextInput) {
        nextInput.focus();
      }
    }
  }
}