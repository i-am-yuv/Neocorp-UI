import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { CashMemo } from 'src/app/invoice/invoice-model';
import { InvoiceService } from 'src/app/invoice/invoice.service';
import { ServiceService } from '../service.service';

@Component({
  selector: 'app-cashmemo',
  templateUrl: './cashmemo.component.html',
  styleUrls: ['./cashmemo.component.scss']
})
export class CashmemoComponent implements OnInit {

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
    private vendorS : ServiceService) { }

  ngOnInit(): void {
    this.items = [{label: 'Invoices'},{ label: 'Cash Memo', routerLink: ['/invoice/cashMemo'] }, {label: 'Dashboard'}];

    this.getAllCashMemoByVendor();
  }

  getAllCashMemoByVendor()
  {
    this.submitted =  true;
    var vendorId = '0afa0a7c-8a88-11d6-818a-880612290005' ;
    this.vendorS.getAllCashMemoByVendor(vendorId).then(
      (res : any) => {
        this.allCashMemo = res;
        if (this.allCashMemo.length > 0) {
          this.changeOrder(this.allCashMemo[0]);
        } else {
          this.activeCM = {};
        }
        this.totalRecords = res.length;
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

  // CreateNewCashMemo()
  // {
  //   this.router.navigate(['/invoice/cashMemo/create']); 
  // }

  // onEditCM(id:string)
  // {
  //   this.router.navigate(['/invoice/cashMemo/edit/'+id]); 
  // }


}