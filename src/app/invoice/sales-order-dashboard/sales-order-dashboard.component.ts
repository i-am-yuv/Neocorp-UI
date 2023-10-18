import { Component, OnInit } from '@angular/core';
import { SalesOrder } from '../invoice-model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { InvoiceService } from '../invoice.service';

@Component({
  selector: 'app-sales-order-dashboard',
  templateUrl: './sales-order-dashboard.component.html',
  styleUrls: ['./sales-order-dashboard.component.scss']
})
export class SalesOrderDashboardComponent implements OnInit {

  submitted : boolean =  false;
  createNew : boolean =  false;

  allSalesOrder : any[] =  [] ;

  totalRecords : number = 0 ;
  activeOrder: SalesOrder = {} ;

  lineitems: any[] = [];
  soSubTotal: number = 0 ;

  items!: MenuItem[];


  constructor(private router: Router,
    private route: ActivatedRoute,
    private message: MessageService,
    private fb: FormBuilder,
    private invoiceS: InvoiceService,
    private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
    this.items = [{ label: 'Sales Orders', routerLink: ['/invoice/salesOrders'] }, ];

    this.getAllSalesOrders();
  }


  getAllSalesOrders()
  {
    this.submitted = true;
    this.invoiceS.getAllSo().then(
      (res : any) => {
        this.allSalesOrder = res.content;
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

  changeOrder(item : SalesOrder )
  {
     this.activeOrder = item;
    this.getLineItems(item);
  }

  getLineItems(item:SalesOrder)
  {
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
      (err)=>{
        console.log(err);
        this.submitted = false;
      }
    ) ;
  }

  CreateNewSalesOrder()
  {
    this.router.navigate(['/invoice/salesOrder/create']); 
  }

  onEditSO(id:string)
  {
    this.router.navigate(['/invoice/salesOrder/edit/'+id]); 
  }

}
