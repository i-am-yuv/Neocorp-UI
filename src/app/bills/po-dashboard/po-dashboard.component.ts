import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { PayPageService } from 'src/app/pay/pay-page.service';
import { BillsService } from '../bills.service';
import { PurchaseOrder } from '../bills-model';

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
    private usedService: PayPageService,
    private billS: BillsService,
    private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
    this.items = [{ label: 'Bills' }, { label: 'Purchase Orders', routerLink: ['/bills/purchaseOrders'] }, { label: 'Dashboard' }];

    this.loadPO();
  }

  loadPO() {
    this.submitted = true;
    this.billS.getAllPo().then(
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
  searchOrders(e: any) {
    alert(e);
    // here this allPOs should be change
  }


}

