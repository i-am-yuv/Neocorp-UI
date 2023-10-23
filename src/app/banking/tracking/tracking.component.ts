import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BankingService } from '../banking.service';
import { MessageService } from 'primeng/api';
import { PayPageService } from 'src/app/pay/pay-page.service';
import { Payment } from '../banking-model';

@Component({
  selector: 'app-tracking',
  templateUrl: './tracking.component.html',
  styleUrls: ['./tracking.component.scss']
})
export class TrackingComponent implements OnInit {

  stateOptions: any[] = [{label: 'Disburse', value: 'disburse'}, {label: 'Collection', value: 'collection'}];
  value: string = 'disburse';

  submitted : boolean = false;

  totalDebitedAmount : number = 0 ;

  activePayment : Payment = {};

  allDebitPayments : any[] = [];
  totalRecords: number = 0 ;

  displayBeneDialog: boolean =  false;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private message: MessageService,
    private bankingS: BankingService,
    private payServices : PayPageService) { }

  ngOnInit(): void {
    // for disburse  
    this.getAllPayments();
  }

  getAllPayments()
  {
    this.submitted = true;
    this.bankingS.getAllDebitPayment().then(
     (res)=>{
       console.log(res);
       this.allDebitPayments = res.content;
       this.totalRecords = res.totalElements;
       this.totalDebitedAmount = this.allDebitPayments
          .reduce((total, PI) =>
            total + PI.amount, 0
          )
       this.submitted = false;
     }
    ).catch(
     (err)=>{
       console.log(err);
       this.submitted = false;
     }
    )
  }

  addAccount()
  {

  }

  myFunction(item: any): string {
    return parseFloat(item).toFixed(2);
  }

  openBeneInfo(item : any)
  {
    this.displayBeneDialog = true;
    this.activePayment = item;
  }

}
