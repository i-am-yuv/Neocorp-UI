import { Component, OnInit } from '@angular/core';
import { GoodsReceipt, GoodsReceiptLine } from '../bills-model';
import { MenuItem, MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { BillsService } from '../bills.service';
import { InvoiceService } from 'src/app/invoice/invoice.service';
import { AuthService } from 'src/app/auth/auth.service';
import { BreadCrumbService } from 'src/app/shared/navbar/bread-crumb.service';

@Component({
  selector: 'app-goods-receipt-dashboard',
  templateUrl: './goods-receipt-dashboard.component.html',
  styleUrls: ['./goods-receipt-dashboard.component.scss']
})
export class GoodsReceiptDashboardComponent implements OnInit {

  submitted: boolean = false;

  allGR: any[] = [];

  totalRecords: number = 0;
  activeGR: GoodsReceipt = {};

  activeGoodsReceiptLine: GoodsReceiptLine = {};

  lineitems: any[] = [];
  grSubTotal: number = 0;

  items!: MenuItem[]

  constructor(private router: Router,
    private route: ActivatedRoute,
    private message: MessageService,
    private billS: BillsService,
    private authS: AuthService,
    private commonS: InvoiceService, private breadcrumbS: BreadCrumbService) { }

  ngOnInit(): void {
    this.breadcrumbS.breadCrumb([{ label: 'Goods Receipt' }, { label: 'Dashboard' }]);

    this.loadUser();
  }

  getAllGR() {
    this.submitted = true;
    this.billS.getAllGR(this.currentUser).then(
      (res: any) => {
        this.allGR = res;
        if (this.allGR.length > 0) {
          this.changeOrder(this.allGR[0]);
        } else {
          this.activeGR = {};
        }
        this.totalRecords = res.length;
        this.submitted = false;
      }
    ).catch(
      (err) => {
        console.log(err);
        this.message.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error While Fetching All The Goods Receipts',
          life: 3000,
        });
      }
    )
  }

  changeOrder(item: GoodsReceipt) {
    this.activeGR = item;
    this.getLines(item);
    this.getSoLines(item);
  }

  getSoLines(item: GoodsReceipt) {
    this.submitted = true;
    this.commonS.getLineitemsBySo(item.salesOrder).then(
      (res) => {
        this.lineitems = res;
        this.grSubTotal = this.lineitems.reduce(
          (total, lineItem) => total + lineItem.amount, 0
        );
        this.submitted = false;
      }
    ).catch(
      (err) => {
        console.log(err);
        this.submitted = false;
      }
    )
  }

  getLines(item: GoodsReceipt) {
    this.submitted = true;
    this.billS
      .getLineItemsByGoodsReceiptId(item)
      .then((data: any) => {
        if (data) {
          // this.activeGoodsReceiptLine = data[0];
          this.activeGoodsReceiptLine.orderedQty = data[0].orderedQty ? data[0].orderedQty : 0;
          this.activeGoodsReceiptLine.confirmedQty = data[0].confirmedQty ? data[0].confirmedQty : 0;
          this.activeGoodsReceiptLine.shippedQty = data[0].shippedQty ? data[0].shippedQty : 0;
          this.activeGoodsReceiptLine.receivedQty = data[0].shippedQty ? data[0].receivedQty : 0;
          this.submitted = false;
        }
      }).catch(
        (err) => {
          console.log(err);
          this.submitted = false;
        }
      )
  }

  CreateNewGR() {
    this.router.navigate(['/bills/goodsReceipt/create']);
  }

  onEditRN(id: string) {
    this.router.navigate(['/bills/goodsReceipt/edit/' + id]);
  }


  searchGR: any;
  searchGRs(value: any) {
    if (value === null) {
      //  alert(value);
      this.getAllGR();
    }
    else {
      // this.submitted = true;
      this.billS.searchGR(value).then(
        (res: any) => {
          console.log(res);
          this.allGR = res.content;
          if (this.allGR.length > 0) {
            this.changeOrder(this.allGR[0]);
          } else {
            this.activeGR = {};
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
      this.getAllGR(); 
    })
      .catch((err) => {
        console.log(err);
        this.submitted = false;
      })
  }

}
