import { Component, OnInit } from '@angular/core';
import { DebitNote } from '../bills-model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { InvoiceService } from 'src/app/invoice/invoice.service';
import { BillsService } from '../bills.service';

@Component({
  selector: 'app-debit-note-dashboard',
  templateUrl: './debit-note-dashboard.component.html',
  styleUrls: ['./debit-note-dashboard.component.scss']
})
export class DebitNoteDashboardComponent implements OnInit {

  submitted : boolean =  false;
  createNew : boolean = false;

  allDebitNotes : any[] =  [] ;

  totalRecords : number = 0 ;
  activeDN: DebitNote = {} ;

  lineitems: any[] = [];
  dnSubTotal: number = 0 ;
  currentDue : number = 0 ;

  items!: MenuItem[];

  constructor(private router: Router,
    private route: ActivatedRoute,
    private message: MessageService,
    private fb: FormBuilder,
    private billS: BillsService,
    private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
    this.items = [{label: 'Bills'},{label: 'Debit Note', routerLink: ['/bills/debitNotes']}, {label: 'Dashboard'}]
    this.getAllDebitNotes();
  }

  getAllDebitNotes()
  {
    this.submitted =  true;
    this.billS.getAllDn().then(
      (res : any) => {
        this.allDebitNotes = res.content;
        this.totalRecords = res.totalElements;
        this.submitted =  false;
      }
    ).catch(
      (err) => {
        this.submitted =  false;
        console.log(err);
      }
    )
  }

  changeOrder(item : DebitNote )
  {
     this.activeDN = item;
    this.getNotesLines(item);
    this.getRemainingAmount(item);
  }

  getNotesLines(item:DebitNote)
  {
    this.submitted =  true;
    this.billS
    .getLineitemsByDn(item)
    .then((data: any) => {
      if (data) {
        this.lineitems = data;
        this.dnSubTotal = this.lineitems.reduce(
          (total, lineItem) => total + lineItem.amount, 0
        );
        this.submitted =  false;
      }
    });
  }

  CreateNewDebitNote()
  {
    this.router.navigate(['/bills/debitNote/create']); 
  }

  onEditDN(id:string)
  {
    this.router.navigate(['/bills/debitNote/edit/'+id]); 
  }

  getRemainingAmount(DN:any)
  {
    this.submitted  = true;
    this.billS.getRemainingAmount(DN).then(
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
