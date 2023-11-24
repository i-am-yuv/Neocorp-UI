import { AuthService } from './../auth.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { LoginService } from '../login/login.service';
import { Subscription, interval } from 'rxjs';
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
  //  userMobileNumber = '7300234997';
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

    this.startResendTimer();

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
        (res) =>
        {
          this.submitted = false ;
          if(res.type == 'error') {
            this.message.add({
              severity: 'error',
              summary: 'Error',
              detail: res.message,
              life: 3000,
            });
          } else
        {
            console.log("Aadhar OTP verifed");
            // this.submitted  = false;
            this.message.add({
              severity: 'success',
              summary: 'Success',
              detail: 'E-KYC Process Done Successfully',
              life: 3000,
            });
            setTimeout(() => {
              this.aadharPanVerified = true;
            }, 10);
            setTimeout(() => {
              this.goToSignIn();
            }, 2000);}
            this.aadharPanVerified = false;
          }
      ).catch((err) => {
        console.log(err);
        console.log("Error in Aadhar OTP verification");
        this.submitted = false;
        this.message.add({
          severity: 'error',
          summary: 'Verify Aadhar OTP Error',
          detail: err.error.message
        });
      })
  }

  onSubmitOTP() {
    this.verifyOtpForm.value.mobileNumber = this.userMobileNumber;
    this.submitted = true;
    console.log( this.verifyOtpForm.value);
    this.submitted = true;
    this.loginService
      .verifyOtp(this.verifyOtpForm.value)
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
          this.router.navigate(['/eKyc']);
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
      .resendOtp(this.userMobileNumber)
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
