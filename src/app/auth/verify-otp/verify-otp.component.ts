import { AuthService } from './../auth.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { LoginService } from '../login/login.service';
@Component({
  selector: 'app-verify-otp',
  templateUrl: './verify-otp.component.html',
  styleUrls: ['./verify-otp.component.scss'],
})
export class VerifyOtpComponent implements OnInit {
  signUpForm!: FormGroup;

  verifyOtpForm!: FormGroup;
  verifyAadharOtpForm !: FormGroup;

  userMobileNumber = sessionStorage.getItem('mobileNo');
  //  userMobileNumber = '98989898989';
  onlyShowMobile = this.userMobileNumber?.toString().substring(7);

  aadharOtpPage = sessionStorage.getItem('goToAadharOtpPage');
  showAadharOtpPage: boolean = false;

  aadharPanVerified: boolean = false;
  submitted = false;

  token: string | null = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private loginService: LoginService,
    private message: MessageService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {

    this.verifyOtpForm = new FormGroup({
      otp: new FormControl('', Validators.required),
      mobileNumber: new FormControl(''),
    });

    this.verifyAadharOtpForm = new FormGroup({
      otp: new FormControl('', Validators.required),
      refId: new FormControl(''),
    });

    if (this.aadharOtpPage != null) {
      this.showAadharOtpPage = true;
    }
    else {
      this.showAadharOtpPage = false;
    }

  }

  async delayForFiveSeconds() {
    await new Promise(resolve => setTimeout(resolve, 3000));
    this.aadharPanVerified = false;
    this.router.navigate(['/']);
  }

  // Call this function to start the 5-second delay
  startDelay() {
    this.delayForFiveSeconds();
  }
  onSubmitAadharOTP1() {
    this.verifyAadharOtpForm.value.refId = sessionStorage.getItem('AadharOtpRefId');
    console.log(this.verifyAadharOtpForm.value);

    setTimeout(() => {
      this.aadharPanVerified = true;
    }, 1000);
    setTimeout(() => {
      this.goToSignIn();
    }, 5000);
  }
  goToSignIn() {
    this.router.navigate(['/']);
  }

  onSubmitAadharOTP() {
    this.verifyAadharOtpForm.value.refId = sessionStorage.getItem('AadharOtpRefId');
    console.log(this.verifyAadharOtpForm.value);
    console.log("Aadhar OTP verifed");
    this.submitted = true;
    this.loginService.verifyAadharOTP(this.verifyAadharOtpForm.value)
      .then(
        (res) => {
            console.log("Aadhar OTP verifed");
            this.submitted  = false;
            setTimeout(() => {
              this.aadharPanVerified = true;
            }, 1000);
            setTimeout(() => {
              this.goToSignIn();
            }, 5000);
            this.aadharPanVerified = false;
          }
      ).catch((err) => {
        console.log(err);
        console.log("Error in Aadhar OTP verification");
      })
  }

  onSubmitOTP() {
    this.verifyOtpForm.value.mobileNumber = this.userMobileNumber;
    this.submitted = true;
    console.log( this.verifyOtpForm.value);
    this.submitted = true;
    this.loginService
      .verifyOtp(this.verifyOtpForm.value)
      .then((res) => {
        if (res) {
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
            this.submitted = false;
            setTimeout(() => {
              this.router.navigate(['/eKyc']);
            }, 2000);
           
          }
          this.submitted = false;
        } else {
          this.submitted = false;
          this.message.add({
            severity: 'error',
            summary: 'verify Mobile OTP Error',
            detail: 'Invalid OTP, please check ',
            life: 3000,
          });
        }
       
      })
      .catch((err) => {
        this.submitted = false;
        this.message.add({
          severity: 'error',
          summary: 'Verify OTP Error',
          detail: 'Invalid OTP, please check ' + err,
          life: 3000,
        });
       // this.submitted = false;
      });
  }
}
