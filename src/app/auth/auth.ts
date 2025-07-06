import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  http = inject(HttpClient)

  generateCaptcha() {
    return this.http.get ('https://localhost:7118/api/feedback/captcha');
  }
  
  login(payload: any) {
  const transformedData = {
    Name: payload.username,
    Email: payload.usermail,
    Phone: payload.userphon,
    Topic: payload.topic,
    Message: payload.message,
    Captcha: payload.captcha,
    CaptchaId: payload.captchaId,
    CaptchaValue: payload.captcha
  };
  
  return this.http.post(
    'https://localhost:7118/api/feedback/submit', 
    transformedData
  );
}
  
  getTopic(){
    return this.http.get('https://localhost:7118/api/feedback/topics')
    
  }

constructor() { }
}