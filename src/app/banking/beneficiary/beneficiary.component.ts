import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Beneficiary } from 'src/app/profile/profile-models';
import { ProfilepageService } from 'src/app/profile/profilepage.service';
import { BankingService } from '../banking.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-beneficiary',
  templateUrl: './beneficiary.component.html',
  styleUrls: ['./beneficiary.component.scss']
})
export class BeneficiaryComponent implements OnInit {

  beneficiaryForm !: FormGroup ;
  submitted : boolean =  false;

  currbeneficiary : Beneficiary = {};

  id: string | null = '';

  items!: MenuItem[];

  constructor(private router: Router,
    private route: ActivatedRoute,
    private message: MessageService,
    private fb: FormBuilder,
    private bankingS: BankingService,
    private confirmationService: ConfirmationService ,
    private authS : AuthService) { }

  ngOnInit(): void {
    this.loadUser();
  }

  loadOtherInfo()
  {
    this.id = this.route.snapshot.paramMap.get('id');

    this.items = [{label: 'Banking'}, {label: 'Beneficiary', routerLink: ['/banking/beneficiaries']}, {label: 'Create'}];

    this.initForm();
    this.getCurrbeneficiary();
  }

  initForm()
  {

    this.id = this.route.snapshot.paramMap.get('id');

    this.beneficiaryForm = new FormGroup({
      id: new FormControl(''),
      beneficaryName: new FormControl('', Validators.required),
      nickname: new FormControl('', Validators.required),
      accountNumber: new FormControl('', Validators.required),
      ifscCode : new FormControl('', Validators.required) ,
      mobileNumber : new FormControl('', Validators.required) ,
      mmid: new FormControl('')
    });

  }
  onSubmitBeneficiary()
  {
    console.log(this.beneficiaryForm.value) ;
   
    var beneficiaryFormVal = this.beneficiaryForm.value;
    beneficiaryFormVal.id = this.id;

    console.log(beneficiaryFormVal) ;

    if (beneficiaryFormVal.id) {

      this.submitted = true;
      // No chnage in these 3 values
      beneficiaryFormVal.inCoolingPeriod = this.currbeneficiary.inCoolingPeriod ;
      beneficiaryFormVal.signupTime =  this.currbeneficiary.signupTime ;
      beneficiaryFormVal.coolingPeriodEnd =  this.currbeneficiary.coolingPeriodEnd ;

      this.bankingS.updateBeneficiary(beneficiaryFormVal).then(
        (res) => {
          console.log(res);
          this.beneficiaryForm.patchValue = { ...res };
          this.submitted = false;
          this.message.add({
            severity: 'success',
            summary: 'Beneficiary Details Updated',
            detail: 'Beneficiary Details updated Successfully',
            life: 3000,
          });
          setTimeout(() => {
            this.router.navigate(['banking/beneficiaries']);
          }, 2000);
          
        }
      ).catch(
        (err) => {
          console.log(err);
          this.submitted = false;
          this.message.add({
            severity: 'error',
            summary: 'Beneficiary Details updated Error',
            detail: 'Beneficiary Details Error',
            life: 3000,
          });
        }
      )
    }
    else {
      
      beneficiaryFormVal.signupTime = new Date();
      beneficiaryFormVal.inCoolingPeriod =  true;
      beneficiaryFormVal.user = this.currentUser ;
      this.submitted = true;
      this.bankingS.createBeneficiary(beneficiaryFormVal).then(
        (res) => {
          console.log(res);
          this.beneficiaryForm.patchValue = { ...res };
          this.currbeneficiary = res;
          this.submitted = false;
          this.message.add({
            severity: 'success',
            summary: 'Beneficiary Added',
            detail: 'Beneficiary Details Saved Successfully',
            life: 3000,
          });
          this.router.navigate(['banking/beneficiaries']);
        }
      ).catch(
        (err) => {
          console.log(err);
          this.submitted = false;
          this.message.add({
            severity: 'error',
            summary: 'Beneficiary error',
            detail: 'Beneficiary Error while creating',
            life: 3000,
          });
        })
    }
  }

  getCurrbeneficiary()
  {
    if (this.id) {
      this.submitted = true;
      this.bankingS.getCurrBeneficiary(this.id).then(
        (res: any) => {
          console.log(res);
          this.currbeneficiary = res;
          this.beneficiaryForm.patchValue(res);
          this.submitted = false;
        }
      ).catch(
        (err) => {
          console.log(err);
          this.submitted = false;
        }
      )
    }
  }

  onClickCancel()
  {
    this.router.navigate(['banking/beneficiaries']);
  }

  currentCompany : any = {} ;
  currentUser : any = {} ;
  loadUser() {
    this.submitted = true;
    this.authS.getUser().then((res: any) => {
      this.currentCompany = res.comapny;
      this.currentUser  = res ;
      this.submitted = false;

      this.loadOtherInfo();
    })
      .catch((err) => {
        console.log(err);
        this.submitted = false;
      });
  }

}
