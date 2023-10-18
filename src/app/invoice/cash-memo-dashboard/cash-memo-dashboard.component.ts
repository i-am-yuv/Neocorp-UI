import { Component, OnInit } from '@angular/core';
import { CashMemo } from '../invoice-model';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { FormBuilder } from '@angular/forms';
import { InvoiceService } from '../invoice.service';

@Component({
  selector: 'app-cash-memo-dashboard',
  templateUrl: './cash-memo-dashboard.component.html',
  styleUrls: ['./cash-memo-dashboard.component.scss']
})
export class CashMemoDashboardComponent implements OnInit {

  submitted : boolean = false;
  createnew : boolean = false;

  allCashMemo : any[] =  [] ;

  totalRecords : number = 0 ;
  activeCM: CashMemo = {} ;

  lineitems: any[] = [];
  cmSubTotal: number = 0 ;

  items!: MenuItem[];

  constructor(private router: Router,
    private route: ActivatedRoute,
    private message: MessageService,
    private fb: FormBuilder,
    private invoiceS: InvoiceService,
    private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
    this.items = [{ label: 'Cash Memo', routerLink: ['/invoice/cashMemo'] }];

    this.getAllCashMemo();
  }

  getAllCashMemo()
  {
    this.submitted =  true;
    this.invoiceS.getAllCashMemo().then(
      (res : any) => {
        this.allCashMemo = res.content;
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

  changeOrder(item : CashMemo )
  {
     this.activeCM = item;
    this.getNotesLines(item);
  }

  getNotesLines(item:CashMemo)
  {
    this.submitted =  true;
    this.invoiceS
    .getLineitemsByCashmemo(item)
    .then((data: any) => {
      if (data) {
        this.lineitems = data;
        this.cmSubTotal = this.lineitems.reduce(
          (total, lineItem) => total + lineItem.amount, 0
        );
        this.submitted =  false;
      }
    });
  }

  CreateNewCashMemo()
  {
    this.router.navigate(['/invoice/cashMemo/create']); 
  }

  onEditCM(id:string)
  {
    this.router.navigate(['/invoice/cashMemo/edit/'+id]); 
  }


}