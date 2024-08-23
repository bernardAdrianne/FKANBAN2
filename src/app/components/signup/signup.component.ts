import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-signup',
  // standalone: true,
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent implements OnInit {
  registerData = { username: '', email: '', password: '' };
  registerErrors = { username: '', email: '', password: '' };
  isLoggedIn: boolean = false;
  showRegisterForm = true;

  constructor(private router: Router) {}

  ngOnInit() {
    this.loadFormData();
  }

  loadFormData() {
    const storedRegisterData = localStorage.getItem('registerData');
    if (storedRegisterData) {
      this.registerData = JSON.parse(storedRegisterData);
    }
  }

  saveFormData() {
    localStorage.setItem('registerData', JSON.stringify(this.registerData));
  }

  register() {
    this.registerErrors = { username: '', email: '', password: '' };

    if (!this.registerData.username) {
      this.registerErrors.username = 'Username is required';
    }

    if (!this.registerData.email) {
      this.registerErrors.email = 'Email is required';
    } else if (!this.validateEmail(this.registerData.email)) {
      this.registerErrors.email = 'Invalid email format';
    }

    if (!this.registerData.password) {
      this.registerErrors.password = 'Password is required';
    } else if (this.registerData.password.length < 6) {
      this.registerErrors.password = 'Password must be at least 6 characters';
    }

    if (this.registerErrors.username || this.registerErrors.email || this.registerErrors.password) {
      return;
    }

    console.log('Registering:', this.registerData);
    this.saveFormData();
    this.router.navigate(['/login']);
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