import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { LoginService } from './login.service';
import { AuthService } from '../auth.service';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loginOTPForm !: FormGroup ;


  submitted = false;
  fieldTextType: boolean = false;
  timer = 50;
  verifyOtpMobile : any ;
  showOtpFlag : boolean = false ;

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

    this.loginOTPForm = new FormGroup({
      mobileNumber: new FormControl() ,
      otp: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(6)
      ])
    });

    // if( this.showOtpFlag == true )
    // {
    //   this.startResendTimer(); // for resend timer
    // }

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

            if (err.error.message.includes('User is Inactive')) {
              this.sendOtp() ;
              this.startResendTimer(); // for resend timer
              this.showOtpFlag = true;
              this.verifyOtpMobile = this.loginForm.controls['username'].value;
            }
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

  onSubmitVerifyOTP()
  {
    this.loginOTPForm.value.mobileNumber = this.loginForm.value.username ;
    this.submitted = true;
    this.loginService
      .verifyOtp(this.loginOTPForm.value)
      .then( (res) => 
      {
        this.submitted = false ;
        if(res.type == 'error') {
          this.message.add({
            severity: 'error',
            summary: 'Error',
            detail: res.message,
            life: 3000,
          });
        } else {
          this.message.add({
            severity: 'success',
            summary: 'Success',
            detail: 'OTP Varified, Sign Up Successfully',
            life: 3000,
          });
        setTimeout(() => {
           this.showOtpFlag = false;
        }, 2000);}
      }
      ).catch((err) => {
        this.submitted = false;
        this.message.add({
          severity: 'error',
          summary: 'Verify OTP Error',
          detail: err.error.message
        });
       // this.submitted = false;
      });
  }

  // sendOtp( mobile : any )
  // {
  //   this.submitted = true;

  // }

  sendOtpFormat = { 'mobile': '' };
  errorMessage : any ;

  sendOtp() {
    this.sendOtpFormat.mobile = this.loginForm.value.username  ;
    this.submitted = true;
    this.loginService.sendOtp(this.sendOtpFormat).then(
      (res) => {
        if (res) {
          console.log(res);
          this.submitted = false;
        } else {
          this.submitted = false;
          this.message.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error While Sending OTP to '+this.loginForm.value.username,
            life: 3000,
          });
        }
        this.submitted = false;
      }
    ).catch((err) => {
      this.submitted = false;
      if (err.code === 404) {
        this.errorMessage = err.message;
        this.message.add({
          severity: 'error',
          summary: 'Send OTP Error',
          detail: this.errorMessage,
          life: 3000,
        });
      } else {
        this.errorMessage = err.error.message;
        this.message.add({
          severity: 'error',
          summary: 'Send OTP Error',
          detail: this.errorMessage,
          life: 3000,
        });
      }
      this.submitted = false;
    });
  }

  timerValue: number = 30;
  resendTimerActive: boolean = false;
  timerSubscription !: Subscription;

  startResendTimer(): void {
    this.resendTimerActive = true;
    this.timerValue = 30;

    // Start the countdown
    this.timerSubscription = interval(1000).subscribe(() => {
      if (this.timerValue > 0) {
        this.timerValue--;
      } else {
        this.timerSubscription.unsubscribe();
        this.resendTimerActive = false;
      }
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe from the timer subscription to prevent memory leaks
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  resendOtpFuction()
  {
    this.submitted = true;
    this.loginService
      .resendOtp(this.loginForm.value.username)
      .then( (res) => 
      {
        if( res.type == 'error' )
        {
          console.log(res);
          this.submitted = false;
          this.message.add({
            severity: 'error',
            summary: 'Error',
            detail: res.message
          });
        }
        else{
          console.log(res);
          this.submitted = false;
          this.message.add({
            severity: 'success',
            summary: 'Success',
            detail: 'OTP sent to the mobile'
          });
          this.startResendTimer();
        }
      }
      ).catch((err) => {
        console.log(err);
        this.submitted = false;
        this.message.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error.message
        });
      });
  }

}
