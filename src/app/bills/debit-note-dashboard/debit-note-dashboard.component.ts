import { Component, OnInit } from '@angular/core';
import { DebitNote } from '../bills-model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { InvoiceService } from 'src/app/invoice/invoice.service';
import { BillsService } from '../bills.service';
import { AuthService } from 'src/app/auth/auth.service';

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
    private billS: BillsService,
    private authS : AuthService) { }

  ngOnInit(): void {
    this.items = [{label: 'Bills'},{label: 'Debit Note', routerLink: ['/bills/debitNotes']}, {label: 'Dashboard'}]
    
    this.loadUser();
  }

  getAllDebitNotes()
  {
    this.submitted =  true;
    this.billS.getAllDn(this.currentUser).then(
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
        this.message.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error While Fetching All The Debit Notes',
          life: 3000,
        });
      }
    )
  }

  changeOrder(item : DebitNote )
  {
     this.activeDN = item;
    this.getNotesLines(item);
   // this.getRemainingAmount(item);
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

  // getRemainingAmount(DN:any)
  // {
  //   this.submitted  = true;
  //   this.billS.getRemainingAmount(DN).then(
  //     (res)=>{
  //           console.log(res);
  //           this.currentDue = res;
  //           this.submitted  = false;
  //     }
  //   ).catch(
  //     (err)=>{
  //        console.log(err);
  //        this.submitted  = false;
  //     }
  //   )
  // }

  searchDN: any;
  searchDNs(value: any) {
    if (value === null) {
    //  alert(value);
      this.getAllDebitNotes();
    }
    else{
     // this.submitted = true;
      this.billS.searchDN(value).then(
        (res: any) => {
          console.log(res);
          this.allDebitNotes = res.content;
          if (this.allDebitNotes.length > 0) {
            this.changeOrder(this.allDebitNotes[0]);
          } else {
            this.activeDN = {};
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

  currentUser : any = {};
  currCompany : any = {};
  loadUser() {
    this.submitted = true;
    this.authS.getUser().then((res: any) => {
      this.currCompany = res.comapny;
      this.currentUser = res ;
      this.submitted = false;
      this.getAllDebitNotes();
    })
      .catch((err) => {
        console.log(err);
        this.submitted = false;
      });
  }

}
