import { Component, OnInit } from '@angular/core';
import { GoodsReceipt, GoodsReceiptLine } from '../bills-model';
import { MenuItem, MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { BillsService } from '../bills.service';
import { PayPageService } from 'src/app/pay/pay-page.service';
import { InvoiceService } from 'src/app/invoice/invoice.service';

@Component({
  selector: 'app-goods-receipt-dashboard',
  templateUrl: './goods-receipt-dashboard.component.html',
  styleUrls: ['./goods-receipt-dashboard.component.scss']
})
export class GoodsReceiptDashboardComponent implements OnInit {

  submitted : boolean = false;

  allGR : any[] =  [] ;

  totalRecords : number = 0 ;
  activeGR: GoodsReceipt = {} ;

  activeGoodsReceiptLine : GoodsReceiptLine = {};

  lineitems: any[] = [];
  grSubTotal: number = 0 ;

  items!: MenuItem[]

  constructor(private router: Router,
    private route: ActivatedRoute,
    private message: MessageService,
    private fb: FormBuilder,
    private billS: BillsService,
    private commonS : InvoiceService) { }

  ngOnInit(): void {
    this.items = [{label: 'Bills'}, {label: 'Receipt Note'}, {label: 'Dashboard'}]
    this.getAllGR();
  }

  getAllGR()
  {
    this.submitted = true;
    this.billS.getAllGR().then(
      (res : any) => {
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
      }
    )
  }

  changeOrder(item : GoodsReceipt )
  {
    this.activeGR = item;
    this.getLines(item);
    this.getSoLines(item);
  }

  getSoLines(item:GoodsReceipt)
  {
     this.submitted = true;
     this.commonS.getLineitemsBySo(item.salesOrder).then(
      (res)=>{
        this.lineitems = res;
        this.grSubTotal = this.lineitems.reduce(
          (total, lineItem) => total + lineItem.amount, 0
        );
        this.submitted = false;
      }
     ).catch(
      (err)=>{
        console.log(err);
        this.submitted = false;
      }
     )
  }

  getLines(item:GoodsReceipt)
  {
    this.submitted  =true;
    this.billS
    .getLineItemsByGoodsReceiptId(item)
    .then((data: any) => {
      if (data) {
        this.activeGoodsReceiptLine = data[0];
        this.submitted= false;
      }
    }).catch(
      (err)=>{
        console.log(err);
        this.submitted= false;
      }
    )
  }

  CreateNewGR()
  {
    this.router.navigate(['/bills/goodsReceipt/create']); 
  }

  onEditRN(id:string)
  {
    this.router.navigate(['/bills/goodsReceipt/edit/'+id]); 
  }

  
  searchGR: any;
  searchGRs(value: any) {
    if (value === null) {
    //  alert(value);
      this.getAllGR();
    }
    else{
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

}
