import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { BankingService } from '../banking.service';
import { Beneficiary } from 'src/app/profile/profile-models';
import { PayModelsPI, PayModelsSI } from '../banking-model';
import { PurchaseInvoice } from 'src/app/collect/collect-models';

@Component({
  selector: 'app-pay-to-vendor',
  templateUrl: './pay-to-vendor.component.html',
  styleUrls: ['./pay-to-vendor.component.scss']
})
export class PayToVendorComponent implements OnInit {

  sidebarVisibleB: boolean = false;
  submitted : boolean = false;

  enteredAmount: number | undefined;
  id: any;
  amount : any;

  allBeneficairy: any[] = [];

  payPI: PayModelsPI = {};
  paySI: PayModelsSI = {};

  currentPurchaseInvoice :  PurchaseInvoice = {};

  FirstPage: boolean = true;
  ingredient!: string;
  selectedOption: string = 'on';

  selectedBeneficiary: Beneficiary = {};


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

    this.id = this.route.snapshot.paramMap.get('id');
    this.amount = this.route.snapshot.paramMap.get('amount');
    //alert(this.id + '  '+this.amount);

    this.getPI( this.id ); 
  }

  getPI( id : any)
  {
    if( id )
    {
      this.submitted = true;
      this.bankingS.getPI(id).then(
        (res) => {
          console.log(res);
          this.submitted = false;
          this.currentPurchaseInvoice = res;
        }
      ).catch(
        (err) => {
          this.submitted = false;
          console.log(err);
        }
      )
    }
    else{
      this.message.add({
        severity: 'error',
        summary: 'Purchase Invoice Not Persent',
        detail: 'Purchase Invoice Not Persent',
        life: 3000,
      });
    }
    
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
      this.router.navigate(['banking/payToVendor/pi/' + this.id+'/amount/'+this.enteredAmount]);
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

  selectBeneficiaryM(beneficiary: any) {
   
    this.selectedBeneficiary= beneficiary ;
    //alert(this.selectedBeneficiary.beneficaryName);
  }

  sendOTP() {

  }

  sendOTPBeneficairy()
  {
    // alert(this.id); // confirmed
    // alert(this.amount) ; // confirmed
    // alert( this.selectedType ); // confirmed 
    // alert( JSON.stringify(this.selectedBeneficiary) ) ; // confirmed


        this.payPI.amount = this.amount;
        this.payPI.invoiceId = this.id;
        this.payPI.vendorId = this.currentPurchaseInvoice.vendor?.id  ;
        this.payPI.paymentType = this.selectedType;
        
        this.payPI.beneficiary =  this.selectedBeneficiary ;
        this.payPI.accountDetails = null ;

        alert(JSON.stringify(this.payPI));

        this.bankingS.makePaymentPI(this.payPI).then(
          (res) => {
            console.log(res);
           // this.router.navigate(['/collect/purchaseInvoices']);

            this.message.add({
              severity: 'success',
              summary: 'payment Done',
              detail: 'Payment Done Successfully',
              life: 3000,
            });
          }
        ).catch(
          (err) => {
            console.log(err);
            this.message.add({
              severity: 'error',
              summary: err.error.error,
              detail: err.error.error,
              life: 3000,
            });
          }
        )

  }

  OnCancelOTP() {

  }

  onSubmitIMPS() {

  }

  onSubmitQuickPay() {

    alert( JSON.stringify(this.QuickPayForm.value ) );
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
