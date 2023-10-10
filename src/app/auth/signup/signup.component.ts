import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { LoginService } from '../login/login.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  signUpForm!: FormGroup;
  verifyOtpForm!: FormGroup;
  resendOtpForm!: FormGroup;
  verifyOtpMobile!: any;
  submitted = false;
  //type: string | null = 'neocorp';
 
  flag: boolean = false;
  errorMessage: string = '';
  fieldTextType!: boolean;
  display: any;
  verifyOtpFlag = true;
  isAuth = false;
  timer: any;
  sendOtpFormat={'mobile':''};
  selectedOptionGST: any;
  
  checked1: boolean = false;
  checked2: boolean = false;

  types: any = [
    {
      "id": "1",
      "name": "Proprietorship"
    },
    {
      "id": "2",
      "name": "Individual OPC"
    },
    {
      "id": "3",
      "name": "Partnership Frim"
    },
    {
      "id": "4",
      "name": "LLP"
    },
    {
      "id": "5",
      "name": "Private Limited"
    },
    {
      "id": "6",
      "name": "Limited"
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private loginService: LoginService,
    private message: MessageService
  ) {}

  ngOnInit() {
    this.signUpForm = new FormGroup({
      companyName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      mobileNumber: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      agreeTnC: new FormControl('', Validators.required),
      partnerCode: new FormControl(''),
      panNumber: new FormControl('', Validators.required),
      type: new FormControl('', Validators.required),
      selectedOptionGST : new FormControl(false)
    });

  }

  onSubmitOtp() {
    this.verifyOtpForm.patchValue({
      mobileNumber: this.verifyOtpMobile,
    });
    this.submitted = true;
    this.errorMessage = '';
    // alert(JSON.stringify(this.loginForm.value));
    this.loginService
      .verifyOtp(this.verifyOtpForm.value)
      .then((res) => {
        if (res) {
          this.submitted = false;
          // sessionStorage.setItem('token', res.jwt);
          //
          if (res.type == 'error') {
            this.message.add({
              severity: 'error',
              summary: 'Sign Up Error',
              detail: res.message,
              life: 3000,
            });
          } else {
            this.message.add({
              severity: 'sucess',
              summary: 'Sign Up',
              detail: res.message,
              life: 3000,
            });
            this.router.navigate(['/']);
          }
        } else {
          this.message.add({
            severity: 'error',
            summary: 'Sign Up Error',
            detail: 'Invalid OTP, please check ',
            life: 3000,
          });
          this.submitted = false;
        }
      })
      .catch((err) => {
        this.message.add({
          severity: 'error',
          summary: 'Sign Up Error',
          detail: 'Invalid OTP, please check ' + err,
          life: 3000,
        });
      });
  }

  onSubmitSignUp1()
  {
    console.log(this.signUpForm.value);
    // sessionStorage.setItem('mobileNo','7300234997');
    //       this.router.navigate(['/verifyotp']);
    alert(JSON.stringify(this.signUpForm.value));
  }

  onSubmitSignUp() 
  {
    this.submitted = true;
    this.signUpForm.value.agreeTnC = true;
    if(this.signUpForm.value.agreeTnC == false)
    {
      this.message.add({
        severity: 'error',
        summary: 'Sign Up Error',
        detail: 'Please check the validation',
        life: 3000,
      });
      this.submitted = false;
    }
    else{
      this.loginService
      .signup(this.signUpForm.value)
      .then((res) => {
        if (res) {
          this.resendTimer(1);
          console.log("sign up success");
          this.sendOtp(this.signUpForm.value.mobileNumber);
        } else {
          this.message.add({
            severity: 'error',
            summary: 'Sign Up Error',
            detail: 'Invalid Sign Up, please check details',
            life: 3000,
          });
        }
        this.submitted = false;
      })
      .catch((err) => {
        if (err.code === 404) {
          this.errorMessage = err.message;
          this.message.add({
            severity: 'error',
            summary: 'Sign Up Error',
            detail: 'Check Server Connection',
            life: 3000,
          });
        } else {
          this.errorMessage = err.error.message;
          this.message.add({
            severity: 'error',
            summary: 'Sign Up Error',
            detail: 'Invalid Sign Up, please check details',
            life: 3000,
          });
        }
        this.submitted = false;
      });
    }
    
  }
  
  sendOtp( enteredMobile:string)
  {
     this.sendOtpFormat.mobile = enteredMobile ;
     this.loginService.sendOtp(this.sendOtpFormat).then(
      (res)=>{
        if (res) {
          console.log(res);
          sessionStorage.setItem('mobileNo',this.sendOtpFormat.mobile);
          this.router.navigate(['/verifyotp']);
          this.message.add({
            severity: 'sucess',
            summary: 'Sign Up Successful, Verify your OTP',
            detail: res.message,
            life: 3000,
          });
        } else {
          this.message.add({
            severity: 'error',
            summary: 'Sign Up Error',
            detail: 'Invalid Sign Up, please check details',
            life: 3000,
          });
        }
        this.submitted = false;
      }
     ).catch( (err)=>{
      if (err.code === 404) {
        this.errorMessage = err.message;
        this.message.add({
          severity: 'error',
          summary: 'Send OTP Error',
          detail: 'Check Server Connection',
          life: 3000,
        });
      } else {
        this.errorMessage = err.error.message;
        this.message.add({
          severity: 'error',
          summary: 'Send OTP Error',
          detail: 'Invalid Sign Up, please check details',
          life: 3000,
        });
      }
      this.submitted = false;
     });
  }

  resendTimer(minute: number) {
    let seconds: number = minute * 60;
    let textSec: any = '0';
    let statSec: number = 60;

    const prefix = minute < 10 ? '0' : '';

    if (this.timer) {
      clearInterval(this.timer);
    }

    this.timer = setInterval(() => {
      seconds--;
      if (statSec != 0) statSec--;
      else statSec = 59;
      if (statSec < 10) {
        textSec = '0' + statSec;
      } else textSec = statSec;

      this.display = `${prefix}${Math.floor(seconds / 60)}:${textSec}`;

      if (seconds == 0) {
        this.isAuth = true;

        clearInterval(this.timer);
      }
    }, 1000);
  }


  resendOtp() {
    this.loginService
      .resendOtp(this.signUpForm.controls['mobileNumber'].value)
      .then((res) => {
        if (res) {
        }
      });
    this.verifyOtpForm.reset();
    this.verifyOtpFlag = false;
    this.submitted = false;
    this.resendTimer(1);
  }
}
