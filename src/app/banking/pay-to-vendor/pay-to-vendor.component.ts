import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, MenuItem } from 'primeng/api';
import { BankingService, } from '../banking.service';
import { Beneficiary } from 'src/app/profile/profile-models';
import { DebitAccountDetails, PayModelsSI, PaymentRequest } from '../banking-model';
import { PurchaseInvoice } from 'src/app/collect/collect-models';
import { PayPageService } from 'src/app/pay/pay-page.service';
import { AuthService } from 'src/app/auth/auth.service';
import { BreadCrumbService } from 'src/app/shared/navbar/bread-crumb.service';

@Component({
  selector: 'app-pay-to-vendor',
  templateUrl: './pay-to-vendor.component.html',
  styleUrls: ['./pay-to-vendor.component.scss']
})
export class PayToVendorComponent implements OnInit {

  sidebarVisibleB: boolean = false;
  accounntSelected: boolean = false;

  partialPaymentStatus: boolean = true;

  submitted: boolean = false;

  enteredAmount: number = 0.00;
  amountRemaining: number = 0.00;
  id: any;
  amount: any;

  allBeneficairy: any[] = [];
  allDebitAccount: any[] = [];

  paymentRequest: PaymentRequest = {};
  paySI: PayModelsSI = {};

  currentPurchaseInvoice: PurchaseInvoice = {};

  FirstPage: boolean = true;
  ingredient!: string;
  selectedOption: string = 'on';

  selectedBeneficiary: Beneficiary = {};
  selectedDebitAccount: DebitAccountDetails = {};


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
      "name": "Quick Pay"
    },
    {
      "id": "2",
      "name": "Normal Pay"
    }
  ];

  paymentMethodsQuick: any = [
    {
      "id": "1",
      "name": "IMPS"
    },
    {
      "id": "2",
      "name": "UPI"
    }
  ];

  paymentMethodsNormal: any = [
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
      "name": "Fund Transfer"
    }
  ];

  selectedType: string | undefined;
  selectedTypeMethod: string | undefined;

  stateOptions: any[] = [{ label: 'Saving', value: 'Saving' }, { label: 'Current', value: 'Current' }];

  value: string = 'Saving';

  displayCoolingPDialog: boolean = false;
  inCoolingPeriod : boolean =  false;

  // currentTime = this.getLocalDateTime();
  currentTime = new Date();

  items!: MenuItem[];
  items2!: MenuItem[];

  constructor(private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private message: MessageService,
    private bankingS: BankingService,
    private payS: PayPageService,
    private authS: AuthService, private breadcrumbS: BreadCrumbService) { }

  ngOnInit(): void {
    this.breadcrumbS.breadCrumb([{ label: 'Banking' }]);
    this.id = this.route.snapshot.paramMap.get('id');
    this.amount = this.route.snapshot.paramMap.get('amount');
    this.initForm();
     this.loadUser() ;
  }

  loadOtherInfo()
  {
    this.getPI(this.id);
    this.getAllDebitAccount();
  }

  initForm()
  {
    this.impsForm = new FormGroup({
      id: new FormControl(''),
      mmid: new FormControl('', [Validators.required]),
      mobileNumber: new FormControl('', Validators.required)
    });

    this.QuickPayForm = new FormGroup({
      id: new FormControl(''),
      bankname: new FormControl('', [Validators.required]),
      AccountType: new FormControl('', Validators.required),
      AccountNumber: new FormControl('', Validators.required),
      confirmAccountNumber: new FormControl('', Validators.required),
      IFSC: new FormControl('', Validators.required)
    });

    this.upiForm = new FormGroup({
      id: new FormControl(''),
      upiId: new FormControl('', [Validators.required, Validators.minLength(10)])
    });


    this.beneficairyForm = new FormGroup({
      id: new FormControl(''),
      beneficaryName: new FormControl('', [Validators.required]),
      nickname: new FormControl('', [Validators.required]),
      accountNumber: new FormControl('', [Validators.required]),
      ifscCode: new FormControl('', [Validators.required]),
      mobileNumber: new FormControl('', [Validators.required]),
      mmid: new FormControl('', [Validators.required]),
    });
  }

  getAllDebitAccount() {
    this.submitted = true;
    this.bankingS.getAllDebitAccount(this.currentUser).then(
      (res) => {
        console.log(res);
        this.allDebitAccount = res;
        this.submitted = false;
      }
    ).catch(
      (err) => {
        this.submitted = false;
        console.log(err);
        this.message.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error while fetching Debit Account Details',
          life: 3000,
        });
      }
    )
  }

  getPI(id: any) {
    if (id) {
      this.submitted = true;
      this.bankingS.getPI(id).then(
        (res) => {
          console.log(res);
          this.partialPaymentStatus = res.enablePartialPayments;
          this.currentPurchaseInvoice = res;

          this.enteredAmount = res.remainingAmount ;          
          this.amountRemaining = res.remainingAmount ;
          // this.payS.getRemainingAmountByPurchaseInvoice(this.currentPurchaseInvoice).then(
          //   (res) => {
          //     this.enteredAmount = res;
          //     this.amountRemaining = res;
          //     this.submitted = false;
          //   }
          // ).catch(
          //   (err) => {
          //     console.log(err);
          //     this.submitted = false;
          //   }
          // )
          this.submitted = false;
        }
      ).catch(
        (err) => {
          this.submitted = false;
          console.log(err);
        }
      )
    }
    else {
      this.message.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Purchase Invoice Not Persent',
        life: 3000,
      });
    }

  }

  // Select Payment Type
  selectType(name: any) {

    // alert(name);
    this.selectedTypeMethod = undefined;
    this.selectedBeneficiary = {};
  }

  selectTypeMethod(name: any) {
    // alert(name);
    this.selectedBeneficiary = {}; // Need to select again
    if (name === 'NEFT') {
      // loading all the available beneficairy 
      this.submitted = true;
      this.bankingS.getAllBeneficairy(this.currentUser).then(
        (res: any) => {
          console.log(res);
          this.allBeneficairy = res.filter((beneficairy: Beneficiary) => beneficairy.beneficaryName !== null);
          this.submitted = false;
        }
      ).catch(
        (err) => {
          console.log(err);
          this.submitted = false;
        }
      )
    }
    else if (name === 'RTGS') {
      // loading all the available beneficairy 
      this.submitted = true;
      this.bankingS.getAllBeneficairy(this.currentUser).then(
        (res: any) => {
          console.log(res);
          
          this.allBeneficairy = res.filter((beneficairy: Beneficiary) => beneficairy.beneficaryName !== null);;
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

  selectYourDebitAccount(debitAccount: any) {

    this.selectedDebitAccount = debitAccount;
    this.selectedType = undefined;
    this.selectedTypeMethod = undefined;
    // alert(JSON.stringify(this.selectedDebitAccount));
  }

  amountEntered() {
    // this.FirstPage =  false;
    if (this.enteredAmount != null || this.enteredAmount != undefined) {
      this.router.navigate(['banking/payToVendor/pi/' + this.id + '/amount/' + this.enteredAmount]);
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

  selectBeneficiaryM(beneficiary: Beneficiary) {


    //alert(this.selectedBeneficiary.beneficaryName);

    if (beneficiary.inCoolingPeriod) {
      this.displayCoolingPDialog = true;
      this.inCoolingPeriod =  true;
      // alert(this.displayCoolingPDialog );
    } else {
      this.displayCoolingPDialog = false;
      this.inCoolingPeriod =  false;
      this.selectedBeneficiary = beneficiary;
    }

  }

  selectDebitAccountM(debitAccount: any) {
    this.selectedDebitAccount = debitAccount;
  }

  sendOTP() {

  }

  sendOTPNEFT() {
    this.paymentRequest.amount = this.amount;
    // this.paymentRequest.paymentType = this.selectedType;
    this.paymentRequest.paymentType = "NORMALPAY";
    this.paymentRequest.paymentMethod = this.selectedTypeMethod;
    this.paymentRequest.beneficiary = this.selectedBeneficiary;
    this.paymentRequest.debitAccountDetails = this.selectedDebitAccount;

    // alert(this.id + ' ' + this.currentPurchaseInvoice.vendor?.id);
    // alert(JSON.stringify(this.paymentRequest));
    this.makePayment(this.paymentRequest);

  }

  sendOTPRTGS() {

    this.paymentRequest.amount = this.amount;
    //this.paymentRequest.paymentType = this.selectedType;
    this.paymentRequest.paymentType = "NORMALPAY";
    this.paymentRequest.paymentMethod = this.selectedTypeMethod;
    this.paymentRequest.beneficiary = this.selectedBeneficiary;
    this.paymentRequest.debitAccountDetails = this.selectedDebitAccount;

    this.makePayment(this.paymentRequest);

  }


  sendOTPIMPS() {
    // First Need to create the Beneficairy with MMID and mobile Number
    var BaneData = this.impsForm.value;
    BaneData.inCoolingPeriod = true;
    //BaneData.signupTime =  new Date();
    this.submitted = true;
    this.bankingS.createBeneficiary(BaneData).then(
      (res: any) => {
        console.log(res);
        //alert("created");
        this.paymentRequest.amount = this.amount;
        //this.paymentRequest.paymentType = this.selectedType;
        this.paymentRequest.paymentType = "QUICKPAY";
        this.paymentRequest.paymentMethod = this.selectedTypeMethod;
        this.paymentRequest.beneficiary = res;
        this.paymentRequest.debitAccountDetails = this.selectedDebitAccount;

        this.makePayment(this.paymentRequest);
      }
    ).catch(
      (err) => {
        console.log(err);
        this.submitted = false;
        this.message.add({
          severity: 'error',
          summary: 'Beneficairy Creation Error',
          detail: 'Error While Creating the Beneficairy for IMPS',
          life: 3000,
        });
      }
    )
  }

  // sendOTPQuickPay() {
  //   // first we will create the debit account
  //   alert(this.QuickPayForm.value);
  //   this.submitted = true;
  //   this.bankingS.createDebitAccount(this.QuickPayForm.value).then(
  //     (res: any) => {
  //       console.log(res);
  //       this.paymentRequest.amount = this.amount;
  //       this.paymentRequest.paymentType = this.selectedType;
  //       this.paymentRequest.beneficiary = null;
  //       this.paymentRequest.debitAccountDetails = res;

  //       this.makePayment(this.paymentRequest);

  //     }
  //   ).catch(
  //     (err) => {
  //       console.log(err);
  //       this.submitted = false;
  //       this.message.add({
  //         severity: 'error',
  //         summary: 'Beneficairy Creation Error',
  //         detail: 'Error While Creating the Beneficairy for IMPS',
  //         life: 3000,
  //       });
  //     }
  //   )
  // }

  sendOTPUPI() {
    this.paymentRequest.amount = this.amount;
    // this.paymentRequest.paymentType = this.selectedType;
    this.paymentRequest.paymentType = "QUICKPAY";
    this.paymentRequest.paymentMethod = this.selectedTypeMethod;
    this.paymentRequest.beneficiary = null;
    this.paymentRequest.debitAccountDetails = this.selectedDebitAccount;
    this.paymentRequest.upiId = this.upiForm.value.upiId;

    // alert(JSON.stringify(this.paymentRequest));

    this.makePayment(this.paymentRequest);
  }

  makePayment(payPI: any) {
    this.submitted = true;
    var vendorId = this.currentPurchaseInvoice.vendor?.id;
    if (this.id == null || vendorId == null || vendorId == undefined || vendorId == ""
      || this.id == undefined || this.id == "" || this.amount == "" || this.amount == null) {

      this.message.add({
        severity: 'error',
        summary: 'Data Missing',
        detail: 'Some data is missing for doing payment',
        life: 3000,
      });
    }
    else {
      alert(JSON.stringify( this.paymentRequest) ) ;
      this.bankingS.makePayment(this.id, vendorId, this.paymentRequest).then(
        (res) => {
          console.log(res);
          this.submitted = false;
          this.message.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Payment Done successfully',
            life: 3000,
          });
          setTimeout(() => {
            this.router.navigate(['/collect/purchaseInvoices']);
          }, 2000);
        }
      ).catch(
        (err) => {
          console.log(err);
          this.submitted = false;
          if( err.status == 200 )
          {
            this.message.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Payment Done successfully',
              life: 3000,
            });
            setTimeout(() => {
              this.router.navigate(['/collect/purchaseInvoices']);
            }, 2000);
          }
          else{
            this.message.add({
              severity: 'error',
              summary: 'Error',
              detail: err.error.message,
              life: 3000,
            });
          }
          
          
        }
      )

    }

  }

  OnCancelOTP() {
    setTimeout(() => {
      this.router.navigate(['/banking/payToVendor/pi/' + this.id]);
    }, 2000);

  }

  onSubmitIMPS() {

  }

  onSubmitQuickPay() {

    // alert(JSON.stringify(this.QuickPayForm.value));
  }

  onSubmitUPI() {

  }


  onSubmitBeneficairy() {
    var BeneData = this.beneficairyForm.value;
    BeneData.signupTime = new Date();
    BeneData.inCoolingPeriod = true;

    var BeneData = this.beneficairyForm.value;
    BeneData.signupTime = new Date();
    BeneData.inCoolingPeriod = true;

    this.submitted = true;
    this.bankingS.createBeneficiary(BeneData).then(
      (res) => {
        console.log(res);
        // this.beneficairyForm.patchValue = { ...res };
        //this.currbeneficiary = res;
        this.submitted = false;
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
        this.submitted = false;
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

  onClose() {
    this.router.navigate(['/collect/purchaseInvoices']);
  }


  currentCompany: any = {};
  currentUser: any = {};
  loadUser() {
    this.submitted = true;
    this.authS.getUser().then((res: any) => {
      this.currentCompany = res.comapny;
      this.currentUser = res;
      this.submitted = false;

      this.loadOtherInfo();
    })
      .catch((err) => {
        console.log(err);
        this.submitted = false;
      });
  }

}
