import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { AuthService } from 'src/app/auth/auth.service';
import { PayPageService } from 'src/app/pay/pay-page.service';
import { BreadCrumbService } from 'src/app/shared/navbar/bread-crumb.service';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss']
})
export class AccountsComponent implements OnInit {

  id: string | null = '';
  submitted: boolean = false;
  allCreditAccounts: any[] = [];
  allDebitAccounts: any[] = [];

  stateOptions: any[] = [{ label: 'Credit Accounts', value: 'credit' }, { label: 'Debit Accounts', value: 'debit' }];
  value: string = 'credit';

  activeCreditAccount: any = {};
  activeDebitAccount: any = {};
  totalCARecords: number = 0;
  totalDARecords: number = 0;

  deleteDialLogvisible: boolean = false;

  items1: MenuItem[] = [];
  items2: MenuItem[] = [];

  formGroup!: FormGroup;
  creditAccountForm !: FormGroup;
  debitAccountForm!: FormGroup;

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

  currentCreditAccount: any = {};
  currentDebitAccount: any = {};

  constructor(private payS: PayPageService,
    private authS : AuthService, private router: Router, private message: MessageService, private breadcrumS: BreadCrumbService) { }

  ngOnInit(): void {
    this.breadcrumS.breadCrumb([{ label: 'Accounts' }]);

    this.initForm();
    this.loadUser();
   
  }

  loadOtherDetails()
  {
    this.getCreditAccounts();
    this.getDebitAccounts();
    // this.getCreditAccountId();
  }

   currentCompany: any = {};
  currentUser: any = {};
  loadUser() {
    this.submitted = true;
    this.authS.getUser().then((res: any) => {
      this.currentCompany = res.comapny;
      this.currentUser = res;
      this.submitted = false;
      this.loadOtherDetails();
    })
      .catch((err) => {
        console.log(err);
        this.submitted = false;
      })
  }

  initForm() {
    this.creditAccountForm = new FormGroup({
      id: new FormControl(''),
      accountNumber: new FormControl('', Validators.required),
      confirmAccountNumber: new FormControl('', Validators.required),
      ifsc: new FormControl('', Validators.required),
      bankname: new FormControl('', Validators.required),
      accountType: new FormControl('', Validators.required)
    });

    this.debitAccountForm = new FormGroup({
      id: new FormControl(''),
      accountNumber: new FormControl('', Validators.required),
      confirmAccountNumber: new FormControl('', Validators.required),
      ifsc: new FormControl('', Validators.required),
      bankname: new FormControl('', Validators.required),
      accountType: new FormControl('', Validators.required)
    });
  }

  getCreditAccounts() {
    this.submitted = true;
    this.payS.getAllCreditAccount(this.currentUser).then((res: any) => {
      this.allCreditAccounts = res;

      if (this.allCreditAccounts.length > 0) {
        this.changeCreditAccount(this.allCreditAccounts[0]);
      } else {
        this.activeCreditAccount = {};
      }

      this.totalCARecords = res.totalElements;
      this.submitted = false;
    })
  }

  getDebitAccounts() {
    this.submitted = true;
    this.payS.getAllDebitAccount(this.currentUser).then((res: any) => {
      this.allDebitAccounts = res;

      if (this.allDebitAccounts.length > 0) {
        this.changeDebitAccount(this.allDebitAccounts[0]);
      } else {
        this.activeDebitAccount = {};
      }

      this.totalDARecords = res.totalElements;
      this.submitted = false;
    })
  }

  changeCreditAccount(creditAccount: any) {
    this.activeCreditAccount = creditAccount;
    this.getCreditAccountId();
  }

  changeDebitAccount(debitAccount: any) {
    this.activeDebitAccount = debitAccount;
    this.getDebitAccountById();
  }

  onEditCreditAccount(id: string) {
    this.router.navigate(['/banking/accounts/edit/' + id]);
  }

  onEditDebitAccount(id: string) {
    // this.router.navigate(['']);
  }

  // onDeleteCurrentAccount(creditAccount: any) { }

  openAccountSlideBar : boolean =  false; 

  addAccount() { 
    this.openAccountSlideBar = !this.openAccountSlideBar;
  }

  getCreditAccountId() {
    this.submitted = true;
    this.payS.getCreditAccountById(this.activeCreditAccount.id).then(
      (creditAccount: any) => {
        this.currentCreditAccount = creditAccount;
        this.creditAccountForm.patchValue(creditAccount);
        //alert( JSON.stringify(this.creditAccountForm.value) );
        this.submitted = false;
      })
      .catch((err) => {
        console.log(err);
        this.submitted = false;
      })
  }

  getDebitAccountById() {
    this.submitted = true;
    this.payS.getDebitAccountById(this.activeDebitAccount.id).then((debitAccount: any) => {
      this.currentDebitAccount = debitAccount;
      this.debitAccountForm.patchValue(debitAccount);
      this.submitted = false;
    })
      .catch((err) => {
        console.log(err);
        this.submitted = false;
      })
  }

  updateCreditAccount() {
    var creditAccountFormVal = this.creditAccountForm.value;
  //alert(JSON.stringify(this.creditAccountForm.value));
    this.submitted = true;
    if (this.creditAccountForm.value.accountNumber !== this.creditAccountForm.value.confirmAccountNumber) {
      this.submitted = false;
      this.message.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Account Number Mismatch Error',
        life: 3000,
      });
    }
    else{
      this.payS.updateCreditAccount(creditAccountFormVal).then((res: any) => {
        this.creditAccountForm.patchValue = { ...res };
        this.submitted = false;
        this.message.add({
          severity: 'success',
          summary: 'Credit Account Updated',
          detail: 'Credit Account Updated',
          life: 3000,
        });
        this.ngOnInit();
      })
        .catch((err) => {
          console.log(err);
          this.submitted = false;
        })
    }
    
  }

  updateDebitAccount() {
    var debitAccountFormVal = this.debitAccountForm.value;

    this.submitted = true;
    if (this.debitAccountForm.value.accountNumber !== this.debitAccountForm.value.confirmAccountNumber) {
      this.submitted = false;
      this.message.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Account Number Mismatch Error',
        life: 3000,
      });
    }
    else{
      this.payS.updateDebitAccount(debitAccountFormVal).then((res: any) => {
        this.debitAccountForm.patchValue = { ...res };
        this.submitted = false;
        this.message.add({
          severity: 'success',
          summary: 'Debit Account Updated',
          detail: 'Debit Account Updated',
          life: 3000,
        });
      })
        .catch((err) => {
          console.log(err);
          this.submitted = false;
        })

    }
    

  }

  deleteAccount() {
    this.deleteDialLogvisible = true;
  }

  cancelDelete() {
    this.deleteDialLogvisible = false;
  }

  deleteConfirmCA() {
    this.submitted = true;
    this.payS.deleteCreditAccount(this.activeCreditAccount.id).then((data: any) => {
      this.allCreditAccounts = this.allCreditAccounts.filter(
        (val) => val.id !== this.activeCreditAccount.id
      );
      this.deleteDialLogvisible = false;
      this.activeCreditAccount ={};
     
      this.creditAccountForm.reset();
      this.submitted = false;
      this.message.add({
        severity: 'success',
        summary: 'Credit Account Deleted',
        detail: 'Credit Account Deleted',
        life: 3000,
      })
    })
      .catch((err) => {
        console.log(err);
        this.submitted = false;
        this.message.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error.message,
          life: 3000,
        })
      })
  }

  deleteConfirmDA() {
    this.submitted = true;
    this.payS.deleteDebitAccount(this.activeDebitAccount.id).then((data: any) => {
      this.allDebitAccounts = this.allDebitAccounts.filter(
        (val) => val.id !== this.activeDebitAccount.id
      );
      this.debitAccountForm.reset();
     // this.activeDebitAccount = {} ;
      this.deleteDialLogvisible = false;
      this.submitted = false;
      this.message.add({
        severity: 'success',
        summary: 'Debit Account Deleted',
        detail: 'Debit Account Deleted',
        life: 3000,
      })
      setTimeout(() => {
        this.getDebitAccounts();
      }, 2000);
    })
      .catch((err) => {
        console.log(err);
        this.submitted = false;
        this.message.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error.message,
          life: 3000,
        })
      })
  }

  searchAccount: any;
  searchAccounts() {

  }

}
