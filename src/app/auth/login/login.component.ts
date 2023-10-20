import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { SuperadminDashboardComponent } from 'src/app/landing/superadmin-dashboard/superadmin-dashboard.component';
import { LoginService } from './login.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  
  submitted = false;
  timer = 50;

  stateOptions: any[] = [{label: 'Company', value: 'company'}, {label: 'Vendor', value: 'vendor'}];
  value: string = 'company';

  constructor(
    private router: Router,
    private loginService: LoginService,
    private message: MessageService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loginForm = new FormGroup({
      username: new FormControl('', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.maxLength(30),
      ]),
    });

    sessionStorage.removeItem('mobileNo');
    sessionStorage.removeItem('AadharOtpRefId') ;
    sessionStorage.removeItem('goToAadharOtpPage') ;
  }

  decodedToken: any;

  onSubmitLogin() {
    this.submitted = true;
    this.loginService
      .doLogin(this.loginForm.value)
      .then((res) => {
        if (res) {
          console.log("Sign In Done");
          sessionStorage.setItem('token', res.jwt);
          sessionStorage.setItem('refreshToken', res.refreshToken);
          this.submitted = false;
          this.router.navigate(['/dashboard']);
          this.message.add({
            severity: 'sucess',
            summary: 'Sign In Successful',
            detail: res.message,
            life: 3000,
          });

        } else {
          this.message.add({
            severity: 'error',
            summary: 'Login Error',
            detail: 'Invalid Login, please check credentials',
            life: 3000,
          });
          this.submitted = false;
        }
        this.submitted = false;
      })
      .catch((err) => {
        if (err.status === 0) {
          this.message.add({
            severity: 'error',
            summary: 'Login Error',
            detail: 'Check Server Connection',
            life: 3000,
          });
        } else if (err.code === 404) {
          this.message.add({
            severity: 'error',
            summary: 'Login Error',
            detail: 'Check Server Connection',
            life: 3000,
          });
        } else {
          this.message.add({
            severity: 'error',
            summary: 'Login Error',
            detail: err.error.message,
            life: 3000,
          });
        }
        this.submitted = false;
      });
  }
}
