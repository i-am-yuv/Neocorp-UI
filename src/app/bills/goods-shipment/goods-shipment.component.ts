import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SalesOrder } from 'src/app/invoice/invoice-model';
import { Product } from 'src/app/profile/profile-models';
import { CustomeR, Vendor } from 'src/app/settings/customers/customer';
import { GoodsShipment } from '../bills-model';
import { MenuItem, MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { BillsService } from '../bills.service';
import { InvoiceService } from 'src/app/invoice/invoice.service';
import { PayPageService } from 'src/app/pay/pay-page.service';

@Component({
  selector: 'app-goods-shipment',
  templateUrl: './goods-shipment.component.html',
  styleUrls: ['./goods-shipment.component.scss']
})
export class GoodsShipmentComponent implements OnInit {

 
  submitted : boolean =  false;
  createNew : boolean = false;
  DeleteDialLogvisible : boolean = false;

  id: string | null = '';
  gsForm !: FormGroup ;
  gsLineForm !: FormGroup ;

  vendors: Vendor[] = [];
  customers : CustomeR[] =[] ;
  allSo : SalesOrder[] = [];
  
  products: Product[] = [];

  lineitems: any[] = [];
  currGoodsShipment: GoodsShipment = {};
  currSalesOrder : SalesOrder = {};

  editing: any;
  viewOnly: boolean = false;
  newRecord: boolean = false;
  isquantity: boolean = false;
  islineAvaliable: boolean = false;

  viewLineItemTable: boolean = false;

  uploadMessage = '';
  gsSubTotal: number = 0;

  mergedOptions: any[] = [];
  selectedOption : any;

  items!: MenuItem[];

  vendorVisible: boolean = false;
  customerVisible: boolean = false;

  salesLineItemsTotal : number = 0 ;

  billTo: any = [
    {
      "id": "1",
      "name": "Vendor"
    },
    {
      "id": "2",
      "name": "Customer"
    }
  ];

  constructor(private router: Router,
    private route: ActivatedRoute,
    private message: MessageService,
    private fb: FormBuilder,
    private billS: BillsService,
    private invoiceS : InvoiceService,
    private usedService : PayPageService) {     
     }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');

    this.route.url.subscribe(segments => {
      let lastSegment = segments[segments.length - 1];
      if (lastSegment && lastSegment.path == 'create') {
        this.createNew = true;
      } 
      else if(lastSegment && lastSegment.path == this.id){
        this.createNew =  true;
      }
      else{
        this.availableGS();
      }
    });

    this.items = [{label: 'Bills'},{label: 'Debit Note', routerLink: ['/bills/debitNotes']}, { label: 'Create', routerLink: ['/bills/debitNote/create'] }];

    this.initForm();
    this.loadVendors();
    this.loadCustomers();
    this.loadProducts();
    this.loadSalesOrder();
    this.getGS();
    
 //   this.bind();
    
  }
  createGS() {
    //this.createNew = true;
    this.router.navigate(['/bills/goodsShipment/create']);
  }

  OnCancelGS() {
    this.createNew = false;
    this.router.navigate(['/bills/goodsShipment']);
  }

  billToSelect() {
    if (this.gsForm.value.billToName == "Vendor") {
      this.vendorVisible = true;
      this.customerVisible = false;
    }
    else if (this.gsForm.value.billToName == "Customer") {
      this.customerVisible = true;
      this.vendorVisible = false;
    }
  }

  initForm() {
    this.gsForm = new FormGroup({
      id: new FormControl(''),
      documentno: new FormControl(''),
      shipmentDate: new FormControl('', Validators.required),
      vendor: this.fb.group({
        id: this.fb.nonNullable.control('')
      }),
      customer: this.fb.group({
        id: this.fb.nonNullable.control('')
      }),
      salesOrder: this.fb.group({
        id: this.fb.nonNullable.control('', Validators.required)
      }),
      company: this.fb.group({
        id: this.fb.nonNullable.control('')
      }),
      status: new FormControl('') ,
      billToName: new FormControl('') 
    });

    this.gsLineForm = new FormGroup({
      id: new FormControl(''),
      goodsShipment: this.fb.group({
        id: this.fb.nonNullable.control('')
      }),
      salesOrder: this.fb.group({
        id: this.fb.nonNullable.control('')
      }),
      orderedQty: new FormControl('',[Validators.required]) ,
      shippedQty: new FormControl('',Validators.required) ,
      confirmedQty: new FormControl('',Validators.required) 
    });
  }


  availableGS()
  {
    this.submitted = true;
    this.billS.getAllGS().then(
     (res) => {
       this.submitted = false;
       var count = res.totalElements ;
       //count=0
       if( count > 0 )
       {
         this.router.navigate(['/bills/goodsShipments']) ;
       }
       else{
         this.createNew = false;
       }
     }
   ).catch(
     (err) => {
      this.submitted = false;
       console.log(err);
     }
   )
  }

  loadCustomers() {
    this.usedService.allCustomer().then(
      (res) => {
        this.customers = res.content;
        console.log(res);
      }
    ).catch(
      (err) => {
        console.log(err);
      }
    )
  }

  loadSalesOrder()
  {
    this.submitted = true;
    this.invoiceS.getAllSo().then(
      (res : any) => {
        this.allSo = res.content;
        this.submitted = false;
      }
    ).catch(
      (err) => {
        console.log(err);
        this.submitted = false;
      }
    )
  }


  getGS() {
    if (this.id) {
      this.submitted = true;
      this.billS.getCurrentGs(this.id).then(
        (goodShipment: GoodsShipment) => {
          goodShipment.shipmentDate = goodShipment.shipmentDate ? new Date(goodShipment.shipmentDate) : undefined;
          console.log(goodShipment);
          this.submitted = false;
          this.currGoodsShipment = goodShipment;

          this.currSalesOrder.id =  goodShipment?.salesOrder?.id   ;

          this.gsForm.patchValue(goodShipment);
          this.getLines(goodShipment?.salesOrder ); //Because backend api is not ready
          this.getLineItems(goodShipment);
        }
      ).catch(
        (err) => {
          console.log(err);
          this.submitted = false;
        }
      )
    }
  }

  getLineItems(item:GoodsShipment)
  {
    this.submitted  =true;
    this.billS
    .getLineItemsByGoodsShipmentId(item)
    .then((data: any) => {
      if (data) {
        var res = data[0] ;
        // this.gsLineForm.value.orderedQty = res.orderedQty;
        // this.gsLineForm.value.confirmedQty = res.confirmedQty;
        // this.gsLineForm.value.shippedQty = res.shippedQty;
        this.gsLineForm.patchValue(res);
        this.submitted= false;
      }
    }).catch(
      (err)=>{
        console.log(err);
        this.submitted= false;
      }
    )
  }

  getLines(so: SalesOrder | undefined) {
    this.submitted = true;
    this.invoiceS.getLineitemsBySo(so)
      .then((data: any) => {
        if (data) {
          this.lineitems = data;
          
          this.gsSubTotal = this.lineitems.reduce(
            (total, lineItem) => total + lineItem.amount, 0
          );

          this.salesLineItemsTotal = this.lineitems.reduce(
            (total, lineItem) => total + lineItem.quantity, 0
          );

          this.submitted = false;
        }
        this.submitted = false;
      });
  }

  loadVendors() {
    this.submitted = true;
    this.usedService.allVendor().then(
      (res) => {
        this.vendors = res.content;
        console.log(res);
        this.submitted = false;
      }
    ).catch(
      (err) => {
        console.log(err);
        this.submitted = false;
      }
    )
  }

  loadProducts() {
    this.submitted = true;
    this.usedService.allProduct().then(
      (res) => {
        this.products = res.content;
        console.log(res);
        this.submitted = false;
      }
    )
      .catch(
        (err) => {
          console.log(err);
          this.submitted = false;
          this.message.add({
            severity: 'error',
            summary: 'All Product error',
            detail: 'Error While Fetching All product Details',
            life: 3000,
          });
        }
      )
  }
  selectVendor()
  {

  }

  selectSO(e : any){
  //  alert( JSON.stringify(e) );
  
    this.submitted = true;
    var p = {
      'id' : ""
    };
    p.id = e.value ;
    this.currSalesOrder.id = e.value ;
    this.invoiceS.getLineitemsBySo(p)
      .then((data: any) => {
        if (data) {
          this.lineitems = data;
          this.gsSubTotal = this.lineitems.reduce(
            (total, lineItem) => total + lineItem.amount, 0
          );
          this.submitted = false;
        }
      }).catch(
        (err) => {
          console.log(err);
          this.submitted = false;
        }
      );
  }

  onSubmitGS()
  {
    this.gsForm.value.company.id = '7f000101-8b5a-1044-818b-609cf78f001e'; // Sending manually till backend ready

    if (this.gsForm.value.vendor.id == null || this.gsForm.value.vendor.id == "") {
      this.gsForm.value.vendor = null;
    }
    else {
      this.gsForm.value.customer = null;
    }
    
    var gsFormVal = this.gsForm.value;
    gsFormVal.id = this.id;
    alert(JSON.stringify(gsFormVal));

    if (gsFormVal.id) {
      this.submitted = true;
      this.billS.updateGoodsShipment(gsFormVal).then(
        (res) => {
          console.log(res);
          this.gsForm.patchValue = { ...res };
          this.currSalesOrder = res.salesOrder ;
          this.submitted = false;
          this.message.add({
            severity: 'success',
            summary: 'Goods Shipment Updated',
            detail: 'Goods Shipment updated',
            life: 3000,
          });
        }
      ).catch(
        (err) => {
          console.log(err)
          this.submitted = false;
          this.message.add({
            severity: 'error',
            summary: 'Goods Shipment updated Error',
            detail: 'Goods Shipment Error',
            life: 3000,
          });
        }
      )
    }
    else {
      
      this.submitted =  true;
      gsFormVal.status = 'DRAFT';
      this.billS.createGoodsShipment(gsFormVal).then(
        (res) => {
          console.log(res);
          this.gsForm.patchValue = { ...res };
          this.currGoodsShipment = res;
          this.currSalesOrder = res.salesOrder ;
          console.log("Goods Shipment Added");
          console.log(this.currGoodsShipment);
          this.viewLineItemTable = true;
          this.submitted = false;
          this.message.add({
            severity: 'success',
            summary: 'Goods Shipment Saved',
            detail: 'Goods Shipment Saved',
            life: 3000,
          });

          setTimeout(() => {
            this.router.navigate(['bills/goodsShipment/edit/' + res.id]);
          }, 2000); 
          this.loadSalesOrderLineItems(this.gsForm.value.salesOrder) ;
        }
      ).catch(
        (err) => {
          console.log(err);
          this.viewLineItemTable = false;
          this.submitted = false;
          this.message.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Goods Shipment Error',
            life: 3000,
          });
        })
    }
  }

  loadSalesOrderLineItems(salesOrder : SalesOrder )
  {
    this.submitted = true;
    this.invoiceS.getLineitemsBySo(salesOrder)
      .then((data: any) => {
        if (data) {
          this.lineitems = data;
          this.gsSubTotal = this.lineitems.reduce(
            (total, lineItem) => total + lineItem.amount, 0
          );
          this.submitted = false;
        }
      }).catch(
        (err) => {
          console.log(err);
          this.submitted = false;
        }
      );
  }

  onSubmitGSLine()
  {
    // Here you can write a code to submit the GS again if some thing is edited
    this.onSubmitGS();
    var gsFormVal = this.gsLineForm.value;
    gsFormVal.goodsShipment.id = this.id ;
    gsFormVal.salesOrder.id =  this.currSalesOrder.id ;
    alert( JSON.stringify( this.gsLineForm.value));
   
    if( gsFormVal.id)
    {
    this.submitted = true;
    this.billS.updateGoodsShipmentLine(gsFormVal)
      .then((data: any) => {
        if (data) {
          this.submitted = false;
          this.message.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Goods Shipment Line Items Updated',
            life: 3000,
          });
        }
      }).catch(
        (err) => {
          console.log(err);
          this.submitted = false;
          this.message.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Goods Shipment Line Items Error',
            life: 3000,
          });
        }
      );
      
    }
    else{

      this.submitted = true;
    this.billS.createGoodsShipmentLine(gsFormVal)
      .then((data: any) => {
        if (data) {
          this.submitted = false;
          this.message.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Goods Shipment Line Items Saved',
            life: 3000,
          });
        }
      }).catch(
        (err) => {
          console.log(err);
          this.submitted = false;
          this.message.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Goods Shipment Line Items Error',
            life: 3000,
          });
        }
      );
    }
 
    setTimeout(() => {
      this.router.navigate(['bills/goodsShipments']);
    }, 3000);
    
  } 


}
