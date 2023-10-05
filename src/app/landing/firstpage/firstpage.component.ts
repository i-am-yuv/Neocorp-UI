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

  isSidebarVisible : boolean =  true;

  sidebarVisible2 : boolean =  false;

  newAccountForm !: FormGroup;

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

  initForm()
  {
    this.newAccountForm = new FormGroup({
      id: new FormControl(''),
      isPrimaryAccount : new FormControl('',Validators.required),
      AccountNumber: new FormControl('', Validators.required),
      confirmAccountNumber: new FormControl('', Validators.required),
      IFSC: new FormControl('', Validators.required),
      bankname: new FormControl('', Validators.required),
      AccountType: new FormControl('', Validators.required)
    });

  }

}
