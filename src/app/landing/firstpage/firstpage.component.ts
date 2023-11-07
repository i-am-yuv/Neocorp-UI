import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AuthService } from 'src/app/auth/auth.service';
import { PayPageService } from 'src/app/pay/pay-page.service';

@Component({
  selector: 'app-firstpage',
  templateUrl: './firstpage.component.html',
  styleUrls: ['./firstpage.component.scss']
})
export class FirstpageComponent implements OnInit {



  // stateOptions: any[] = [{label: 'Debit Account', value: 'Debit Account'}, {label: 'Credit Account', value: 'Credit Account'}];

  value: string = 'Debit Account';


  formGroup!: FormGroup;

  stateOptions: any[] = [
    { label: 'Debit Account', value: 'Debit Account' },
    { label: 'Credit Account', value: 'Credit Account' }
  ];



  isSidebarVisible: boolean = true;

  sidebarVisible2: boolean = false;

  sidebarVisible: boolean = false;

  sidebarVisible3: boolean = false;

  newAccountForm !: FormGroup;

  newAccountForm1 !: FormGroup;

  submitted: boolean = false;

  accountType: any = [
    {
      "id": "1",
      "name": "Current"
    },
    {
      "id": "2",
      "name": "Saving"
    }
  ];

  constructor(private router: Router,
    private route: ActivatedRoute,
    private message: MessageService,
    private fb: FormBuilder,
    private usedService: PayPageService,
    private confirmationService: ConfirmationService,
    private authS: AuthService
  ) { }

  ngOnInit(): void {

    this.initForm();


    this.formGroup = new FormGroup({
      value: new FormControl('Credit Account')
    });

    this.loadUser();
  }

  onSubmitAccount() {
    // For Credit Account
    this.newAccountForm.value.user.id = this.currentUser.id;

    alert(JSON.stringify(this.newAccountForm.value));
    if (this.newAccountForm.value.accountNumber !== this.newAccountForm.value.confirmAccountNumber) {
      this.message.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Account Number Mismatch Error',
        life: 3000,
      });
    }
    else {

      this.submitted = true;
      this.usedService.saveAccount(this.newAccountForm.value).then(
        (res: any) => {
          console.log(res);
          this.submitted = false;
          this.message.add({
            severity: 'success',
            summary: 'Sucess',
            detail: 'Credit Account Added Successfully',
            life: 3000,
          });
        }
      ).catch(
        (err) => {
          console.log(err);
          this.submitted = false;
          this.message.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Account Addition Error',
            life: 3000,
          });
        }
      )
      
    }
  }


  onSubmitAccount1() {
    // For Debit Account
    this.newAccountForm1.value.user.id = this.currentUser.id;

    alert(JSON.stringify(this.newAccountForm1.value));
    if (this.newAccountForm1.value.accountNumber !== this.newAccountForm1.value.confirmAccountNumber) {
      this.message.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Account Number Mismatch Error',
        life: 3000,
      });
    }
    else {

      this.submitted = true;
      this.usedService.saveDebitAccount(this.newAccountForm1.value).then(
        (res: any) => {
          console.log(res);
          this.submitted = false;
          this.message.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Your Debit Account Added Successfully',
            life: 3000,
          });
        }
      ).catch(
        (err) => {
          console.log(err);
          this.submitted = false;
          this.message.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Debit Account Addition Error',
            life: 3000,
          });
        }
      )

    }
  }

  initForm() {
    this.newAccountForm = new FormGroup({
      id: new FormControl(''),
      accountNumber: new FormControl('', Validators.required),
      confirmAccountNumber: new FormControl('', Validators.required),
      ifsc: new FormControl('', Validators.required),
      bankname: new FormControl('', Validators.required),
      accountType: new FormControl('', Validators.required),
      user: this.fb.group({
        id: this.fb.nonNullable.control('')
      })
    });


    this.newAccountForm1 = new FormGroup({
      id: new FormControl(''),
      accountNumber: new FormControl('', Validators.required),
      confirmAccountNumber: new FormControl('', Validators.required),
      ifsc: new FormControl('', Validators.required),
      bankname: new FormControl('', Validators.required),
      accountType: new FormControl('', Validators.required),
      user: this.fb.group({
        id: this.fb.nonNullable.control('')
      })
    });

  }

  refreshAll() {
    // this.allPurchaseOrders  = [] ; // customer only have Purchase Orders
    // this.allPurchaseInvoices = [];
    this.showDebit = true;
    this.showCredit = false;
  }
  showDebit: boolean = true;
  showCredit: boolean = false;

  showDebitPage() {
    this.showDebit = true;
    this.showCredit = false;
  }

  showCreditPage() {
    this.showCredit = true;
    this.showDebit = false;
  }

  currentCompany: any = {};
  currentUser: any = {};
  loadUser() {
    this.submitted = true;
    this.authS.getUser().then((res: any) => {
      this.currentCompany = res.comapny;
      this.currentUser = res;
      this.submitted = false;
    }).catch((err) => {
      console.log(err);
      this.submitted = false;
    });
  }

}
