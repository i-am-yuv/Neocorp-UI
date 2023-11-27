import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Product } from 'src/app/profile/profile-models';
import { CustomeR, Vendor } from 'src/app/settings/customers/customer';
import { GoodsReceipt } from '../bills-model';
import { MenuItem, MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { BillsService } from '../bills.service';
import { PayPageService } from 'src/app/pay/pay-page.service';
import { CompanyNew, SalesOrder } from 'src/app/invoice/invoice-model';
import { InvoiceService } from 'src/app/invoice/invoice.service';
import { AuthService } from 'src/app/auth/auth.service';
import { BreadCrumbService } from 'src/app/shared/navbar/bread-crumb.service';

@Component({
  selector: 'app-goods-receipt',
  templateUrl: './goods-receipt.component.html',
  styleUrls: ['./goods-receipt.component.scss']
})
export class GoodsReceiptComponent implements OnInit {


  submitted: boolean = false;
  createNew: boolean = false;
  //DeleteDialLogvisible : boolean = false;

  id: string | null = '';
  grForm !: FormGroup;
  grLineForm !: FormGroup;

  allSo: SalesOrder[] = [];

  products: Product[] = [];

  lineitems: any[] = [];
  currGoodsReceipt: GoodsReceipt = {};
  currSalesOrder: SalesOrder = {};
  customers: CustomeR[] = [];
  currentCustomer: CustomeR = {};

  editing: any;
  viewOnly: boolean = false;
  newRecord: boolean = false;
  isquantity: boolean = false;
  islineAvaliable: boolean = false;

  viewLineItemTable: boolean = false;

  uploadMessage = '';
  grSubTotal: number = 0;

  mergedOptions: any[] = [];
  selectedOption: any;

  items!: MenuItem[];

  salesLineItemsTotal: number = 0;
  currentLineItemTotal: number = 0;

  currentCompany: CompanyNew = {};

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
      this.breadcrumbS.breadCrumb([{ label: 'Goods Receipt', routerLink: ['/bills/goodsReceipt'] }, { label: 'Create' }]);
    } else {
      this.breadcrumbS.breadCrumb([{ label: 'Goods Receipt', routerLink: ['/bills/goodsReceipt'] }, { label: 'Edit' }]);
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
        this.availableGR();
      }
    });

    this.loadCustomer();
    // this.loadSalesOrder();
    this.getGR();
  }

  loadCustomer() {
    this.usedService.allCustomer(this.currentUser).then(
      (res) => {
        this.customers = res;
        console.log(res);
      }
    ).catch(
      (err) => {
        console.log(err);
      }
    )
  }
  loadSalesOrderByCustomer(customerId: any) {
    this.submitted = true;
    this.invoiceS.getAllSoByCustomerId(customerId).then(
      (res: any) => {
        this.allSo = res;
        this.submitted = false;
      }
    ).catch(
      (err) => {
        console.log(err);
        this.submitted = false;
        this.message.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error While Fetching All The Sales Order of the customer ',
          life: 3000,
        });
      }
    )
  }

  createGR() {
    //this.createNew = true;
    this.router.navigate(['/bills/goodsReceipt/create']);
  }

  OnCancelGR() {
    this.createNew = false;
    this.router.navigate(['/bills/goodsReceipt']);
  }

  initForm() {
    this.grForm = new FormGroup({
      id: new FormControl(''),
      documentno: new FormControl(''),
      receivedDate: new FormControl('', Validators.required),
      customer: this.fb.group({
        id: this.fb.nonNullable.control('', Validators.required)
      }),
      salesOrder: this.fb.group({
        id: this.fb.nonNullable.control('', Validators.required)
      }),
      status: new FormControl('')
    });

    this.grLineForm = new FormGroup({
      id: new FormControl(''),
      goodsReceipt: this.fb.group({
        id: this.fb.nonNullable.control('')
      }),
      salesOrder: this.fb.group({
        id: this.fb.nonNullable.control('')
      }),
      orderedQty: new FormControl('', [Validators.required]),
      shippedQty: new FormControl('', Validators.required),
      confirmedQty: new FormControl('', Validators.required),
      receivedQty: new FormControl('', Validators.required)
    });
  }

  availableGR() {
    this.submitted = true;
    this.billS.getAllGR(this.currentUser).then(
      (res) => {
        this.submitted = false;
        var count = res.length;
        //count=0
        if (count > 0) {
          this.router.navigate(['/bills/goodsReceipts']);
        }
        else {
          this.createNew = false;
        }
      }
    ).catch(
      (err) => {
        this.submitted = false;
        console.log(err);
        this.message.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error While Fetching All The Goods Receipts',
          life: 3000,
        });
      }
    )
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

  loadSalesOrder() {
    this.submitted = true;
    this.invoiceS.getAllSoByCustomerId(this.currentCustomer).then(
      (res: any) => {
        this.allSo = res;
        this.submitted = false;
      }
    ).catch(
      (err) => {
        console.log(err);
        this.submitted = false;
        this.message.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error While Fetching All The Sales Order of the customer ',
          life: 3000,
        });
      }
    )
  }


  getGR() {
    if (this.id) {
      this.submitted = true;
      this.billS.getCurrentGr(this.id).then(
        (goodsReceipt: any) => {
          //  alert(JSON.stringify(goodsReceipt) );
          this.loadSalesOrderByCustomer(goodsReceipt.customer);
          goodsReceipt.receivedDate = goodsReceipt.receivedDate ? new Date(goodsReceipt.receivedDate) : undefined;

          this.currGoodsReceipt = goodsReceipt;
          this.currSalesOrder = goodsReceipt.salesOrder;

          this.submitted = false;
          this.grForm.patchValue(goodsReceipt);
          this.getLines(goodsReceipt?.salesOrder);
          this.getLineItemGR(goodsReceipt);
        }
      ).catch(
        (err) => {
          console.log(err);
          this.submitted = false;
        }
      )
    }
  }

  getLineItemGR(gr: GoodsReceipt) {
    this.submitted = true;
    this.billS
      .getLineItemsByGoodsReceiptId(gr)
      .then((data: any) => {
        if (data) {
          var res = data;
          this.grLineForm.patchValue(res);
          this.submitted = false;
        }
      }).catch(
        (err) => {
          console.log(err);
          this.submitted = false;
        }
      )
  }


  getLines(so: SalesOrder | undefined) {
    this.submitted = true;
    this.invoiceS.getLineitemsBySo(so)
      .then((data: any) => {
        if (data) {
          this.lineitems = data;

          this.grSubTotal = this.lineitems.reduce(
            (total, lineItem) => total + lineItem.amount, 0
          );

          this.salesLineItemsTotal = this.lineitems.reduce(
            (total, lineItem) => total + lineItem.quantity, 0
          );
          this.currentLineItemTotal = this.salesLineItemsTotal;

          this.submitted = false;
        }
        this.submitted = false;
      });
  }


  selectVendor() {
    this.lineitems = [];
    this.grSubTotal = 0;
    this.salesLineItemsTotal = 0;

    if (this.currentCustomer.id != null) {
      this.loadSalesOrder();
    }
  }

  selectSO(e: any) {
    //  alert( JSON.stringify(e) );

    if (e.value == null) {

      this.lineitems = [];
      this.grSubTotal = 0;
      this.salesLineItemsTotal = 0;
      //this.grLineForm.reset();
      // this.grLineForm.value.confirmedQty = '' ;
      // this.grLineForm.value.shippedQty = '' ;
      // this.grLineForm.value.receivedQty = '' ;

    }
    else {
      this.submitted = true;
      var p = {
        'id': ""
      };

      p.id = e.value;
      this.currSalesOrder.id = e.value;
      this.invoiceS.getLineitemsBySo(p).then((data: any) => {
        if (data) {
          this.lineitems = data;
          this.grSubTotal = this.lineitems.reduce(
            (total, lineItem) => total + lineItem.amount, 0
          );
          this.salesLineItemsTotal = this.lineitems.reduce(
            (total, lineItem) => total + lineItem.quantity, 0
          );
          this.currentLineItemTotal = this.salesLineItemsTotal;
          //  alert(this.currentLineItemTotal)
          this.submitted = false;
        }
      })
        .catch((err) => {
          console.log(err);
          this.submitted = false;
        });

    }

  }

  onSubmitGR() {
    //this.grForm.value.company.id = '7f000101-8b5a-1044-818b-609cf78f001e'; // Sending manually till backend ready
    var grFormVal = this.grForm.value;
    grFormVal.id = this.id;
    //grFormVal.comapny = this.currentCompany;  // Temp
    grFormVal.branch = this.currentUser.branch;

    if (grFormVal.id) {
      this.submitted = true;
      this.billS.updateGoodsReceipt(grFormVal).then((res) => {
        console.log(res);
        this.grForm.patchValue = { ...res };
        this.currSalesOrder = res.salesOrder;
        this.submitted = false;
        this.message.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Goods Receipt Saved',
          life: 3000,
        });
      })
        .catch((err) => {
          console.log(err)
          this.submitted = false;
          this.message.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Goods Receipt Updation Error',
            life: 3000,
          });
        })
    }
    else {
      this.submitted = true;
      grFormVal.user = this.currentUser;
      this.billS.createGoodsReceipt(grFormVal).then((res) => {
        console.log(res);
        this.grForm.patchValue = { ...res };
        this.currGoodsReceipt = res;
        this.currSalesOrder = res.salesOrder;

        this.viewLineItemTable = true;
        this.submitted = false;
        this.message.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Goods Receipt Saved Successfully',
          life: 3000,
        });

        setTimeout(() => {
          this.router.navigate(['bills/goodsReceipt/edit/' + res.id]);
        }, 2000);
        this.loadSalesOrderLineItems(this.grForm.value.salesOrder);
      })
        .catch((err) => {
          console.log(err);
          this.viewLineItemTable = false;
          this.submitted = false;
          this.message.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Goods Receipt Saving Error',
            life: 3000,
          });
        })
    }
  }

  loadSalesOrderLineItems(salesOrder: SalesOrder) {
    this.submitted = true;
    this.invoiceS.getLineitemsBySo(salesOrder).then((data: any) => {
      if (data) {
        this.lineitems = data;
        this.grSubTotal = this.lineitems.reduce(
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

  onSubmitGRLine() {
    // Here you can write a code to submit the GS again if some thing is edited
    this.onSubmitGR();

    var grFormVal = this.grLineForm.value;
    grFormVal.goodsReceipt.id = this.id;
    grFormVal.salesOrder.id = this.currSalesOrder.id;

    // grFormVal.comapny = this.currentCompany ;
    // alert(JSON.stringify(grFormVal));
    if (grFormVal.id) {
      this.submitted = true;
      this.billS.updateGoodsReceiptLine(grFormVal).then((data: any) => {
        if (data) {
          this.submitted = false;
          // this.message.add({
          //   severity: 'success',
          //   summary: 'Success',
          //   detail: 'Goods Receipt Line Items Saved',
          //   life: 3000,
          // });
          setTimeout(() => {
            this.router.navigate(['bills/goodsReceipts']);
          }, 2000);
        }
      })
        .catch((err) => {
          console.log(err);
          this.submitted = false;
          this.message.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Goods Receipt Line Items Updation Error',
            life: 3000,
          });
        });
    }
    else {
      this.submitted = true;
      this.billS.createGoodsReceiptLine(grFormVal).then((data: any) => {
        if (data) {
          this.submitted = false;
          this.message.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Goods Receipt Line Items Saved',
            life: 3000,
          });
          setTimeout(() => {
            this.router.navigate(['bills/goodsReceipts']);
          }, 2000);
        }
      })
        .catch((err) => {
          console.log(err);
          this.submitted = false;
          this.message.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Goods Receipt Line Items Error',
            life: 3000,
          });
        });
    }
  }
  //grLineForm.controls['orderedQty'].value > this.currentLineItemTotal

  orderValid: boolean = false;
  confirmedValid: boolean = false;
  shippedValid: boolean = false;
  receivedValid: boolean = false;

  isQuantityExceededOrdered(): boolean {
    const orderedQty1 = Number(this.grLineForm.controls['orderedQty'].value);
    const compareValue = Number(this.currentLineItemTotal);
    this.orderValid = (orderedQty1 > compareValue);
    return (orderedQty1 > compareValue);
  }

  isQuantityExceededConfirmed(): boolean {
    const confirmedQty1 = Number(this.grLineForm.controls['confirmedQty'].value);
    const orderedQty1 = Number(this.grLineForm.controls['orderedQty'].value);
    this.confirmedValid = (confirmedQty1 > orderedQty1);
    return (confirmedQty1 > orderedQty1);
  }

  isQuantityExceededShip(): boolean {
    const confirmedQty1 = Number(this.grLineForm.controls['confirmedQty'].value);
    const shippedQty1 = Number(this.grLineForm.controls['shippedQty'].value);
    this.shippedValid = (shippedQty1 > confirmedQty1);
    return (shippedQty1 > confirmedQty1);
  }
  isQuantityExceededReceived(): boolean {
    const receivedQty1 = Number(this.grLineForm.controls['receivedQty'].value);
    const shippedQty1 = Number(this.grLineForm.controls['shippedQty'].value);
    this.receivedValid = (receivedQty1 > shippedQty1);
    return (receivedQty1 > shippedQty1);
  }

  buttonDisabled()
  {
     var checkFirst = this.isQuantityExceededOrdered();
     var checkSec = this.isQuantityExceededConfirmed() ;
     var checkThird = this.isQuantityExceededShip() ;
     var checkFour = this.isQuantityExceededReceived() ;
    return !this.grLineForm.valid || !this.grForm.valid || this.grLineForm.value.orderedQty == 0 || checkFirst || checkSec || checkThird || checkFour ;
  }

}
