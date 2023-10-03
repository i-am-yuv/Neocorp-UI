import { Component, OnInit } from '@angular/core';
import { PurchaseInvoice } from '../collect-models';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormBuilder } from '@angular/forms';
import { CollectService } from '../collect.service';

@Component({
  selector: 'app-po-invoice-dashboard',
  templateUrl: './po-invoice-dashboard.component.html',
  styleUrls: ['./po-invoice-dashboard.component.scss']
})
export class PoInvoiceDashboardComponent implements OnInit {

  submitted : boolean = false;

  allPIs : any[] = [];
  totalRecords: number = 0 ;
  
  activeInvoice: PurchaseInvoice = {} ;
  lineitems: any[] = [];
  piSubTotal: number = 0 ;

  currentDue : number = 0 ;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private message: MessageService,
    private fb: FormBuilder,
    private collectS: CollectService,
    private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
    this.loadPI();
    this.currentDue = 0;
  }

  loadPI()
  {
    this.submitted = true;
    this.collectS.allPurchaseInvoice().then(
      (res:any) => {
         console.log(res) ;
         this.allPIs = res.content ;
         this.totalRecords = res.totalElements;
         this.submitted = false;
      }
    ).catch(
      (err) => {
        console.log(err);
      }
    )
    
  }

  changeOrder( pi : PurchaseInvoice)
  {
    this.currentDue = 0;
    this.activeInvoice = pi;
    this.getOrderLines(pi);
    this.getRemainingAmount(pi);
  }

  getOrderLines(invoice:PurchaseInvoice)
  {

    this.submitted = true;
    this.collectS
    .getPurchaseLineItemsByInvoice(invoice)
    .then((data: any) => {
      if (data) {
        this.lineitems = data;
        this.submitted =  false;
        this.piSubTotal = this.lineitems.reduce(
          (total, lineItem) => total + lineItem.amount, 0
        );
      }
      this.submitted = false ;
    });
    
  }

  CreateNewPI()
  {
    this.router.navigate(['/collect/purchaseInvoice/create']);
  }

  onEditPI(id:string)
  {
    this.router.navigate(['/collect/purchaseInvoice/edit/'+id]); 
  }

  getRemainingAmount(PI:any)
  {
    this.submitted  = true;
    this.collectS.getRemainingAmount(PI).then(
      (res)=>{
            console.log(res);
            this.currentDue = res;
            this.submitted  = false;
      }
    ).catch(
      (err)=>{
         console.log(err);
         this.submitted  = false;
      }
    )
  }
}