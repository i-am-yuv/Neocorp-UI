import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { LoginService } from '../login/login.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-ekyc',
  templateUrl: './ekyc.component.html',
  styleUrls: ['./ekyc.component.scss']
})
export class EkycComponent implements OnInit {

  eKycForm!: FormGroup;

  submitted: boolean = false;
  panVerifiedSuccess: boolean = false;

  comName = sessionStorage.getItem('companyName') ?sessionStorage.getItem('companyName') : 'Nil';

  constructor(private router: Router,
    private loginService: LoginService,
    private message: MessageService) { }

  ngOnInit(): void {
    this.eKycForm = new FormGroup({
      aadhaarNumber: new FormControl('', [
        Validators.required,
        Validators.minLength(12),
        Validators.maxLength(12)
      ]),
      pan: new FormControl('', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10),
      ]),
    });

  }

  // onSubmitEKyc1() {
  //   sessionStorage.setItem('goToAadharOtpPage', 'aadharOtpSent');
  //   sessionStorage.setItem('AadharOtpRefId', '54321');
  //   console.log(this.eKycForm.value);
  //   this.router.navigate(['/verifyotp']);
  // }

  onSubmitEKyc() {
    console.log(this.eKycForm.value);
    this.submitted = true;
    this.loginService.verifyPan(this.eKycForm.value.pan).
      then((res) => {
        console.log(res);
        if(res.data.status == 'VALID')
      {
        console.log("PAN Card Status VALID");
       // this.submitted = false;
        this.verifyAadhar();
        this.submitted = false;
      }
      else{
        this.submitted = false;
        console.log("PAN Card Status VALID");
        this.submitted = false;
        this.message.add({
          severity: 'error',
          summary: 'Pan Invalid',
          detail: 'Check your Pan Number',
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
            summary: 'Pan Error',
            detail: 'Check Server Connection1',
            life: 3000,
          });
        } else if (err.code === 404) {
          this.message.add({
            severity: 'error',
            summary: 'Pan Error',
            detail: 'Check Server Connection2',
            life: 3000,
          });
        } else {
          this.message.add({
            severity: 'error',
            summary: 'Pan Error',
            detail: 'Please check your pan card',
            life: 3000,
          });
        }
        this.submitted = false;
      });
  }

  verifyAadhar() {
    this.submitted= true;
    this.loginService.verifyAadhar(this.eKycForm.value.aadhaarNumber).
      then((res) => {
        if (res) {
          console.log("Aadhar Verification Initiated");
          this.submitted = false;
          console.log(res);
          if (res.data.ref_id != null) {
            sessionStorage.setItem('goToAadharOtpPage', 'aadharOtpSent');
            sessionStorage.setItem('AadharOtpRefId', res.data.ref_id);
            this.submitted = false;
            this.message.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Verification done successfully',
              life: 3000,
            });
            setTimeout(() => {
              this.router.navigate(['/verifyotp']);
            }, 2000);
          }
          else {
            this.submitted = false;
            console.log("Aadhar Ref ID is Null");
          }
          this.submitted = false;
        } else {
          this.submitted = false;
          this.message.add({
            severity: 'error',
            summary: 'Aadhar Verify Error',
            detail: 'Invalid Aadhar, please check your Aadhar Number',
            life: 3000,
          });
          this.submitted = false;
        }
      })
      .catch((err) => {
        this.submitted = false;
        if (err.status === 0) {
          this.message.add({
            severity: 'error',
            summary: 'Aadhar Error',
            detail: 'Check Server Connection',
            life: 3000,
          });
        } else if (err.code === 404) {
          this.message.add({
            severity: 'error',
            summary: 'Aadhar Error',
            detail: 'Check Server Connection',
            life: 3000,
          });
        } else {
          this.message.add({
            severity: 'error',
            summary: 'Aadhar Error',
            detail: 'Please check your Aadhar Number',
            life: 3000,
          });
        }
        this.submitted = false;
      });
  }
}

