import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { ReceiptNote } from 'src/app/bills/bills-model';
import { BillsService } from 'src/app/bills/bills.service';
import { ServiceService } from '../service.service';
import { BreadCrumbService } from 'src/app/shared/navbar/bread-crumb.service';

@Component({
  selector: 'app-receipt-note',
  templateUrl: './receipt-note.component.html',
  styleUrls: ['./receipt-note.component.scss']
})
export class ReceiptNoteComponent implements OnInit {

  submitted: boolean = false;

  allReceiptNotes: any[] = [];

  totalRecords: number = 0;
  activeRN: ReceiptNote = {};

  lineitems: any[] = [];
  rnSubTotal: number = 0;
  currentDue: number = 0;

  items!: MenuItem[]

  constructor(private router: Router,
    private route: ActivatedRoute,
    private message: MessageService,
    private fb: FormBuilder,
    private billS: BillsService,
    private vendorS: ServiceService, private breadcrumbS: BreadCrumbService) { }

  ngOnInit(): void {
    this.breadcrumbS.breadCrumb([{ label: 'Receipt Note', routerLink: ['/vendorPortal/receiptNotes'] }, { label: 'Dashboard' }]);

    this.getAllReceiptNotes();
  }

  getAllReceiptNotes() {
    this.submitted = true;
    var vendorId = '0afa0a7c-8abb-1049-818a-bc5500b2001b';
    this.vendorS.getAllReceiptNotesByVendor(vendorId).then(
      (res: any) => {
        this.allReceiptNotes = res;
        if (this.allReceiptNotes.length > 0) {
          this.changeOrder(this.allReceiptNotes[0]);
        } else {
          this.activeRN = {};
        }
        this.totalRecords = res.length;
        this.submitted = false;
      }
    ).catch(
      (err) => {
        this.submitted = false;
        console.log(err);
      }
    )
  }

  changeOrder(item: ReceiptNote) {
    this.activeRN = item;
    this.getNotesLines(item);
    this.getRemainingAmount(item);
  }

  getNotesLines(item: ReceiptNote) {
    this.submitted = true;
    this.billS
      .getLineitemsByRn(item)
      .then((data: any) => {
        if (data) {
          this.lineitems = data;
          this.rnSubTotal = this.lineitems.reduce(
            (total, lineItem) => total + lineItem.amount, 0
          );
          this.submitted = false;
        }
      }).catch(
        (err) => {
          console.log(err);
          this.submitted = false;
        }
      );

  }

  // CreateNewReceiptNote()
  // {
  //   this.router.navigate(['/bills/receiptNote/create']); 
  // }

  // onEditRN(id:string)
  // {
  //   this.router.navigate(['/bills/receiptNote/edit/'+id]); 
  // }

  getRemainingAmount(RN: any) {
    this.submitted = true;
    this.billS.getRemainingAmountReceipt(RN).then(
      (res) => {
        console.log(res);
        this.currentDue = res;
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
