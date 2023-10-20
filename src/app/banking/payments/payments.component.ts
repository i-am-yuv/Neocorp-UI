import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, MenuItem } from 'primeng/api';
import { BankingService } from '../banking.service';
import { PurchaseInvoice } from 'src/app/collect/collect-models';
import { PayPageService } from 'src/app/pay/pay-page.service';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss']
})
export class PaymentsComponent implements OnInit {

  stateOptions: any[] = [{ label: 'Pending', value: 'pending' }, { label: 'Completed', value: 'completed' }];
  value: string = 'pending';

  submitted: boolean = false;
  allCompletedPI: any[] = [];
  allNonCompletedPI: any[] = [];
  totalRecordsC: number = 0;
  totalRecordsNC: number = 0;
  activePI: PurchaseInvoice = {};

  items!: MenuItem[];

  constructor(private route: ActivatedRoute,
    private router: Router,
    private message: MessageService,
    private bankingS: BankingService,
    private payServices : PayPageService) { }

  ngOnInit(): void {
    this.items = [{ label: 'Banking' }, { label: 'Payment' }];

    //this.getAllCompletedPI();
    this.getAllPI();
  }

  createNewPI() {
    this.router.navigate(['/collect/purchaseInvoice/create']);
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

  getAllPI() {
    this.submitted = true;
    this.bankingS.getAllPI().then(
     (res)=>{
       console.log(res);
      // this.allPI = res.content;
       this.allCompletedPI = res.content.filter((pi : PurchaseInvoice) => pi.status == 'COMPLETED'); 
       this.allNonCompletedPI = res.content.filter((pi : PurchaseInvoice) => pi.status != 'COMPLETED'); 

      // this.totalRemainingAmount = 0;
        for (const purchaseInvoice of this.allNonCompletedPI) {
  
          this.payServices.getRemainingAmountByPurchaseInvoice(purchaseInvoice).then(
            (res) => {
              this.allNonCompletedPI.find((invoice) => invoice.id === purchaseInvoice.id).remainingAmount = res;
               console.log(res);
                // this.totalRemainingAmount += res ;
            }
          ).catch(
            (err) => {
              console.log(err);
            }
          )
        }

       this.totalRecordsC = this.allCompletedPI.length ;
       this.totalRecordsNC = this.allNonCompletedPI.length ;
       this.submitted = false;
     }
    ).catch(
      (err) => {
        console.log(err);
        this.submitted = false;
      }
    )
  }

  changeActivePI(pi: PurchaseInvoice) {
    this.activePI = pi;
  }

  goToVendorPaymentPage(pi: PurchaseInvoice) {
    this.router.navigate(['banking/payToVendor/pi/' + pi.id]);
  }

  myFunction(item: any): string {
    return parseFloat(item.remainingAmount).toFixed(2);
  }

  myFunction1(item: any): string {
    return parseFloat(item.grossTotal).toFixed(2);
  }
  
}
