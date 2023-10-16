import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { BankingService } from '../banking.service';

@Component({
  selector: 'app-pay-to-vendor',
  templateUrl: './pay-to-vendor.component.html',
  styleUrls: ['./pay-to-vendor.component.scss']
})
export class PayToVendorComponent implements OnInit {

  sidebarVisibleB: boolean = false;

  enteredAmount: number | undefined;
  amount: any;

  allBeneficairy: any[] = [];

  FirstPage: boolean = true;
  ingredient!: string;
  selectedOption: string = 'on';

  selectedBeneficiary: string | undefined;


  impsForm !: FormGroup;
  QuickPayForm !: FormGroup;
  upiForm !: FormGroup;
  beneficairyForm !: FormGroup;

  allBeneficiary: any = [{
    "id": "1",
    "name": "Yuvraj"
  },
  {
    "id": "2",
    "name": "Gyana"
  }
  ];

  paymentTypes: any = [
    {
      "id": "1",
      "name": "NEFT"
    },
    {
      "id": "2",
      "name": "RTGS"
    },
    {
      "id": "3",
      "name": "IMPS"
    },
    {
      "id": "4",
      "name": "Quick Pay"
    },
    {
      "id": "5",
      "name": "UPI"
    }
  ];

  selectedType: string | undefined;

  stateOptions: any[] = [{ label: 'Saving', value: 'Saving' }, { label: 'Current', value: 'Current' }];

  value: string = 'Saving';

  constructor(private route: ActivatedRoute,
    private router: Router,
    private message: MessageService,
    private bankingS: BankingService) { }

  ngOnInit(): void {
    this.impsForm = new FormGroup({
      id: new FormControl(''),
      mmId: new FormControl('', [Validators.required]),
      mobileNumber: new FormControl('', Validators.required)
    });

    this.QuickPayForm = new FormGroup({
      id: new FormControl(''),
      bankName: new FormControl('', [Validators.required]),
      accountType: new FormControl('', Validators.required),
      accountNumber: new FormControl('', Validators.required),
      confirmAccountNumber: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
      ifsc: new FormControl('', Validators.required)
    });

    this.upiForm = new FormGroup({
      id: new FormControl(''),
      upiId: new FormControl('', [Validators.required])
    });

    this.beneficairyForm = new FormGroup({
      id: new FormControl(''),
      beneficairyName: new FormControl('', [Validators.required]),
      nickName: new FormControl('', [Validators.required]),
      accountNumber: new FormControl('', [Validators.required]),
      ifsc: new FormControl('', [Validators.required]),
      mobileNumber: new FormControl('', [Validators.required]),
      mmid: new FormControl('', [Validators.required])
    });

    this.amount = this.route.snapshot.paramMap.get('amount');

  }

  selectType(name: any) {
    // this.selectType = name;
    //alert(this.selectType);

    if (name === 'NEFT') {
      // loading all the available beneficairy 
      this.bankingS.getAllBeneficairy().then(
        (res : any ) => {
          console.log(res);
          this.allBeneficairy =  res.content;
        }
      ).catch(
        (err) => {
          console.log(err);
        }
      )
    }
  }

  handleToggle(event: any) {
    if (event.value === 'on') {
      // Handle the "On" state
      console.log('Toggled On');
      // Call any specific function for the "On" state
    } else {
      // Handle the "Off" state
      console.log('Toggled Off');
      // Call any specific function for the "Off" state
    }
  }

  amountEntered() {
    // this.FirstPage =  false;
    if (this.enteredAmount != null || this.enteredAmount != undefined) {
      this.router.navigate(['banking/payToVendor/amount/' + this.enteredAmount]);
    }
    else {
      this.message.add({
        severity: 'error',
        summary: 'Paymentn Error',
        detail: 'Pleae Enter the Amount',
        life: 3000,
      });
    }

  }

  selectBeneficiary(beneficiary: any) {
    //alert(beneficiary.name);
  }

  sendOTP() {

  }

  OnCancelOTP() {

  }

  onSubmitIMPS() {

  }

  onSubmitQuickPay() {

  }

  onSubmitUPI() {

  }

  onSubmitBeneficairy() {
    alert(JSON.stringify( this.beneficairyForm.value  ));
 
    this.bankingS.createBeneficiary(this.beneficairyForm.value).then(
      (res) => {
        console.log(res);
        this.beneficairyForm.patchValue = { ...res };
        //this.currbeneficiary = res;
      
        this.message.add({
          severity: 'success',
          summary: 'Beneficiary Added',
          detail: 'Beneficiary Details Saved Successfully',
          life: 3000,
        });
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

  formatNumber(event: any) {
    const value = event.target.value;
    if (value) {
      // Remove any existing commas and parse the value as a number
      const numericValue = parseFloat(value.replace(/,/g, ''));

      // Format the numeric value with commas for thousands, lakhs, etc.
      const formattedValue = numericValue.toLocaleString('en-IN'); // Use your desired locale

      // Update the input field with the formatted value
      event.target.value = formattedValue;
    }
    this.enteredAmount = event.target.value;
  }
}
