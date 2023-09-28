import { Component, OnInit } from '@angular/core';
import { ReceiptNote } from '../bills-model';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormBuilder } from '@angular/forms';
import { BillsService } from '../bills.service';

@Component({
  selector: 'app-receipt-note-dashboard',
  templateUrl: './receipt-note-dashboard.component.html',
  styleUrls: ['./receipt-note-dashboard.component.scss']
})
export class ReceiptNoteDashboardComponent implements OnInit {

  submitted : boolean = false;

  allReceiptNotes : any[] =  [] ;

  totalRecords : number = 0 ;
  activeRN: ReceiptNote = {} ;

  lineitems: any[] = [];
  rnSubTotal: number = 0 ;


  constructor(private router: Router,
    private route: ActivatedRoute,
    private message: MessageService,
    private fb: FormBuilder,
    private billS: BillsService,
    private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
    this.getAllReceiptNotes();
  }

  getAllReceiptNotes()
  {
    this.submitted = true;
    this.billS.getAllRn().then(
      (res : any) => {
        this.allReceiptNotes = res.content;
        this.totalRecords = res.totalElements;
        this.submitted = false;
      }
    ).catch(
      (err) => {
        console.log(err);
      }
    )
  }

  changeOrder(item : ReceiptNote )
  {
     this.activeRN = item;
    this.getNotesLines(item);
  }

  getNotesLines(item:ReceiptNote)
  {
    this.submitted  =true;
    this.billS
    .getLineitemsByRn(item)
    .then((data: any) => {
      if (data) {
        this.lineitems = data;
        this.rnSubTotal = this.lineitems.reduce(
          (total, lineItem) => total + lineItem.amount, 0
        );
        this.submitted  =false;
      }
    });
    
  }

  CreateNewReceiptNote()
  {
    this.router.navigate(['/bills/receiptNote/create']); 
  }

  onEditRN(id:string)
  {
    this.router.navigate(['/bills/receiptNote/edit/'+id]); 
  }

}