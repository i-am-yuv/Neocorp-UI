import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ProfilepageService } from '../profilepage.service';
import { PayPageService } from 'src/app/pay/pay-page.service';
import { Beneficiary } from '../profile-models';

@Component({
  selector: 'app-beneficiary',
  templateUrl: './beneficiary.component.html',
  styleUrls: ['./beneficiary.component.scss']
})
export class BeneficiaryComponent implements OnInit {


  beneficiaryForm !: FormGroup ;

  currbeneficiary : Beneficiary = {};

  id: string | null = '';

  constructor(private router: Router,
    private route: ActivatedRoute,
    private message: MessageService,
    private fb: FormBuilder,
    private profileS: ProfilepageService,
    private confirmationService: ConfirmationService) { }

  ngOnInit(): void {

    this.id = this.route.snapshot.paramMap.get('id');

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
      mmid: new FormControl('', Validators.required)
    });

  }
  onSubmitBeneficiary()
  {
    console.log(this.beneficiaryForm.value) ;
   
    var beneficiaryFormVal = this.beneficiaryForm.value;
    beneficiaryFormVal.id = this.id;

    console.log(beneficiaryFormVal) ;

    if (beneficiaryFormVal.id) {
      //this.poForm.value.id = poFormVal.id;

      this.profileS.updateBeneficiary(beneficiaryFormVal).then(
        (res) => {
          console.log(res);
          this.beneficiaryForm.patchValue = { ...res };
          this.message.add({
            severity: 'success',
            summary: 'Beneficiary Details Updated',
            detail: 'Beneficiary Details updated Successfully',
            life: 3000,
          });
        }
      ).catch(
        (err) => {
          console.log(err);
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
      
      this.profileS.createBeneficiary(beneficiaryFormVal).then(
        (res) => {
          console.log(res);
          this.beneficiaryForm.patchValue = { ...res };
          this.currbeneficiary = res;
        
          this.message.add({
            severity: 'success',
            summary: 'Beneficiary Added',
            detail: 'Beneficiary Details Saved Successfully',
            life: 3000,
          });
          this.router.navigate(['profile/beneficiary/edit/' + res.id]);
        }
      ).catch(
        (err) => {
          console.log(err);
         
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
      this.profileS.getCurrBeneficiary(this.id).then(
        (res: any) => {
          console.log(res);
          this.currbeneficiary = res;
          this.beneficiaryForm.patchValue(res);
        }
      ).catch(
        (err) => {
          console.log(err);
        }
      )
    }
  }

}
