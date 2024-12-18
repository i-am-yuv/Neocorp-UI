import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { BillsService } from '../bills.service';
import { GoodsShipment, GoodsShipmentLine } from '../bills-model';
import { InvoiceService } from 'src/app/invoice/invoice.service';
import { AuthService } from 'src/app/auth/auth.service';
import { BreadCrumbService } from 'src/app/shared/navbar/bread-crumb.service';

@Component({
  selector: 'app-goods-shipment-dashboard',
  templateUrl: './goods-shipment-dashboard.component.html',
  styleUrls: ['./goods-shipment-dashboard.component.scss']
})
export class GoodsShipmentDashboardComponent implements OnInit {

  submitted: boolean = false;

  allGS: any[] = [];

  totalRecords: number = 0;
  activeGS: GoodsShipment = {};

  activeGoodsShipmentLine: GoodsShipmentLine = {};

  lineitems: any[] = [];
  gsSubTotal: number = 0;

  items!: MenuItem[]

  constructor(private router: Router,
    private route: ActivatedRoute,
    private message: MessageService,
    private billS: BillsService,
    private authS: AuthService,
    private commonS: InvoiceService, private breadcrumbS: BreadCrumbService) { }

  ngOnInit(): void {
    this.breadcrumbS.breadCrumb([{ label: 'Receipt Note' }, { label: 'Dashboard' }]);
    this.loadUser();
  }

  getAllGS() {
    this.submitted = true;
    this.billS.getAllGS(this.currentUser).then(
      (res: any) => {
        this.allGS = res;
        if (this.allGS.length > 0) {
          this.changeOrder(this.allGS[0]);
        } else {
          this.activeGS = {};
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
          detail: 'Error while fetching all the goods shipments',
          life: 3000,
        });
      }
    )
  }

  changeOrder(item: GoodsShipment) {
    this.activeGS = item;
    this.getLines(item);
    this.getPoLines(item);
  }

  getPoLines(item: GoodsShipment) {
    this.submitted = true;
    this.billS.getLineitemsByPo(item.purchaseOrder).then(
      (res) => {
        this.lineitems = res;
        this.gsSubTotal = this.lineitems.reduce(
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

  getLines(item: GoodsShipment) {
    this.submitted = true;
    this.billS
      .getLineItemsByGoodsShipmentId(item)
      .then((data: any) => {
        if (data) {
          
          this.activeGoodsShipmentLine.orderedQty = data.orderedQty ? data.orderedQty : 0;
          this.activeGoodsShipmentLine.confirmedQty = data.confirmedQty ? data.confirmedQty : 0;
          this.activeGoodsShipmentLine.shippedQty = data.shippedQty ? data.shippedQty : 0;
          //alert( JSON.stringify(this.activeGoodsShipmentLine)) ;
          this.submitted = false;
        }
      }).catch(
        (err) => {
          console.log(err);
          this.submitted = false;
        }
      )
  }

  CreateNewGS() {
    this.router.navigate(['/bills/goodsShipment/create']);
  }

  onEditRN(id: string) {
    this.router.navigate(['/bills/goodsShipment/edit/' + id]);
  }


  searchGS: any;
  searchGSs(value: any) {
    if (value === null) {
      //  alert(value);
      this.getAllGS();
    }
    else {
      // this.submitted = true;
      this.billS.searchGS(value).then(
        (res: any) => {
          console.log(res);
          this.allGS = res.content;
          if (this.allGS.length > 0) {
            this.changeOrder(this.allGS[0]);
          } else {
            this.activeGS = {};
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

      this.getAllGS(); 
    })
      .catch((err) => {
        console.log(err);
        this.submitted = false;
      })
  }

}
