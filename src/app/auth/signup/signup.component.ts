import { Component, HostListener, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { LoginService } from '../login/login.service';
import { branch } from '../auth-model';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  signUpForm!: FormGroup;
  branchForm !: FormGroup;
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
  sendOtpFormat = { 'mobile': '' };
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


  @HostListener('paste', ['$event']) blockPaste(e: KeyboardEvent) {
    e.preventDefault();
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private loginService: LoginService,
    private message: MessageService
  ) { }

  ngOnInit() {
    this.signUpForm = new FormGroup({
      id: new FormControl(''),
      companyName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      mobileNumber: new FormControl('', Validators.required),
      password: new FormControl('', [Validators.required, Validators.pattern(/^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{8,}$/)]),
      agreeTnC: new FormControl('', Validators.required),
      panNumber: new FormControl('', Validators.required),
      type: new FormControl('', Validators.required),
      selectedOptionGST: new FormControl(false),
      branch: new FormControl(''),
      branchName: new FormControl('', [Validators.required]),
      branchCode: new FormControl('', [Validators.required]),
      
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


  onSubmitSignUp() {
    this.submitted = true;
    //alert(JSON.stringify(this.signUpForm.value));

    if (this.signUpForm.value.agreeTnC == false) {

      this.message.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please confirm the validation checkbox',
        life: 3000,
      });

    }
    else {

      var branchData: branch = {};
      branchData.branchName = this.signUpForm.value.branchName;
      branchData.branchCode = this.signUpForm.value.branchCode;

      //alert(JSON.stringify(branchData) ) ;

      this.submitted = true;
      this.loginService
        .createBranch(branchData)
        .then((res) => {
          console.log("branch Creation Done.");
          this.signUpForm.value.branch = res;
          // this.submitted = false;
          this.saveComapany();
        })
        .catch((err) => {
          this.submitted = false;
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
              detail: this.errorMessage,
              life: 3000,
            });
          }
        });
    }
  }

  saveComapany() {
    //alert(JSON.stringify(this.signUpForm.value) ) ;
    this.submitted = true;
    this.loginService
      .signup(this.signUpForm.value)
      .then((res) => {
        if (res) {
          // this.submitted = false;
          console.log("sign up success");
          this.sendOtp(this.signUpForm.value.mobileNumber);
        } else {
          this.submitted = false;
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
        this.submitted = false;
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
            detail: this.errorMessage,
            life: 3000,
          });
        }
      });
  }



  sendOtp(enteredMobile: string) {
    this.sendOtpFormat.mobile = enteredMobile;
    this.submitted = true;
    this.loginService.sendOtp(this.sendOtpFormat).then(
      (res) => {
        if (res) {
          console.log(res);
          this.submitted = false;
          sessionStorage.setItem('mobileNo', this.sendOtpFormat.mobile);
          sessionStorage.setItem('companyName', this.signUpForm.value.companyName);
          this.message.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Please, Verify Your OTP',
            life: 3000,
          });

          setTimeout(() => {
            this.router.navigate(['/verifyotp']);
          }, 2000);

        } else {
          this.submitted = false;
          this.message.add({
            severity: 'error',
            summary: 'Sign Up Error',
            detail: 'Invalid Sign Up, please check details',
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
          detail: 'Check Server Connection',
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

  // resendTimer(minute: number) {
  //   let seconds: number = minute * 60;
  //   let textSec: any = '0';
  //   let statSec: number = 60;

  //   const prefix = minute < 10 ? '0' : '';

  //   if (this.timer) {
  //     clearInterval(this.timer);
  //   }

  //   this.timer = setInterval(() => {
  //     seconds--;
  //     if (statSec != 0) statSec--;
  //     else statSec = 59;
  //     if (statSec < 10) {
  //       textSec = '0' + statSec;
  //     } else textSec = statSec;

  //     this.display = `${prefix}${Math.floor(seconds / 60)}:${textSec}`;

  //     if (seconds == 0) {
  //       this.isAuth = true;

  //       clearInterval(this.timer);
  //     }
  //   }, 1000);
  // }


  // resendOtp() {
  //   this.loginService
  //     .resendOtp(this.signUpForm.controls['mobileNumber'].value)
  //     .then((res) => {
  //       if (res) {
  //       }
  //     });
  //   this.verifyOtpForm.reset();
  //   this.verifyOtpFlag = false;
  //   this.submitted = false;
  //   this.resendTimer(1);
  // }

  // export const StrongPasswordRegx: RegExp =
  // /^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{8,}$/;

}
