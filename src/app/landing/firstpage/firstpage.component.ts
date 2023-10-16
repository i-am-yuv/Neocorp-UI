import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
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



  isSidebarVisible : boolean =  true;

  sidebarVisible2 : boolean =  false;

  sidebarVisible : boolean =  false;

  sidebarVisible3 : boolean =  false;

  newAccountForm !: FormGroup;

  newAccountForm1 !: FormGroup;

  submitted : boolean =  false;
  
  constructor(private router: Router,
    private route: ActivatedRoute,
    private message: MessageService,
    private fb: FormBuilder,
    private usedService: PayPageService,
    private confirmationService: ConfirmationService,
    ) { }

  ngOnInit(): void {

    this.initForm();


    this.formGroup = new FormGroup({
      value: new FormControl('Credit Account')
  });

  }

  onSubmitAccount()
  {
    alert(JSON.stringify(this.newAccountForm.value ) ) ;

    this.submitted =  true;
    this.usedService.saveAccount( this.newAccountForm.value ).then(
      (res: any) => {
        console.log( res );
        this.submitted =  false;
        this.message.add({
          severity: 'success',
          summary: 'Account Added',
          detail: 'Account Added Successfully',
          life: 3000,
        });
      }
    ).catch(
      (err) => {
        console.log(err);
        this.submitted =  false;
        this.message.add({
          severity: 'success',
          summary: 'Check Server connection',
          detail: 'Account Addition Error',
          life: 3000,
        });
      }
    )
  }


  onSubmitAccount1()
  {
    alert(JSON.stringify(this.newAccountForm1.value ) ) ;

    this.submitted =  true;
    this.usedService.saveDebitAccount( this.newAccountForm1.value ).then(
      (res: any) => {
        console.log( res );
        this.submitted =  false;
        this.message.add({
          severity: 'success',
          summary: 'Account Added',
          detail: 'Account Added Successfully',
          life: 3000,
        });
      }
    ).catch(
      (err) => {
        console.log(err);
        this.submitted =  false;
        this.message.add({
          severity: 'success',
          summary: 'Check Server connection',
          detail: 'Account Addition Error',
          life: 3000,
        });
      }
    )
  }

  initForm()
  {
    this.newAccountForm = new FormGroup({
      id: new FormControl(''),
      // isPrimaryAccount : new FormControl('',Validators.required),
      AccountNumber: new FormControl('', Validators.required),
      confirmAccountNumber: new FormControl('', Validators.required),
      IFSC: new FormControl('', Validators.required),
      bankname: new FormControl('', Validators.required),
      AccountType: new FormControl('', Validators.required)
    });


    this.newAccountForm1 = new FormGroup({
      id: new FormControl(''),
      // isPrimaryAccount : new FormControl('',Validators.required),
      AccountNumber: new FormControl('', Validators.required),
      confirmAccountNumber: new FormControl('', Validators.required),
      IFSC: new FormControl('', Validators.required),
      bankname: new FormControl('', Validators.required),
      AccountType: new FormControl('', Validators.required)
    });

  }

  refreshAll(){
    // this.allPurchaseOrders  = [] ; // customer only have Purchase Orders
    // this.allPurchaseInvoices = [];
    this.showDebit = true ;
    this.showCredit  = false;
  }
  showDebit : boolean = true ;
  showCredit : boolean  = false;

  showDebitPage() {
    this.showDebit = true;
    this.showCredit = false;
  }

  showCreditPage() {
    this.showCredit = true;
    this.showDebit = false;

  }

}
