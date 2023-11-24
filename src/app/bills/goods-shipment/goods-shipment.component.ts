import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { CompanyNew, SalesOrder } from 'src/app/invoice/invoice-model';
import { Product } from 'src/app/profile/profile-models';
import { CustomeR, Vendor } from 'src/app/settings/customers/customer';
import { GoodsShipment, PurchaseOrder } from '../bills-model';
import { MenuItem, MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { BillsService } from '../bills.service';
import { InvoiceService } from 'src/app/invoice/invoice.service';
import { PayPageService } from 'src/app/pay/pay-page.service';
import { AuthService } from 'src/app/auth/auth.service';
import { BreadCrumbService } from 'src/app/shared/navbar/bread-crumb.service';

@Component({
  selector: 'app-goods-shipment',
  templateUrl: './goods-shipment.component.html',
  styleUrls: ['./goods-shipment.component.scss']
})
export class GoodsShipmentComponent implements OnInit {


  submitted: boolean = false;
  createNew: boolean = false;
  DeleteDialLogvisible: boolean = false;

  id: string | null = '';
  gsForm !: FormGroup;
  gsLineForm !: FormGroup;

  vendors: Vendor[] = [];
  allPo: PurchaseOrder[] = [];

  products: Product[] = [];

  lineitems: any[] = [];
  currGoodsShipment: GoodsShipment = {};
  currPurchaseOrder: PurchaseOrder = {};

  editing: any;
  viewOnly: boolean = false;
  newRecord: boolean = false;
  isquantity: boolean = false;
  islineAvaliable: boolean = false;

  viewLineItemTable: boolean = false;

  uploadMessage = '';
  gsSubTotal: number = 0;

  mergedOptions: any[] = [];
  selectedOption: any;

  items!: MenuItem[];

  poLineItemsTotal: number = 0;
  currentLineTotal: number = 0;

  currentCompany: CompanyNew = {};
  currentVendor: Vendor = {};


  constructor(private router: Router,
    private route: ActivatedRoute,
    private message: MessageService,
    private fb: FormBuilder,
    private billS: BillsService,
    private invoiceS: InvoiceService,
    private usedService: PayPageService, private authS: AuthService, private breadcrumbS: BreadCrumbService) {
  }

  ngOnInit(): void {

    this.initForm();
    this.loadUser();
  }

  loadOtherInfo() {
    this.id = this.route.snapshot.paramMap.get('id');

    if (this.id === null) {
      this.breadcrumbS.breadCrumb([{ label: 'Goods Shipment', routerLink: ['/bills/goodsShipment'] }, { label: 'Create' }]);
    } else {
      this.breadcrumbS.breadCrumb([{ label: 'Goods Shipment', routerLink: ['/bills/goodsShipment'] }, { label: 'Edit' }]);
    }

    this.route.url.subscribe(segments => {
      let lastSegment = segments[segments.length - 1];
      if (lastSegment && lastSegment.path == 'create') {
        this.createNew = true;
      }
      else if (lastSegment && lastSegment.path == this.id) {
        this.createNew = true;
      }
      else {
        this.availableGS();
      }
    });

    // this.initForm();
    this.loadVendors();
    //this.loadCustomers();
    this.loadProducts();
    //this.loadSalesOrder();
    this.getGS();
  }

  createGS() {
    this.router.navigate(['/bills/goodsShipment/create']);
  }

  OnCancelGS() {
    this.createNew = false;
    this.router.navigate(['/bills/goodsShipment']);
  }

  atLeastOneRequired(control: AbstractControl): ValidationErrors | null {
    const customer = control.get('customer.id')?.value;
    const vendor = control.get('vendor.id')?.value;

    if (!customer && !vendor) {
      return { atLeastOneRequired: true };
    }

    return null;
  }


  initForm() {
    this.gsForm = new FormGroup({
      id: new FormControl(''),
      documentno: new FormControl(''),
      shipmentDate: new FormControl('', Validators.required),
      vendor: this.fb.group({
        id: this.fb.nonNullable.control('')
      }),
      purchaseOrder: this.fb.group({
        id: this.fb.nonNullable.control('', Validators.required)
      }),
      status: new FormControl(''),
    }, {
      validators: this.atLeastOneRequired.bind(this)
    });

    this.gsLineForm = new FormGroup({
      id: new FormControl(''),
      goodsShipment: this.fb.group({
        id: this.fb.nonNullable.control('')
      }),
      purchaseOrder: this.fb.group({
        id: this.fb.nonNullable.control('')
      }),
      orderedQty: new FormControl('', [Validators.required]),
      shippedQty: new FormControl('', [Validators.required]),
      confirmedQty: new FormControl('', [Validators.required])
    });
  }


  availableGS() {
    this.submitted = true;
    this.billS.getAllGS(this.currentUser).then((res) => {
      this.submitted = false;
      var count = res.length;
      //count=0
      if (count > 0) {
        this.router.navigate(['/bills/goodsShipments']);
      }
      else {
        this.createNew = false;
      }
    })
      .catch((err) => {
        this.submitted = false;
        console.log(err);
        this.message.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error While Fetching All Goods Shipments',
          life: 3000,
        });
      })
  }

  currentUser: any = {};
  loadUser() {
    this.submitted = true;
    this.authS.getUser().then((res: any) => {
      this.currentCompany = res.comapny;
      this.currentUser = res;
      this.submitted = false;

      this.loadOtherInfo();
    })
      .catch((err) => {
        console.log(err);
        this.submitted = false;
      })
  }

  loadPosByVendorId(vendorId: any) {
    //alert(JSON.stringify(vendorId));
    if (vendorId == null) {

    }
    else {

      this.submitted = true;
      this.invoiceS.getAllPoByVendorId(vendorId).then((res: any) => {
        this.allPo = res;
        this.submitted = false;
      })
        .catch((err) => {
          console.log(err);
          this.submitted = false;
          this.message.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error While Fetching All Sales Order of vendor',
            life: 3000,
          });
        })

    }

  }

  loadPos() {
    if (this.currentVendor.id == null) {

    }
    else {

      this.submitted = true;
      this.invoiceS.getAllPoByVendorId(this.currentVendor.id).then((res: any) => {
        this.allPo = res;
        this.submitted = false;
      })
        .catch((err) => {
          console.log(err);
          this.submitted = false;
          this.message.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error While Fetching All Sales Order of vendor',
            life: 3000,
          });
        })

    }

  }


  getGS() {
    if (this.id) {
      this.submitted = true;
      this.billS.getCurrentGs(this.id).then((goodShipment: any) => {
        goodShipment.shipmentDate = goodShipment.shipmentDate ? new Date(goodShipment.shipmentDate) : undefined;
        console.log(goodShipment);
        this.loadPosByVendorId(goodShipment.vendor.id);
        this.submitted = false;
        this.currGoodsShipment = goodShipment;

        this.currPurchaseOrder = goodShipment.purchaseOrder

          this.gsForm.patchValue(goodShipment);
          this.getLines(goodShipment.purchaseOrder);
          this.getLineItems(goodShipment);
        }
      ).catch(
        (err) => {
          console.log(err);
          this.submitted = false;
        })
    }
  }

  getLineItems(item: GoodsShipment) {

    this.submitted = true;
    this.billS
      .getLineItemsByGoodsShipmentId(item)
      .then((data: any) => {
        if (data) {
          var res = data;
          // alert(JSON.stringify(data[0] ) ) ;
          this.gsLineForm.value.id = data.id;
          //alert(this.gsLineForm.value.id  )  ;       
          this.gsLineForm.patchValue(res);
          this.submitted = false;
        }
      }).catch(
        (err) => {
          console.log(err);
          this.submitted = false;
        }
      )
  }

  getLines(po: PurchaseOrder | undefined) {
    this.submitted = true;
    this.billS.getLineitemsByPo(po).then((data: any) => {
      if (data) {
        this.lineitems = data;

        this.gsSubTotal = this.lineitems.reduce(
          (total, lineItem) => total + lineItem.amount, 0
        );

          this.poLineItemsTotal = this.lineitems.reduce(
            (total, lineItem) => total + lineItem.quantity, 0
          );
          this.currentLineTotal = this.poLineItemsTotal;
          this.submitted = false;
        }
        this.submitted = false;
      }

      // this.submitted = false;
    );
  }

  loadVendors() {
    this.submitted = true;
    this.usedService.allVendor(this.currentUser).then((res) => {
      this.vendors = res;
      console.log(res);
      this.submitted = false;
    })
      .catch((err) => {
        console.log(err);
        this.submitted = false;
      })
  }

  loadProducts() {
    this.submitted = true;
    this.usedService.allProduct(this.currentUser).then((res) => {
      this.products = res;
      console.log(res);
      this.submitted = false;
    })
      .catch((err) => {
        console.log(err);
        this.submitted = false;
        this.message.add({
          severity: 'error',
          summary: 'All Product error',
          detail: 'Error While Fetching All product Details',
          life: 3000,
        });
      })
  }

  selectVendor() {
    this.lineitems = [];
    this.gsSubTotal = 0;
    this.poLineItemsTotal = 0 ;
    if (this.currentVendor.id != null) {
      this.loadPos();
    }
  }

  selectPO(e: any) {
    if (e.value == null) {
      this.lineitems = [];
      this.gsSubTotal = 0;
      this.poLineItemsTotal = 0 ;
        }
    else {

      // this.lineitems = [];
      // this.gsSubTotal = 0 ;
      // this.gsLineForm.reset();

      this.submitted = true;
      var p = {
        'id': ""
      };
      p.id = e.value;
      this.currPurchaseOrder.id = e.value;
      this.billS.getLineitemsByPo(this.currPurchaseOrder).then((data: any) => {
        if (data) {
          this.lineitems = data;
          this.gsSubTotal = this.lineitems.reduce(
            (total, lineItem) => total + lineItem.amount, 0
          );

          this.poLineItemsTotal = this.lineitems.reduce(
            (total, lineItem) => total + lineItem.quantity, 0
          );

            this.currentLineTotal = this.poLineItemsTotal;
            this.submitted = false;
          }
        }).catch(
          (err) => {
            console.log(err);
            this.submitted = false;
          }
        );

    }
  }

  onSubmitGS() {
    // this.gsForm.value.company.id = '7f000101-8b5a-1044-818b-609cf78f001e'; // Sending manually till backend ready

    var gsFormVal = this.gsForm.value;
    gsFormVal.id = this.id;
    gsFormVal.comapny = this.currentCompany;
    gsFormVal.branch = this.currentUser.branch;

    if (gsFormVal.id) {
      this.submitted = true;
      this.billS.updateGoodsShipment(gsFormVal).then((res) => {
        console.log(res);
        this.gsForm.patchValue = { ...res };
        this.currPurchaseOrder = res.purchaseOrder;
        this.submitted = false;
        this.message.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Goods Shipment Saved',
          life: 3000,
        });
        setTimeout(() => {
          this.router.navigate(['/bills/goodsShipments']);
        }, 2000);
      })
        .catch(
          (err) => {
            console.log(err)
            this.submitted = false;
            this.message.add({
              severity: 'error',
              summary: 'Goods Shipment updated Error',
              detail: 'Goods Shipment Saved Error',
              life: 3000,
            });
          })
    }
    else {
      this.submitted = true;
      gsFormVal.status = 'DRAFT';
      gsFormVal.user = this.currentUser;

      this.billS.createGoodsShipment(gsFormVal).then((res) => {
        console.log(res);
        this.gsForm.patchValue = { ...res };
        this.currGoodsShipment = res;
        this.currPurchaseOrder = res.purchaseOrder;

        this.viewLineItemTable = true;
        this.submitted = false;
        this.message.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Goods Shipment Saved',
          life: 3000,
        });

        setTimeout(() => {
          this.router.navigate(['bills/goodsShipment/edit/' + res.id]);
        }, 2000);

        this.loadPoLineItems(this.gsForm.value.salesOrder);
      })
        .catch(
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

  loadPoLineItems(salesOrder: SalesOrder) {
    this.submitted = true;
    this.invoiceS.getLineitemsBySo(salesOrder).then((data: any) => {
      if (data) {
        this.lineitems = data;
        this.gsSubTotal = this.lineitems.reduce(
          (total, lineItem) => total + lineItem.amount, 0
        );
        this.submitted = false;
      }
    })
      .catch((err) => {
        console.log(err);
        this.submitted = false;
      });
  }

  onSubmitGSLine() {
    // Here you can write a code to submit the GS again if some thing is edited
    this.onSubmitGS();

    var gsFormVal = this.gsLineForm.value;
    // gsFormVal.id = this.gsLineForm.value.id;
    gsFormVal.goodsShipment.id = this.id;
    gsFormVal.purchaseOrder.id = this.currPurchaseOrder.id;
    gsFormVal.comapny = this.currentCompany;
    // alert(JSON.stringify(gsFormVal) );

    if (gsFormVal.id) {
      this.submitted = true;

      this.billS.updateGoodsShipmentLine(gsFormVal)
        .then((data: any) => {
          if (data) {
            this.submitted = false;
            // this.message.add({
            //   severity: 'success',
            //   summary: 'Success',
            //   detail: 'Goods Shipment Line Items Updated',
            //   life: 3000,
            // });
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
    else {

      this.submitted = true;
      this.billS.createGoodsShipmentLine(gsFormVal).then((data: any) => {
        if (data) {
          this.submitted = false;
          // this.message.add({
          //   severity: 'success',
          //   summary: 'Success',
          //   detail: 'Goods Shipment Line Items Saved',
          //   life: 3000,
          // });
        }
      })
        .catch(
          (err) => {
            console.log(err);
            this.submitted = false;
            this.message.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Goods Shipment Line Items Error',
              life: 3000,
            });
          });
      setTimeout(() => {
        this.router.navigate(['bills/goodsShipments']);
      }, 3000);

    }
  }

  validateOrderedQty() {
    if (Number(this.gsLineForm.value.orderedQty) > Number(this.currentLineTotal)) {
      this.message.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Order Quantity exceeded the limit ' + this.currentLineTotal,
        life: 3000,
      });
    }
  }

  validateConfirmedQty() {
    if (Number(this.gsLineForm.value.confirmedQty) > Number(this.gsLineForm.value.orderedQty)) {
      this.message.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Confirmed Quantity exceeded the limit ' + this.gsLineForm.value.orderedQty,
        life: 3000,
      });
    }
  }

  validateShippedQty() {
    if (Number(this.gsLineForm.value.shippedQty) > Number(this.gsLineForm.value.confirmedQty)) {
      this.message.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Shipped Quantity exceeded the limit ' + this.gsLineForm.value.confirmedQty,
        life: 3000,
      });
    }
  }

}


