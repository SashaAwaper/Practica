import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  http = inject(HttpClient);

  private getHeaders() {
    return new HttpHeaders({
      'bypass-tunnel-reminder': '1'
    });
  }

  generateCaptcha() {
    return this.http.get('https://formcom.loca.lt/api/feedback/captcha', {
      headers: this.getHeaders()
    });
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
      'https://formcom.loca.lt/api/feedback/submit', 
      transformedData,
      { headers: this.getHeaders() }
    );
  }
  
  getTopic() {
    return this.http.get('https://formcom.loca.lt/api/feedback/topics', {
      headers: this.getHeaders()
    });
  }

  constructor() { }
}