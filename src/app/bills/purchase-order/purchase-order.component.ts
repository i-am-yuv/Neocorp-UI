import { Component, NgModule, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { PayPageService } from 'src/app/pay/pay-page.service';
import { CustomeR, Vendor } from 'src/app/settings/customers/customer';
import { BillsService } from '../bills.service';
import { LineItem, PurchaseOrder } from '../bills-model';
import { Product } from 'src/app/profile/profile-models';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { AuthService } from 'src/app/auth/auth.service';
import { branch } from 'src/app/auth/auth-model';
import { ProfilepageService } from 'src/app/profile/profilepage.service';


@Component({
  selector: 'app-purchase-order',
  templateUrl: './purchase-order.component.html',
  styleUrls: ['./purchase-order.component.scss'],
})
export class PurchaseOrderComponent implements OnInit {

  createNew: boolean = false;
  submitted: boolean = false;
  sidebarVisibleProduct : boolean = false;

  currentVendor : Vendor = {};

  DeleteDialLogvisible: boolean = false;

  id: string | null = '';
  poForm!: FormGroup;
  productForm !: FormGroup ;
  lineItemForm !: FormGroup;
  enablePP: boolean = true;

  selectedVendor: Vendor = {};

  selectdate: any;
  vendors: Vendor[] = [];
  customers: CustomeR[] = [];
  products: Product[] = [];
  states: any[] = [];

  singleLineItem: LineItem = {};
  groupLineItem: LineItem[] = [];
  lineitems: any[] = [];
  category : any[] = [];
  currentPoOrder: PurchaseOrder = {};
  currentUser: any = {};

  editing: any;
  viewOnly: boolean = false;
  newRecord: boolean = false;
  isquantity: boolean = false;
  islineAvaliable: boolean = false;

  viewLineItemTable: boolean = false;

  uploadMessage = '';
  poSubTotal: number = 0.00;

  vendorVisible: boolean = false;
  customerVisible: boolean = false;

  items!: MenuItem[];

  productType: any = [
    {
      "id": "1",
      "name": "ITEM"
    },
    {
      "id": "2",
      "name": "SERVICE"
    }
  ];

  constructor(private router: Router,
    private route: ActivatedRoute,
    private message: MessageService,
    private fb: FormBuilder,
    private usedService: PayPageService,
    private billS: BillsService,
    private confirmationService: ConfirmationService,
    private authS: AuthService,
    private profileS : ProfilepageService) { }

  ngOnInit(): void {

    this.id = this.route.snapshot.paramMap.get('id');

    this.route.url.subscribe(segments => {
      let lastSegment = segments[segments.length - 1];
      if (lastSegment && lastSegment.path == 'create') {
        this.createNew = true;
      }
      else if (lastSegment && lastSegment.path == this.id) {
        this.createNew = true;
      }
      else {
        this.availablePO();
      }
    });

    this.items = [{label: 'Bills'},{ label: 'Purchase Order', routerLink: ['/bills/purchaseOrders'] }, { label: 'Create', routerLink: ['/bills/purchaseOrder/create'] }];

    this.sidebarVisibleProduct =  false;

    this.initForm();
    this.poForm.value.enablePartialPayments = false;
    this.loadVendors();
    this.loadCustomers();
    this.loadProducts();
    this.loadState();
    this.getPoOrder();
    this.loadUser();
  }

  availablePO() {
    this.submitted = true;
    this.billS.getAllPo().then(
      (res) => {
        this.submitted = false;
        var count = res.totalElements;
        //count=0
        if (count > 0) {
          this.router.navigate(['/bills/purchaseOrders']);
        }
        else {
          this.createNew = false;
        }
      }
    ).catch(
      (err) => {
        console.log(err);
        this.submitted = false;
      }
    )

  }

  initForm() {
    this.poForm = new FormGroup({
      id: new FormControl(''),
      orderNumber: new FormControl(''),
      dueDate: new FormControl('', Validators.required),
      orderDate: new FormControl('', Validators.required),
      status: new FormControl(''),
      description: new FormControl(''),
      enablePartialPayments: new FormControl(false),
      internslNotes: new FormControl(''),
      vendor: this.fb.group({
        id: this.fb.nonNullable.control('')
      }),
      placeOfSupply: this.fb.group({
        id: this.fb.nonNullable.control('', Validators.required)
      }),
      grossTotal: new FormControl(''),
      branch: new FormControl('')
    });

    this.lineItemForm = new FormGroup(
      {
        expenseName: this.fb.group(
          {
            id: this.fb.nonNullable.control('', {
              validators: Validators.required
            })
          }),
        unitPrice: new FormControl('')
      }
    )



  }

  getPoOrder() {
    if (this.id) {
      this.submitted = true;
      this.billS.getCurrentPo(this.id).then(
        (order: PurchaseOrder) => {
          order.dueDate = order.dueDate ? new Date(order.dueDate) : undefined;
          order.orderDate = order.orderDate ? new Date(order.orderDate) : undefined;
          console.log(order);
          this.currentPoOrder = order;
          this.poForm.patchValue(order);
          this.submitted = false;
          this.getLines(order); //Because backend api is not ready
        }
      ).catch(
        (err) => {
          console.log(err);
          this.submitted = false;
        }
      )
    }

  }

  loadUser() {
    this.submitted = true;
    this.authS.getUser().then(
      (res: any) => {
        this.currentUser = res;
        this.submitted = false;
      }
    ).catch(
      (err) => {
        console.log(err);
        this.submitted = false;
      }
    )
  }

  getLines(order: PurchaseOrder) {
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
      }).catch(
        (err) => {
          console.log(err);
          this.submitted = false;
        }
      );
  }

  loadVendors() {
    this.usedService.allVendor().then(
      (res) => {
        this.vendors = res.content;
        console.log(res);
      }
    ).catch(
      (err) => {
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

  loadProducts() {
    this.usedService.allProduct().then(
      (res) => {
        this.products = res.content;
        console.log(res);
      }
    )
      .catch(
        (err) => {
          console.log(err);
          this.message.add({
            severity: 'error',
            summary: 'All Product error',
            detail: 'Error While Fetching All product Details',
            life: 3000,
          });
        }
      )
  }

  loadState() {
    this.usedService.allState().then(
      (res) => {
        this.states = res.content;
        console.log(res);
      }
    ).catch(
      (err) => {
        console.log(err);
      }
    )
  }


  finalPoSubmit: boolean = false;

  onSubmitPO() {
    //this.poForm.value.customer = null;
    //this.poForm.value.purchaseFrom = null;

    this.poForm.value.branch = this.currentUser.branch;

    var poFormVal = this.poForm.value;
    poFormVal.id = this.id;
    alert(JSON.stringify(poFormVal));

    if (poFormVal.id) {

      this.submitted = true;
      this.billS.updatePurchaseorder(poFormVal).then(
        (res) => {
          console.log(res);
          this.poForm.patchValue = { ...res };
          this.submitted = false;
          this.message.add({
            severity: 'success',
            summary: 'Purchase order Updated',
            detail: 'Purchase Order updated',
            life: 3000,
          });
        }
      ).catch(
        (err) => {
          console.log(err);
          this.submitted = false;
          this.message.add({
            severity: 'error',
            summary: 'Purchase Order updated Error',
            detail: 'Some Server Error',
            life: 3000,
          });
        }
      )
    }
    else {
      this.upload(); // for upload file if attached
      this.submitted = true;
      poFormVal.grossTotal = null;
      poFormVal.requestStatus = 'DRAFT';
     // poFormVal.orderNumber = null;
      this.billS.createPurchaseorder(poFormVal).then(
        (res) => {
          console.log(res);
          this.poForm.patchValue = { ...res };
          this.currentPoOrder = res;
          // this.id = res.id;
          console.log("Po Order");
          console.log(this.currentPoOrder);
          this.viewLineItemTable = true;
          this.submitted = false;
          this.message.add({
            severity: 'success',
            summary: 'Purchase order Saved',
            detail: 'Purchase Order Added',
            life: 3000,
          });
          this.router.navigate(['bills/purchaseOrder/edit/' + res.id]);
        }
      ).catch(
        (err) => {
          console.log(err);
          this.viewLineItemTable = false;
          this.submitted = false;
          this.message.add({
            severity: 'error',
            summary: 'Purchase Order error',
            detail: 'Some Server Error',
            life: 3000,
          });
        })
    }
  }

  selectVendor() {
    // var vendor = this.vendors.find(
    //   (t) => t.id === this.poForm.value.vendor  
    //   );
    // this.selectedVendor = vendor ? vendor : {};
    // if (this.selectedVendor.id) {
    //   this.poForm.value.vendor.id = this.selectedVendor.id ;
    // }
    // else{
    //   this.poForm.value.vendor = null;
    // }
  }

  setLineValues(lineItem: LineItem) {
    var dc = this.products.find((t) => t.id === lineItem.expenseName?.id);
    // poline.unitprice = dc.sellingPrice;

    // poline.quantity = poline.quantity ? poline.quantity : 1;

    // poline.linetotal = dc.sellingPrice * poline.quantity;

  }

  setLineQtyValuesQuantity(e: any, lineItem: LineItem) {
    if (e.value == null || e.value == 0) {
      this.isquantity = false;
    }
    if (e.value) {
      lineItem.quantity = e.value;
      this.setLineValues(lineItem);
      this.isquantity = true;
    }
  }

  setLineQtyValuesPrice(e: any, lineItem: LineItem) {

  }

  setLineQtyValuesDiscount(e: any, lineItem: LineItem) {

  }


  onRowEditInit(lineItem: LineItem) {

  }
  delete(lineItem: LineItem) {
    this.DeleteDialLogvisible = true;
  }

  deleteConfirm(lineItem: LineItem) {
    this.submitted = true;
    this.billS
      .deleteLineItem(lineItem.id)
      .then((data) => {
        this.lineitems = this.lineitems.filter(
          (val) => val.id !== lineItem.id
        );

        this.poSubTotal = this.lineitems.reduce(
          (total, lineItem) => total + lineItem.amount, 0
        );

        this.DeleteDialLogvisible = false;
        this.submitted = false;
        this.message.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Line Item Deleted',
          life: 3000,
        });
      })
      .catch((err) => {
        console.log(err);
        this.submitted = false;
        this.DeleteDialLogvisible = false;
        this.message.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Line item Deletion Error, Please refresh and try again',
          life: 3000,
        });
      });
  }

  cancelDeleteConfirm() {
    this.DeleteDialLogvisible = false;
  }

  onRowEditSave(lineItem: LineItem) {
  //  alert(JSON.stringify(lineItem));
    var currentProduct = this.products.find((t) => t.id === lineItem.expenseName?.id);
    alert(JSON.stringify(currentProduct));
    if (lineItem.discount == null || lineItem.discount == 0) {

    }
    if (lineItem.unitPrice == null || lineItem.unitPrice == 0) {
      lineItem.unitPrice = currentProduct?.mrp;
    }
    if (currentProduct == null || currentProduct == undefined) {
      console.log("ADD product");
      this.message.add({
        severity: 'error',
        summary: 'Product Add Error',
        detail: 'Please Select the Product',
        life: 3000,
      });
    }
    else {
      lineItem.expenseName = currentProduct;
      lineItem.purchaseOrder = this.currentPoOrder; // this line will be change

      this.newRecord = false;
      this.islineAvaliable = true;
      console.log(lineItem);

      var _lineItem = lineItem;

      if (_lineItem.id) {
        alert("Update Line Item Entered");
        // line line item should have id inside
        this.submitted = true;
        this.usedService.updateLineItem(lineItem).then(
          (res) => {
            console.log("Line Item Updated Successfully");
            _lineItem = res;
            // this.lineitem.Amount = res.Amount;
            this.getPoOrder();
            this.submitted = false;
            this.message.add({
              severity: 'success',
              summary: 'Line item Updated',
              detail: 'Line item Updated Successfully',
              life: 3000,
            });
          }
        ).catch(
          (err) => {
            console.log("Line Item Updated Error");
            this.submitted = false;
            this.message.add({
              severity: 'error',
              summary: 'Line item Update Error',
              detail: 'Error While updating Line Item',
              life: 3000,
            });
          }
        )
      }
      else {
        this.submitted = true;
        this.usedService.createLineItem(lineItem).then(
          (res) => {
            console.log(res);
            _lineItem = res;
            this.getPoOrder();
            this.submitted = false;
            this.message.add({
              severity: 'success',
              summary: 'Line item Added',
              detail: 'Line item Added Successfully',
              life: 3000,
            });
          }
        ).catch((err) => {
          console.log(err);
          this.submitted = false;
          this.message.add({
            severity: 'error',
            summary: 'Line Item Error',
            detail: 'Error while Adding Line Item',
            life: 3000,
          });
        })
      }
    }

  }

  onRowEditCancel(lineItem: LineItem, index: any) {
    if (this.newRecord) {
      this.lineitems.splice(index, 1);
    }
    this.newRecord = false;
    this.islineAvaliable = false;
  }
  newRow(): any {
    this.isquantity = true;
    return { expenseName: {}, quantity: 1 };
  }

  // my code
  enableRowSubmit() {
    this.editing = true;
  }

  selectedFiles?: FileList;
  currentFile?: File;
  progress = 0;

  selectFile(event: any) {
    this.selectedFiles = event.target.files;
    this.message.add({
      severity: 'success',
      summary: 'File Attached',
      detail: 'File Attached Successfully ',
      life: 3000,
    });
  }

  upload() {
    if (this.selectedFiles) {
      this.submitted = true;
      const file: File | null = this.selectedFiles.item(0);
      //var data = this.productForm.value;
      //console.log(this.productForm.value);
      //var jsonString = JSON.stringify(this.productForm.value);
      if (file) {
        this.currentFile = file;
        this.submitted = true;
        this.usedService.fileUploadForPurchaseOrder(this.id, this.currentFile).subscribe({
          next: (event: any) => {
            if (event.type === HttpEventType.UploadProgress) {
              this.progress = Math.round((100 * event.loaded) / event.total);
            } else if (event.ok == true) {
              // this.message = event.body.message;
              this.submitted = false;
              // this.message.add({
              //   severity: 'success',
              //   summary: 'Success',
              //   detail: 'File Added Successfully ',
              //   life: 3000,
              // });
              // this.fileInfos = this.uploadService.getFiles();
            }
          },
          error: (err: any) => {
            console.log(err);
            this.progress = 0;
            this.submitted = false;
            if (err.error && err.error.message) {
              this.message = err.error.message;
              this.uploadMessage = 'Could not upload the file!';
              this.message.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Issue happend while creation ',
                life: 3000,
              });
            } else {
              // this.uploadMessage = 'Could not upload the file!';
              // this.message.add({
              //   severity: 'error',
              //   summary: 'Error',
              //   detail: 'Issue Happed in File upload',
              //   life: 3000,
              // });
              console.log("Some Issue while uploading file, Please check");
            }
            this.currentFile = undefined;
          },
        });

      }
      // this.productForm.reset();
      //this.selectedFiles = undefined;
      this.submitted = false;
    }
  }

  finalPoSubmitPage() {
    // updated complete PO so that gross total can be updated
    this.submitted = true;
    var poFormVal = this.poForm.value;
    poFormVal.id = this.id;
    poFormVal.grossTotal = this.poSubTotal;
    if (poFormVal.id) {
      //this.poForm.value.id = poFormVal.id;
      this.submitted = true;
      this.billS.updatePurchaseorder(poFormVal).then(
        (res) => {
          console.log(res);
          this.poForm.patchValue = { ...res };
          this.submitted = false;
          this.message.add({
            severity: 'success',
            summary: 'Purchage Order Updated Successfully',
            detail: 'Purchase Order Updated',
            life: 3000
          })
          setTimeout(() => {
            this.router.navigate(['/bills/purchaseOrder']);
          }, 2000);
        }
      ).catch(
        (err) => {
          console.log(err);
          this.submitted = false;
        }
      )
    } else {
      this.upload();
      this.message.add({
        severity: 'success',
        summary: 'Purchase Order Created Successfully',
        detail: 'Purchase Order created',
        life: 3000,
      });
      setTimeout(() => {
        this.router.navigate(['/bills/purchaseOrder']);
      }, 2000);
    }


  }

  createPO() {
    //this.createNew = true;
    this.router.navigate(['/bills/purchaseOrder/create']);
  }

  OnCancelPO() {
    //this.createNew = false;
    this.router.navigate(['/bills/purchaseOrder']);

  }
}
