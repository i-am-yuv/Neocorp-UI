import { Component, OnInit } from '@angular/core';
import { ReturnRefund } from '../pay-model';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService, MenuItem } from 'primeng/api';
import { FormBuilder } from '@angular/forms';
import { InvoiceService } from 'src/app/invoice/invoice.service';
import { PayPageService } from '../pay-page.service';
import { AuthService } from 'src/app/auth/auth.service';
import { BreadCrumbService } from 'src/app/shared/navbar/bread-crumb.service';

@Component({
  selector: 'app-return-refund-dashboard',
  templateUrl: './return-refund-dashboard.component.html',
  styleUrls: ['./return-refund-dashboard.component.scss']
})
export class ReturnRefundDashboardComponent implements OnInit {

  submitted: boolean = false;
  allRROrder: any[] = [];
  totalRecords: number = 0;
  activeRR: ReturnRefund = {};
  lineitems: any[] = [];
  rrSubTotal: number = 0;
  items!: MenuItem[]

  constructor(private router: Router, private payS: PayPageService,
    private authS: AuthService, private breadcrumbS: BreadCrumbService) { }

  ngOnInit(): void {
    this.breadcrumbS.breadCrumb([{ label: 'Return & Refunds', routerLink: ['/pay/returnAndRefund/create'] }, { label: 'Dashboard' }]);

    this.loadUser();
  }

  getAllReturnRefund() {
    this.submitted = true;
    this.payS.getAllRR(this.currentUser).then((res: any) => {
      this.allRROrder = res;
      if (this.allRROrder.length > 0) {
        this.changeOrder(this.allRROrder[0]);
      } else {
        this.activeRR = {};
      }
      this.totalRecords = res.length;
      this.submitted = false;
    })
      .catch(
        (err) => {
          console.log(err);
          this.submitted = false;
        });
  }

  changeOrder(item: ReturnRefund) {
    this.activeRR = item;
    this.getLineItems(item);
  }

  getLineItems(item: ReturnRefund) {
    this.submitted = true;
    this.payS.getLineitemsByRR(item).then((data: any) => {
      if (data) {
        this.lineitems = data;
        this.rrSubTotal = this.lineitems.reduce(
          (total, lineItem) => total + lineItem.amount, 0
        );
        this.submitted = false;
      }
    })
      .catch(
        (err) => {
          console.log(err);
          this.submitted = false;
        });
  }

  openCreateNewRR() {
    this.router.navigate(['/pay/returnAndRefund/create']);
  }

  onEditRR(id: string) {
    this.router.navigate(['/pay/returnAndRefund/edit/' + id]);
  }

  searchRR: any;
  searchRRs(value: any) {
    if (value === null) {
      this.getAllReturnRefund();
    }
    else {
      this.payS.searchRR(value).then((res: any) => {
        this.submitted = true;
        this.allRROrder = res.content;
        if (this.allRROrder.length > 0) {
          this.changeOrder(this.allRROrder[0]);
        } else {
          this.activeRR = {};
        }
        this.totalRecords = res.totalElements;
        this.submitted = false;
      })
        .catch(
          (err) => {
            console.log(err);
            this.submitted = false;
          });
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
      this.getAllReturnRefund();
    })
      .catch((err) => {
        console.log(err);
        this.submitted = false;
      });
  }

}
