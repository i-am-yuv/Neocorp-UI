import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { BillsService } from '../bills.service';
import { GoodsShipment, GoodsShipmentLine } from '../bills-model';

@Component({
  selector: 'app-goods-shipment-dashboard',
  templateUrl: './goods-shipment-dashboard.component.html',
  styleUrls: ['./goods-shipment-dashboard.component.scss']
})
export class GoodsShipmentDashboardComponent implements OnInit {

  submitted : boolean = false;

  allGS : any[] =  [] ;

  totalRecords : number = 0 ;
  activeGS: GoodsShipment = {} ;

  activeGoodsShipmentLine : GoodsShipmentLine = {};

  lineitems: any[] = [];
  gsSubTotal: number = 0 ;

  items!: MenuItem[]

  constructor(private router: Router,
    private route: ActivatedRoute,
    private message: MessageService,
    private fb: FormBuilder,
    private billS: BillsService) { }

  ngOnInit(): void {
    this.items = [{label: 'Bills'}, {label: 'Receipt Note'}, {label: 'Dashboard'}]
    this.getAllGS();
  }

  getAllGS()
  {
    this.submitted = true;
    this.billS.getAllGS().then(
      (res : any) => {
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
      }
    )
  }

  changeOrder(item : GoodsShipment )
  {
    this.activeGS = item;
    this.getLines(item);
  }

  getLines(item:GoodsShipment)
  {
    this.submitted  =true;
    this.billS
    .getLineItemsByGoodsShipmentId(item)
    .then((data: any) => {
      if (data) {
        this.activeGoodsShipmentLine = data;
        this.submitted= false;
      }
    }).catch(
      (err)=>{
        console.log(err);
        this.submitted= false;
      }
    )
  }

  CreateNewGS()
  {
    this.router.navigate(['/bills/goodsShipment/create']); 
  }

  onEditRN(id:string)
  {
    this.router.navigate(['/bills/goodsShipment/edit/'+id]); 
  }

  
  searchGS: any;
  searchGSs(value: any) {
    if (value === null) {
    //  alert(value);
      this.getAllGS();
    }
    else{
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
  
}
