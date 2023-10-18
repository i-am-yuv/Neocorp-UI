import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { BankingService } from '../banking.service';
import { PurchaseInvoice } from 'src/app/collect/collect-models';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss']
})
export class PaymentsComponent implements OnInit {

  stateOptions: any[] = [{label: 'Pending', value: 'pending'}, {label: 'Completed', value: 'completed'}];
  value: string = 'pending';

  submitted : boolean = false;
  allCompletedPI :  any[] = [] ;
  allNonCompletedPI : any[] = [];
  totalRecordsC : number = 0 ;
  totalRecordsNC : number = 0;
  activePI : PurchaseInvoice = {};

  constructor(private route: ActivatedRoute,
    private router: Router,
    private message: MessageService,
    private bankingS: BankingService) { }

  ngOnInit(): void {

    //this.getAllCompletedPI();
    this.getAllPI();
  }

  createNewPI()
  {

  }

  // getAllCompletedPI()
  // {
  //    this.submitted = true;
  //    this.bankingS.getAllCompletedPI().then(
  //     (res)=>{
  //       console.log(res);
  //       this.allCompletedPI = res.content;
  //       this.totalRecordsC = res.totalElements ;
  //       this.submitted = false;
  //     }
  //    ).catch(
  //     (err)=>{
  //       console.log(err);
  //       this.submitted = false;
  //     }
  //    )
  // }

  getAllPI()
  {
    this.submitted = true;
    this.bankingS.getAllPI().then(
     (res)=>{
       console.log(res);
      // this.allPI = res.content;
       this.allCompletedPI = res.content.filter((pi : PurchaseInvoice) => pi.status == 'COMPLETED'); 
       this.allNonCompletedPI = res.content.filter((pi : PurchaseInvoice) => pi.status != 'COMPLETED'); 
       this.totalRecordsC = this.allCompletedPI.length ;
       this.totalRecordsNC = this.allNonCompletedPI.length ;
       this.submitted = false;
     }
    ).catch(
     (err)=>{
       console.log(err);
       this.submitted = false;
     }
    )
  }

  changeActivePI( pi : PurchaseInvoice)
  {
    this.activePI = pi;
  }
  
  goToVendorPaymentPage(pi : PurchaseInvoice)
  {
    this.router.navigate(['banking/payToVendor/pi/'+pi.id]);
  }

}
