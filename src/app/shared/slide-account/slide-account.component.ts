import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/auth/auth.service';
import { PayPageService } from 'src/app/pay/pay-page.service';

@Component({
  selector: 'app-slide-account',
  templateUrl: './slide-account.component.html',
  styleUrls: ['./slide-account.component.scss']
})
export class SlideAccountComponent implements OnInit {

  @HostListener('paste', ['$event']) blockPaste(e: KeyboardEvent) {
    e.preventDefault();
  }

  stateOptions: any[] = [{ label: 'Credit Account', value: 'credit' }, { label: 'Debit Account', value: 'debit' }];
  value: string = 'credit';

  isOpen: boolean = true;

  submitted: boolean = false;

  newDebitAccountForm !: FormGroup;
  newCreditAccountForm !: FormGroup;


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
    private authS: AuthService) { }

  ngOnInit(): void {

    this.initForm();
    this.loadUser();
  }

  initForm() {
    this.newDebitAccountForm = new FormGroup({
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

    this.newCreditAccountForm = new FormGroup({
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

  onSubmitAccountDebit() {
    // For Debit Account
    this.newDebitAccountForm.value.user.id = this.currentUser.id;

    //alert(JSON.stringify(this.newDebitAccountForm.value));
    if (this.newDebitAccountForm.value.accountNumber !== this.newDebitAccountForm.value.confirmAccountNumber) {
      this.message.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Account Number Mismatch Error',
        life: 3000,
      });
    }
    else {

      this.submitted = true;
      this.usedService.saveDebitAccount(this.newDebitAccountForm.value).then(
        (res: any) => {
          console.log(res);
          this.submitted = false;
          this.message.add({
            severity: 'success',
            summary: 'Debit Account Added',
            detail: 'Please Wait for refresh',
            life: 3000,
          });
          this.newDebitAccountForm.reset();
          setTimeout(() => {
            window.location.reload();
          }, 1000);
          setTimeout(() => {
            this.router.navigate(['/banking/accounts']);
          }, 2000);
          
        }
      ).catch(
        (err) => {
          console.log(err);
          this.submitted = false;
          this.newDebitAccountForm.reset();
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

  onSubmitAccountCredit() {
    this.newCreditAccountForm.value.user.id = this.currentUser.id;

    //alert(JSON.stringify(this.newCreditAccountForm.value));
    if (this.newCreditAccountForm.value.accountNumber !== this.newCreditAccountForm.value.confirmAccountNumber) {
      this.message.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Account Number Mismatch Error',
        life: 3000,
      });
    }
    else {
      this.submitted = true;
      this.usedService.saveAccount(this.newCreditAccountForm.value).then((res: any) => {
        console.log(res);
        this.submitted = false;
        this.message.add({
          severity: 'success',
          summary: 'Credit Account Added',
          detail: 'Please Wait for Refresh',
          life: 3000,
        });
        this.newCreditAccountForm.reset();
        //this.ngOnInit();
        setTimeout(() => {
          window.location.reload();
        }, 1000);
        
        setTimeout(() => {
          this.router.navigate(['/banking/accounts']);
        }, 2000);
        
      })
        .catch((err) => {
          console.log(err);
          this.submitted = false;
          this.newCreditAccountForm.reset();
          this.message.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Account Addition Error',
            life: 3000,
          });

        })
    }
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

  showPassword: boolean = false;

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

}
