import { Component, OnInit } from '@angular/core';
import { SalesOrder } from '../invoice-model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { InvoiceService } from '../invoice.service';
import { AuthService } from 'src/app/auth/auth.service';
import { BreadCrumbService } from 'src/app/shared/navbar/bread-crumb.service';

@Component({
  selector: 'app-sales-order-dashboard',
  templateUrl: './sales-order-dashboard.component.html',
  styleUrls: ['./sales-order-dashboard.component.scss']
})
export class SalesOrderDashboardComponent implements OnInit {

  submitted: boolean = false;
  createNew: boolean = false;

  allSalesOrder: any[] = [];

  totalRecords: number = 0;
  activeOrder: SalesOrder = {};

  lineitems: any[] = [];
  soSubTotal: number = 0;

  items!: MenuItem[];


  constructor(private router: Router,
    private route: ActivatedRoute,
    private message: MessageService,
    private invoiceS: InvoiceService,
    private authS: AuthService, private breadcrumbS: BreadCrumbService) { }

  ngOnInit(): void {
    this.breadcrumbS.breadCrumb([{ label: 'Sales Orders', routerLink: ['/invoice/salesOrders'] }, { label: 'Dashboard' }]);

    this.loadUser();
  }


  getAllSalesOrders() {
    this.submitted = true;
    this.invoiceS.getAllSo(this.currentUser).then(
      (res: any) => {
        this.allSalesOrder = res;
        if (this.allSalesOrder.length > 0) {
          this.changeOrder(this.allSalesOrder[0]);
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
          detail: 'Error while fetching all the sales orders',
          life: 3000,
        });
      }
    )
  }

  changeOrder(item: SalesOrder) {
    this.activeOrder = item;
    this.getLineItems(item);
  }

  getLineItems(item: SalesOrder) {
    this.submitted = true;
    this.invoiceS
      .getLineitemsBySo(item)
      .then((data: any) => {
        if (data) {
          this.lineitems = data;
          this.soSubTotal = this.lineitems.reduce(
            (total, lineItem) => total + lineItem.amount, 0
          );
        }
        this.submitted = false;
      }).catch(
        (err) => {
          console.log(err);
          this.submitted = false;
        }
      );
  }

  CreateNewSalesOrder() {
    this.router.navigate(['/invoice/salesOrder/create']);
  }

  onEditSO(id: string) {
    this.router.navigate(['/invoice/salesOrder/edit/' + id]);
  }

  searchSO: any;
  searchSOs(value: any) {
    if (value === null) {
      //alert(value);
      this.getAllSalesOrders();
    }
    else {
      // this.submitted = true;
      this.invoiceS.searchSO(value).then(
        (res: any) => {
          console.log(res);
          this.allSalesOrder = res.content;
          if (this.allSalesOrder.length > 0) {
            this.changeOrder(this.allSalesOrder[0]);
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
    this.authS.getUser().then((res: any) => {
      this.currentUser = res;
      this.currentCompany = res.comapny;
      this.submitted = false;

      this.getAllSalesOrders();
    })
      .catch((err) => {
        console.log(err);
        this.submitted = false;
      })
  }



}
