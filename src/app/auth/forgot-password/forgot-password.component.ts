import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { LoginService } from '../login/login.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  pwdForm!: FormGroup<any>;
  submitted: boolean = false;

  fieldTextType!: boolean;


  constructor(
    private router: Router,
    private loginService: LoginService,
    private message: MessageService
  ) {}

  ngOnInit(): void {
    // this.pwdForm = new FormGroup({
    //   username: new FormControl('', Validators.required),
    // });

    this.pwdForm = new FormGroup({
      username: new FormControl('', [
        Validators.required,
        Validators.minLength(10)
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.maxLength(30),
      ]),
      confirmPassword: new FormControl('', [
        Validators.required,
        Validators.maxLength(30),
      ]),
    });

  }

  onSubmitForgotPassword()
  {
    if( this.pwdForm.value.password !== this.pwdForm.value.confirmPassword )
    {
      this.message.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Password Mis-matched Error',
        life: 3000,
      });
    }
    else{
      alert(JSON.stringify(this.pwdForm.value) ) ;
      // this.submitted = true;
      // this.loginService
      //   .resendOtp(this.loginForm.value.username)
      //   .then( (res) => 
      //   {
      //     if( res.type == 'error' )
      //     {
      //       console.log(res);
      //       this.submitted = false;
      //       this.message.add({
      //         severity: 'error',
      //         summary: 'Error',
      //         detail: res.message
      //       });
      //     }
      //     else{
      //       console.log(res);
      //       this.submitted = false;
      //       this.message.add({
      //         severity: 'success',
      //         summary: 'Success',
      //         detail: 'OTP sent to the mobile'
      //       });
      //       this.startResendTimer();
      //     }
      //   }
      //   ).catch((err) => {
      //     console.log(err);
      //     this.submitted = false;
      //     this.message.add({
      //       severity: 'error',
      //       summary: 'Error',
      //       detail: err.error.message
      //     });
      //   });
    }



  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

  // onSubmit() {
  //   this.loginService
  //     .resetPassword(this.pwdForm.value.username)
  //     .then((res: any) => {
  //       this.resetMailSent = true;
  //     });
  // }
}
