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
  items!: MenuItem[];

  totalReturn: number = 0;
  totalRefund: number = 0;

  data: any;
  options: any;

  constructor(private router: Router, private payS: PayPageService,
    private authS: AuthService, private breadcrumbS: BreadCrumbService) { }

  ngOnInit(): void {
    this.breadcrumbS.breadCrumb([{ label: 'Return & Refunds', routerLink: ['/pay/returnAndRefund/create'] }, { label: 'Dashboard' }]);

    this.loadUser();
    this.graphRR();
  }

  graphRR() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.data = {
      labels: [1, 2, 3, 4, 5, 6, 7, 8,],
      datasets: [
        {
          type: 'bar',
          label: 'Collection',
          backgroundColor: documentStyle.getPropertyValue('--blue-400'),
          data: [21, 84, 24, 75, 37, 65, 34, 22,]
        },
        {
          type: 'bar',
          label: 'Disburse',
          backgroundColor: documentStyle.getPropertyValue('--gray-300'),
          // backgroundColor: documentStyle.getPropertyValue('color'),
          data: [50, 25, 12, 48, 90, 76, 42, 44,]
        }

        // {
        //   type: 'bar',
        //   label: 'Dataset 3',
        //   backgroundColor: documentStyle.getPropertyValue('--yellow-500'),
        //   data: [41, 52, 24, 74, 23, 21, 32]
        // }
      ]
    };

    this.options = {
      maintainAspectRatio: false,
      aspectRatio: 1.9,
      plugins: {
        tooltips: {
          mode: 'index',
          intersect: false
        },
        legend: {
          display: false,
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        x: {
          stacked: true,
          ticks: {
            color: textColorSecondary
          },
          grid: {
            display: false,
            color: surfaceBorder,
            drawBorder: false
          }
        },
        y: {
          stacked: true,
          ticks: {
            color: textColorSecondary
          },
          grid: {
            display: false,
            color: surfaceBorder,
            drawBorder: false
          }
        }
      },
      showLines: false,
    };
  }

  getAllReturnRefund() {
    this.submitted = true;
    this.payS.getAllRR(this.currentUser).then((res: any) => {
      this.allRROrder = res;

      this.totalRefund = 0;
      this.totalReturn = 0;
      for (const order of this.allRROrder) {
        if (order.refund == true) {
          this.totalRefund += 1;
        }

        if (order.return == true) {
          this.totalReturn += 1;
        }
      }

      if (this.allRROrder.length > 0) {
        this.changeOrder(this.allRROrder[0]);
      }
      else {
        this.activeRR = {};
      }

      this.totalRecords = res.length;
      this.submitted = false;
    })
      .catch((err) => {
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
