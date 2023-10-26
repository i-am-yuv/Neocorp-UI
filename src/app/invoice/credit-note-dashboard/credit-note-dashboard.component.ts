import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService, MenuItem } from 'primeng/api';
import { InvoiceService } from '../invoice.service';
import { CreditNote } from '../invoice-model';

@Component({
  selector: 'app-credit-note-dashboard',
  templateUrl: './credit-note-dashboard.component.html',
  styleUrls: ['./credit-note-dashboard.component.scss']
})
export class CreditNoteDashboardComponent implements OnInit {

  createNew : boolean =  false;
  submitted : boolean = false;

  allCreditNotes : any[] =  [] ;

  totalRecords : number = 0 ;
  activeCN: CreditNote = {} ;

  lineitems: any[] = [];
  cnSubTotal: number = 0 ;
  currentDue : number = 0 ;

  items!: MenuItem[];

  constructor(private router: Router,
    private route: ActivatedRoute,
    private message: MessageService,
    private fb: FormBuilder,
    private invoiceS: InvoiceService,
    private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
    this.items = [{label: 'Invoices'}, {label: 'Credit Note', routerLink: ['/invoice/creditNotes']}, {label: 'Dashboard'}];

    this.getAllCreditNotes();
  }

  getAllCreditNotes()
  {
    this.submitted = true;
    this.invoiceS.getAllCn().then(
      (res : any) => {
        this.allCreditNotes = res.content;
        if (this.allCreditNotes.length > 0) {
          this.changeOrder(this.allCreditNotes[0]);
        } else {
          this.activeCN = {};
        }
        this.totalRecords = res.totalElements;
        this.submitted = false;
      }
    ).catch(
      (err) => {
        console.log(err);
        this.submitted = false;
      }
    )
  }

  changeOrder(item : CreditNote )
  {
     this.activeCN = item;
    this.getNotesLines(item);
    this.getRemainingAmountCN(item);
  }

  getNotesLines(item:CreditNote)
  {
    this.submitted = true;
    this.invoiceS
    .getLineitemsByCn(item)
    .then((data: any) => {
      if (data) {
        this.lineitems = data;
        this.cnSubTotal = this.lineitems.reduce(
          (total, lineItem) => total + lineItem.amount, 0
        );
        this.submitted = false;
      }
    });
  }

  CreateNewCreditNote()
  {
    this.router.navigate(['/invoice/creditNote/create']); 
  }

  onEditCN(id:string)
  {
    this.router.navigate(['/invoice/creditNote/edit/'+id]); 
  }

  getRemainingAmountCN(CN:any)
  {
    this.submitted  = true;
    this.invoiceS.getRemainingAmountReceipt(CN).then(
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

  
  searchCN: any;
  searchCNs(value: any) {
    if (value === null) {
      //alert(value);
      this.getAllCreditNotes();
    }
    else{
     // this.submitted = true;
      this.invoiceS.searchCN(value).then(
        (res: any) => {
          console.log(res);
          this.allCreditNotes = res.content;
          if (this.allCreditNotes.length > 0) {
            this.changeOrder(this.allCreditNotes[0]);
          } else {
            this.activeCN = {};
          }
          this.totalRecords = res.totalElements;
          this.submitted = false;
        }
      ).catch(
        (err) => {
          console.log(err);
          this.submitted = false;
        }
      )
    }
    
  }

}
