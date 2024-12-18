import { Component, OnInit } from '@angular/core';
import { ReceiptNote } from '../bills-model';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService, MenuItem } from 'primeng/api';
import { FormBuilder } from '@angular/forms';
import { BillsService } from '../bills.service';
import { AuthService } from 'src/app/auth/auth.service';
import { BreadCrumbService } from 'src/app/shared/navbar/bread-crumb.service';


@Component({
  selector: 'app-receipt-note-dashboard',
  templateUrl: './receipt-note-dashboard.component.html',
  styleUrls: ['./receipt-note-dashboard.component.scss']
})
export class ReceiptNoteDashboardComponent implements OnInit {

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
    private authS: AuthService,
    private confirmationService: ConfirmationService, private breadcrumbS: BreadCrumbService) { }

  ngOnInit(): void {
    this.breadcrumbS.breadCrumb([{ label: 'Receipt Note' }, { label: 'Dashboard' }]);

    this.loadUser();
  }

  getAllReceiptNotes() {
    this.submitted = true;
    this.billS.getAllRn(this.currentUser).then(
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
        console.log(err);
      }
    )
  }

  changeOrder(item: ReceiptNote) {
    this.activeRN = item;
    this.getNotesLines(item);
    // this.getRemainingAmount(item);
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
      });

  }

  CreateNewReceiptNote() {
    this.router.navigate(['/bills/receiptNote/create']);
  }

  onEditRN(id: string) {
    this.router.navigate(['/bills/receiptNote/edit/' + id]);
  }

  // getRemainingAmount(RN:any){
  //   this.submitted  = true;
  //   this.billS.getRemainingAmountReceipt(RN).then(
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



  searchRN: any;
  searchRNs(value: any) {
    if (value === null) {
      //  alert(value);
      this.getAllReceiptNotes();
    }
    else {
      // this.submitted = true;
      this.billS.searchRN(value).then(
        (res: any) => {
          console.log(res);
          this.allReceiptNotes = res.content;
          if (this.allReceiptNotes.length > 0) {
            this.changeOrder(this.allReceiptNotes[0]);
          } else {
            this.activeRN = {};
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
  currentCompany: any = {};
  currentUser: any = {};
  loadUser() {
    this.submitted = true;
    this.authS.getUser().then((res: any) => {
      this.currentCompany = res.comapny;
      this.currentUser = res;
      this.submitted = false;

      this.getAllReceiptNotes();

    })
      .catch((err) => {
        console.log(err);
        this.submitted = false;
      });
  }


}