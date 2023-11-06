import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { PayPageService } from 'src/app/pay/pay-page.service';
import { BillsService } from '../bills.service';
import { PurchaseOrder } from '../bills-model';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-po-dashboard',
  templateUrl: './po-dashboard.component.html',
  styleUrls: ['./po-dashboard.component.scss']
})
export class PoDashboardComponent implements OnInit {

  submitted: boolean = false;

  allPOs: any[] = [];
  totalRecords: number = 0;

  activeOrder: PurchaseOrder = {};
  lineitems: any[] = [];
  poSubTotal: number = 0;

  items!: MenuItem[];

  constructor(private router: Router,
    private route: ActivatedRoute,
    private message: MessageService,
    private fb: FormBuilder,
    private billS: BillsService,
    private authS: AuthService) { }

  ngOnInit(): void {
    this.items = [{ label: 'Bills' }, { label: 'Purchase Orders', routerLink: ['/bills/purchaseOrders'] }, { label: 'Dashboard' }];

    this.loadUser();
  }

  loadPO() {
    this.submitted = true;
    this.billS.getAllPo(this.currentUser).then(
      (res: any) => {
        console.log(res);
        this.allPOs = res;
        if (this.allPOs.length > 0) {
          this.changeOrder(this.allPOs[0]);
        } else {
          this.activeOrder = {};
        }
        this.totalRecords = res.length;
        this.submitted = false;
      }
    ).catch(
      (err) => {
        console.log(err);
        this.submitted = false;
        this.message.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error While Fetching All The POs',
          life: 3000
        })
      }
    )

  }

  changeOrder(po: PurchaseOrder) {
    this.activeOrder = po;
    this.getOrderLines(po);
  }

  getOrderLines(order: PurchaseOrder) {
    this.submitted = true;
    this.billS
      .getLineitemsByPo(order)
      .then((data: any) => {
        if (data) {
          this.lineitems = data;
          this.poSubTotal = this.lineitems.reduce(
            (total, lineItem) => total + lineItem.amount, 0
          );
        }
        this.submitted = false;
      });

  }

  CreateNewPO() {
    this.router.navigate(['/bills/purchaseOrder/create']);
  }

  onEditPO(id: string) {
    this.router.navigate(['/bills/purchaseOrder/edit/' + id]);
  }

  searchOrder: any;
  searchOrders(value: any) {
    if (value === null) {
      //  alert(value);
      this.loadPO();
    }
    else {
      // this.submitted = true;
      this.billS.searchPurchaseOrder(value).then(
        (res: any) => {
          console.log(res);
          this.allPOs = res.content;
          if (this.allPOs.length > 0) {
            this.changeOrder(this.allPOs[0]);
          } else {
            this.activeOrder = {};
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

  currentUser: any = {};
  currentCompany: any = {};
  loadUser() {
    this.submitted = true;
    this.authS.getUser().then(
      (res: any) => {
        this.currentUser = res;
        this.currentCompany = res.comapny;
        this.submitted = false;
        this.loadPO();
      }
    ).catch(
      (err) => {
        console.log(err);
        this.submitted = false;
      }
    )
  }


}

