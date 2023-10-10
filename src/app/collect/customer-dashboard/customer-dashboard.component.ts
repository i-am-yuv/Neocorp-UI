import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { PurchaseOrder } from 'src/app/bills/bills-model';
import { BillsService } from 'src/app/bills/bills.service';
import { PayPageService } from 'src/app/pay/pay-page.service';
import { CustomeR, Customer } from 'src/app/settings/customers/customer';
import { CollectService } from '../collect.service';

@Component({
  selector: 'app-customer-dashboard',
  templateUrl: './customer-dashboard.component.html',
  styleUrls: ['./customer-dashboard.component.scss']
})
export class CustomerDashboardComponent implements OnInit {

  submitted : boolean = false;

  allCustomers : any[] = [];
  totalRecords: number = 0 ;

  
  
  activeCustomer: CustomeR = {};
  lineitems: any[] = [];
  poSubTotal: number = 0 ;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private message: MessageService,
    private fb: FormBuilder,
    private usedService: PayPageService,
    private collect1: CollectService,
    private confirmationService: ConfirmationService) { }

  ngOnInit(): void {

    this.loadCustomer();
  }

  loadCustomer()
  {
    this.submitted = true;
    this.collect1.getAllCustomers().then(
      (res:any) => {
         console.log(res) ;
         this.allCustomers = res.content ;
         this.totalRecords = res.totalElements;
         this.submitted = false;
      }
    ).catch(
      (err) => {
        console.log(err);
      }
    )
    
  }

  changeOrder( po : Customer)
  {
    this.activeCustomer = po;
    this.getOrderLines(po);
  }

  getOrderLines(order:Customer)
  {
    this.submitted = true;
    this.collect1
    // .getLineitemsByCustomer(order)
    .getAllCustomers()
    .then((data: any) => {
      if (data) {
        this.lineitems = data;
        this.poSubTotal = this.lineitems.reduce(
          (total, lineItem) => total + lineItem.amount, 0
        );
      }
      this.submitted = false ;
    });
    
  }

  CreateNewCustomer()
  {
    this.router.navigate(['/collect/createCustomer']);
  }

  onEditCustomer(id:string)
  {
    this.router.navigate(['/collect/edit/'+id]); 
  }
  

}
