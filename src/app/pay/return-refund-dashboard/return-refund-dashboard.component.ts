import { Component, OnInit } from '@angular/core';
import { ReturnRefund } from '../pay-model';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService, MenuItem } from 'primeng/api';
import { FormBuilder } from '@angular/forms';
import { InvoiceService } from 'src/app/invoice/invoice.service';
import { PayPageService } from '../pay-page.service';

@Component({
  selector: 'app-return-refund-dashboard',
  templateUrl: './return-refund-dashboard.component.html',
  styleUrls: ['./return-refund-dashboard.component.scss']
})
export class ReturnRefundDashboardComponent implements OnInit {

  submitted : boolean = false;

  allRROrder : any[] =  [] ;

  totalRecords : number = 0 ;
  activeRR: ReturnRefund = {} ;

  lineitems: any[] = [];
  rrSubTotal: number = 0 ;

  items!: MenuItem[]

  constructor(private router: Router,
    private route: ActivatedRoute,
    private message: MessageService,
    private fb: FormBuilder,
    private payS: PayPageService,
    private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
    this.items = [{ label: 'Bills' }, { label: 'Return & Refund', routerLink: ['/pay/returnAndRefund/create'] }, { label: 'Dashboard' }];

    this.getAllReturnRefund();
  }

  getAllReturnRefund()
  {
    this.submitted = true;
    this.payS.getAllRR().then(
      (res : any) => {
        this.allRROrder = res.content;
        if (this.allRROrder.length > 0) {
          this.changeOrder(this.allRROrder[0]);
        } else {
          this.activeRR = {};
        }
        this.totalRecords = res.totalElements;
        this.submitted =  false;
      }
    ).catch(
      (err) => {
        console.log(err);
        this.submitted =  false;
      }
    )
  }

  changeOrder(item : ReturnRefund )
  {
     this.activeRR = item;
    this.getLineItems(item);
  }

  getLineItems(item:ReturnRefund)
  {
    this.submitted =  true;
    this.payS
    .getLineitemsByRR(item)
    .then((data: any) => {
      if (data) {
        this.lineitems = data;
        this.rrSubTotal = this.lineitems.reduce(
          (total, lineItem) => total + lineItem.amount, 0
        );
        this.submitted =  false;
      }
    }).catch(
      (err)=>{
        console.log( err);
        this.submitted =  false;
      }
    ) ;
  }

  CreateNewReturnRefund()
  {
    this.router.navigate(['/pay/returnAndRefund/create']); 
  }

  onEditRR(id:string)
  {
    this.router.navigate(['/pay/returnAndRefund/edit/'+id]); 
  }

}
