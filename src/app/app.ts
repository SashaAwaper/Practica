import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { Auth } from './auth/auth';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'Form-communication';
  authService = inject(Auth);
  submitted = false;
  success = false;

  topicList: any = [];
  captchaId: string | null = null;
  captchaText: string = '';
  captchaError = false;

  form = new FormGroup({
    username: new FormControl(null, [Validators.required, Validators.minLength(2), Validators.pattern(/^[a-zA-Zа-яА-ЯёЁ\s]+$/)]),
    usermail: new FormControl(null, [Validators.required, Validators.email]),
    userphon: new FormControl(null, [Validators.required, Validators.pattern(/^\d{10,15}$/)]),
    topic: new FormControl(null, [Validators.required]),
    message: new FormControl(null, [Validators.required, Validators.minLength(10), Validators.maxLength(500)]),
    captcha: new FormControl(null, Validators.required),
    captchaId: new FormControl(null, Validators.required) // Добавлено новое поле
  });

  constructor() {
    this.loadTopics();
    this.loadCaptcha(); // Загрузка капчи при инициализации
    
    this.form.get('captcha')?.valueChanges.subscribe(() => {
    this.captchaError = false;
  });
  }

  loadTopics() {
    this.authService.getTopic().subscribe(val => {
      this.topicList = val;
    });
  }

  loadCaptcha() {
    this.authService.generateCaptcha().subscribe({
      next: (response: any) => {
        this.captchaId = response.captchaId;
        this.captchaText = response.captchaText;
        //@ts-ignore
        this.form.patchValue({ captchaId: this.captchaId });
      },
      error: (err) => {
        console.error('Ошибка загрузки капчи', err);
      }
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.valid) {
      // Убедимся, что captchaId актуален
      //@ts-ignore
      this.form.patchValue({ captchaId: this.captchaId });
      
      this.authService.login(this.form.value).subscribe({
        next: (response) => {
          console.log('Успешный ответ от сервера:', response);
          this.loadCaptcha(); // Обновляем капчу после успешной отправки
          this.captchaError = false;
          this.success = true;
        },
        error: (err) => {
          console.error('Ошибка запроса:', err);
          // Обновляем капчу при ошибках типа 400 (неверная капча)
          if (err.status === 400) {
            this.captchaError = true;
            this.success = false;
            this.loadCaptcha();
          }
        }
      });
    }
  }

  closeSuccess() {
  this.success = false;
  this.form.reset(); // Очищаем форму
  this.submitted = false; // Сбрасываем флаг отправки
  this.loadCaptcha(); // Обновляем капчу
}

}