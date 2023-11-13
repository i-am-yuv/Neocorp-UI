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
  fieldTextType: boolean = false;
  timer = 50;

  stateOptions: any[] = [{ label: 'Company', value: 'company' }, { label: 'Vendor', value: 'vendor' }];
  value: string = 'company';

  constructor(
    private router: Router,
    private loginService: LoginService,
    private message: MessageService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.loginForm = new FormGroup({
      username: new FormControl('', [
        Validators.required,
        Validators.minLength(10)
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.maxLength(30),
      ]),
    });

    sessionStorage.removeItem('mobileNo');
    sessionStorage.removeItem('AadharOtpRefId');
    sessionStorage.removeItem('goToAadharOtpPage');
  }

  decodedToken: any;

  onSubmitLogin() {
    this.submitted = true;

    if (this.value == 'company') {
      this.loginService
        .doLogin(this.loginForm.value)
        .then((res) => {
          if (res) {
            console.log("Sign In Done");
            sessionStorage.setItem('token', res.jwt);
            sessionStorage.setItem('refreshToken', res.refreshToken);
            this.submitted = false;
            this.message.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Sign In Successfully',
              life: 2000,
            });
            setTimeout(() => {
              this.router.navigate(['/dashboard']);
            }, 2000);

          } else {
            this.submitted = false;
            this.message.add({
              severity: 'error',
              summary: 'Login Error',
              detail: 'Invalid Login, please check credentials',
              life: 3000,
            });

          }
          this.submitted = false;
        })
        .catch((err) => {
          this.submitted = false;
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

        });
    }
    else if (this.value == 'vendor') {
      this.loginService
        .doVendorLogin(this.loginForm.value)
        .then((res: any) => {
          console.log("Vendor Sign In Done");
          sessionStorage.setItem('token', res.jwt);
          sessionStorage.setItem('refreshToken', res.refreshToken);
          this.submitted = false;

          this.message.add({
            severity: 'success',
            summary: 'Sign In Successful',
            detail: res.message,
            life: 3000,
          });
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 2000);
        }
        ).catch((err) => {
          this.submitted = false;

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

        });
    }
  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

}
