import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { DebitNote } from 'src/app/bills/bills-model';
import { BillsService } from 'src/app/bills/bills.service';
import { PayPageService } from 'src/app/pay/pay-page.service';
import { Product, State } from 'src/app/profile/profile-models';
import { Vendor } from 'src/app/settings/customers/customer';
import { ServiceService } from '../service.service';

@Component({
  selector: 'app-debit-note',
  templateUrl: './debit-note.component.html',
  styleUrls: ['./debit-note.component.scss']
})
export class DebitNoteComponent implements OnInit {

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
    private vendorS : ServiceService) { }

  ngOnInit(): void {
    this.items = [{label: 'Bills'},{label: 'Debit Note', routerLink: ['/bills/debitNotes']}, {label: 'Dashboard'}]
    this.getAllDebitNotesByVendor();
  }

  getAllDebitNotesByVendor()
  {
    this.submitted =  true;
    var vendorId = '0afa0a7c-8a88-11d6-818a-8807deb30008' ;
    this.vendorS.getAllDebitNotesByVendor(vendorId).then(
      (res : any) => {
        this.allDebitNotes = res;
        if (this.allDebitNotes.length > 0) {
          this.changeOrder(this.allDebitNotes[0]);
        } else {
          this.activeDN = {};
        }
        this.totalRecords = res.length;
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
    }).catch(
      (err)=>{
        console.log(err);
        this.submitted =  false;
      }
    );
  }

  // CreateNewDebitNote()
  // {
  //   this.router.navigate(['/bills/debitNote/create']); 
  // }

  // onEditDN(id:string)
  // {
  //   this.router.navigate(['/bills/debitNote/edit/'+id]); 
  // }

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
