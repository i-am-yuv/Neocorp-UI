import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Product, State } from 'src/app/profile/profile-models';
import { Vendor } from 'src/app/settings/customers/customer';
import { CompanyNew, SalesOrder, SalesOrderLine } from '../invoice-model';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { PayPageService } from 'src/app/pay/pay-page.service';
import { InvoiceService } from '../invoice.service';
import { HttpEventType } from '@angular/common/http';
import { AuthService } from 'src/app/auth/auth.service';
import { BreadCrumbService } from 'src/app/shared/navbar/bread-crumb.service';

@Component({
  selector: 'app-sales-order',
  templateUrl: './sales-order.component.html',
  styleUrls: ['./sales-order.component.scss']
})
export class SalesOrderComponent implements OnInit {

  id: string | null = '';
  soForm!: FormGroup;
  DeleteDialLogvisible: boolean = false;

  submitted: boolean = false;
  createNew: boolean = false;

  customers: Vendor[] = [];
  products: Product[] = [];
  states: State[] = [];

  lineitems: any[] = [];
  currentSoOrder: SalesOrder = {};

  editing: any;
  viewOnly: boolean = false;
  newRecord: boolean = false;
  isquantity: boolean = false;
  islineAvaliable: boolean = false;

  viewLineItemTable: boolean = false;

  uploadMessage = '';
  soSubTotal: number = 0;
  currentUser: any = {};
  // currentCompany : any = {};

  items!: MenuItem[];
  sidebarVisibleProduct: boolean = false;
  currentCompany: CompanyNew = {};

  constructor(private router: Router,
    private route: ActivatedRoute,
    private message: MessageService,
    private fb: FormBuilder,
    private usedService: PayPageService,
    private invoiceS: InvoiceService,
    private authS: AuthService, private breadcrumbS: BreadCrumbService) { }

  ngOnInit(): void {

    this.initForm();
    this.loadUser();
  }

  loadOtherInfo() {
    this.id = this.route.snapshot.paramMap.get('id');

    if (this.id === null) {
      this.breadcrumbS.breadCrumb([{ label: 'Sales Order', routerLink: ['/invoice/salesOrders'] }, { label: 'Create' }]);
    } else {
      this.breadcrumbS.breadCrumb([{ label: 'Sales Order', routerLink: ['/invoice/salesOrders'] }, { label: 'Edit' }]);
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
        this.availableSO();
      }
    });

    this.sidebarVisibleProduct = false;

    this.soForm.value.enablePartialPayments = false;
    this.loadCustomer();
    this.loadProducts();
    this.loadState();
    this.getSoOrder();
  }

  initForm() {

    this.soForm = new FormGroup({
      id: new FormControl(''),
      orderNumber: new FormControl(''),
      dueDate: new FormControl('', Validators.required),
      billDate: new FormControl('', Validators.required),
      termsOfPayments: new FormControl(''),
      termsOfDelivery: new FormControl(''),
      customer: this.fb.group({
        id: this.fb.nonNullable.control('', {
          validators: Validators.required,
        })
      }),
      placeOfSupply: this.fb.group({
        id: this.fb.nonNullable.control('', {
          validators: Validators.required,
        })
      }),
      grossTotal: new FormControl('')
    });

  }


  minEndDate!: Date;

  updateEndDateMinDate(selectedStartDate: Date) {
    // Update the minimum end date based on the selected start date
    this.minEndDate = selectedStartDate;
  }

  availableSO() {
    this.submitted = true;
    this.invoiceS.getAllSo(this.currentUser).then(
      (res) => {
        this.submitted = false;
        var count = res.length;
        //count=0
        if (count > 0) {
          this.router.navigate(['/invoice/salesOrders']);
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
          detail: 'Error While Fetching All Sales Order Details',
          life: 3000,
        });
      }
    )
  }

  getSoOrder() {
    if (this.id) {
      this.submitted = true;
      this.invoiceS.getCurrentSo(this.id).then(
        (salesOrder: SalesOrder) => {
          salesOrder.dueDate = salesOrder.dueDate ? new Date(salesOrder.dueDate) : undefined;
          salesOrder.billDate = salesOrder.billDate ? new Date(salesOrder.billDate) : undefined;
          console.log(salesOrder);

          this.currentSoOrder = salesOrder;
          this.soForm.patchValue(salesOrder);
          this.submitted = false;
          this.getLines(salesOrder); //Because backend api is not ready
        }
      ).catch(
        (err) => {
          console.log(err);
          this.submitted = false;
          this.message.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error While Fetching This Sales Order Details',
            life: 3000,
          });
        }
      )
    }
  }

  getLines(salesOrder: SalesOrder) {
    this.submitted = true;
    this.invoiceS.getLineitemsBySo(salesOrder)
      .then((data: any) => {
        if (data) {
          this.lineitems = data;
          this.soSubTotal = this.lineitems.reduce(
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

  loadProducts() {
    this.submitted = true;
    this.usedService.allProduct(this.currentUser).then(
      (res) => {
        this.products = res;
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
  // loadUser() {
  //   this.submitted = true;
  //   this.authS.getUser().then(
  //     (res: any) => {
  //       this.currentUser = res;
  //       this.currentCompany = res.comapny;
  //       this.submitted = false;
  //     }
  //   ).catch(
  //     (err) => {
  //       console.log(err);
  //       this.submitted = false;
  //     }
  //   )
  // }

  loadUser() {
    this.submitted = true;
    this.authS.getUser().then((res: any) => {
      this.currentUser = res;
      this.currentCompany = res.company;
      this.submitted = false;

      this.loadOtherInfo();
    })
      .catch((err) => {
        console.log(err);
        this.submitted = false;
      })
  }


  onSubmitSO() {
    this.soForm.value.branch = this.currentUser.branch;

    var soFormVal = this.soForm.value;
    soFormVal.id = this.id;
    soFormVal.company = this.currentCompany;

    if (soFormVal.id) {
      this.submitted = true;
      this.invoiceS.updateSalesOrder(soFormVal).then(
        (res) => {
          console.log(res);
          this.soForm.patchValue = { ...res };
          this.submitted = false;
          this.message.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Sales Order updated Successfully',
            life: 3000,
          });
        }
      ).catch(
        (err) => {
          console.log(err);
          this.submitted = false;
          this.message.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error while updating the sales order',
            life: 3000,
          });
        }
      )
    }
    else {

      this.submitted = true;
      soFormVal.grossTotal = null;
      soFormVal.user = this.currentUser;
      this.invoiceS.createSalesOrder(soFormVal).then(
        (res) => {
          console.log(res);
          this.soForm.patchValue = { ...res };
          this.currentSoOrder = res;

          this.viewLineItemTable = true;
          this.submitted = false;
          this.message.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Sales Order Saved Successfully',
            life: 3000,
          });
          this.router.navigate(['invoice/salesOrder/edit/' + res.id]);
        }
      ).catch(
        (err) => {
          console.log(err);
          this.viewLineItemTable = false;
          this.submitted = false;
          this.message.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error while saving the sales order',
            life: 3000,
          });
        })
    }
  }


  selectVendor() { }

  setLineValues(lineItem: SalesOrderLine) {
    var dc = this.products.find((t) => t.id === lineItem.expenseName?.id);

    // here i need to get all the info regarding this product from product id

    this.submitted = true;
    this.usedService.getCurrentproduct(lineItem.expenseName).then(
      (res) => {
        console.log(res);
        lineItem.unitPrice = res.mrp;
        this.submitted = false;
      }
    )
      .catch(
        (err) => {
          console.log(err);
          this.submitted = false;
          this.message.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Please select the product',
            life: 3000,
          });
        }
      )
  }

  setLineQtyValuesQuantity(e: any, lineItem: SalesOrderLine) {
    if (e.value == null || e.value == 0) {
      this.isquantity = false;
    }
    if (e.value) {
      lineItem.quantity = e.value;
      this.setLineValues(lineItem);
      this.isquantity = true;
    }
  }

  setLineQtyValuesPrice(e: any, lineItem: SalesOrderLine) { }

  setLineQtyValuesDiscount(e: any, lineItem: SalesOrderLine) { }

  onRowEditInit(lineItem: SalesOrderLine) { }


  currentDeleteLineItem: any;
  delete(lineItem: SalesOrderLine) {
    this.DeleteDialLogvisible = true;
    this.currentDeleteLineItem = lineItem;
    //alert(JSON.stringify(this.currentDeleteLineItem));
  }

  onRowEditSave(lineItem: SalesOrderLine) {

    if (
      (((lineItem.unitPrice ? lineItem.unitPrice : 0) * (lineItem.quantity ? lineItem.quantity : 0)) - (lineItem?.discount ? lineItem?.discount : 0)) < 0
    ) {
      console.log("discount");
      this.message.add({
        severity: 'error',
        summary: 'discount Error',
        detail: 'Discount limit exceeded',
        life: 3000,
      });
      this.getLines(this.currentSoOrder);
      this.newRecord = false;
    }
    else {

      var currentProduct = this.products.find((t) => t.id === lineItem.expenseName?.id);
      console.log("current Product"); console.log(currentProduct);
      if (lineItem.discount == null || lineItem.discount == 0) {

      }
      if (lineItem.unitPrice == null || lineItem.unitPrice == 0) {
        lineItem.unitPrice = currentProduct?.mrp;
      }
      if (currentProduct == null || currentProduct == undefined || lineItem.expenseName == null) {
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
        lineItem.salesOrder = this.currentSoOrder; // this line will be change

        this.newRecord = false;
        this.islineAvaliable = true;
        console.log(lineItem);

        var _lineItem = lineItem;

        if (_lineItem.id) {
          this.submitted = true;
          this.invoiceS.updateSoLineItem(lineItem).then(
            (res) => {

              _lineItem = res;
              // this.getSoOrder();
              this.getLines(this.currentSoOrder);
              this.submitted = false;
              this.message.add({
                severity: 'success',
                summary: 'Success',
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
                summary: 'Error',
                detail: 'Error While updating Line Item',
                life: 3000,
              });
            }
          )
        }
        else {
          this.submitted = true;
          this.invoiceS.createSoLineItem(lineItem).then(
            (res) => {
              console.log(res);
              _lineItem = res;
              // this.getSoOrder();
              this.getLines(this.currentSoOrder);
              this.submitted = false;
              this.message.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Line item Added Successfully',
                life: 3000,
              });
            }
          ).catch((err) => {
            console.log(err);
            this.submitted = false;
            this.message.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error while Adding Line Item',
              life: 3000,
            });
          })
        }
      }
    }
  }

  onRowEditCancel(lineItem: SalesOrderLine, index: any) {
    if (this.newRecord) {
      this.lineitems.splice(index, 1);
    }
    this.newRecord = false;
    this.islineAvaliable = false;
    this.ngOnInit();
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

  uploadFileName: string = '';
  file: File | null = null;
  selectFile(event: any) {
    this.file = event.target.files[0];
    if (this.file) {
      const fileFormat = ['image/png', 'image/jpeg'];
      if (fileFormat.includes(this.file.type)) {
        this.uploadFileName = this.file.name;
        this.message.add({
          severity: 'success',
          summary: 'File uploaded',
          detail: 'File uploaded',
          life: 3000,
        })   
      }
      else {
        this.message.add({
          severity: 'error',
          summary: 'Unsupported Format',
          detail: 'Unsupported Format',
          life: 3000,
        })
      }
    }
    // else {
    //   this.uploadFileName = '+ Upload your file';

    // }
  }

  upload() {
    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);
      //var data = this.productForm.value;
      //console.log(this.productForm.value);
      //var jsonString = JSON.stringify(this.productForm.value);
      if (file) {
        this.currentFile = file;

        this.usedService.fileUploadForSalesOrder(this.id, this.currentFile).subscribe({
          next: (event: any) => {
            if (event.type === HttpEventType.UploadProgress) {
              this.progress = Math.round((100 * event.loaded) / event.total);
            } else if (event.ok == true) {
              // this.message = event.body.message;
              this.message.add({
                severity: 'success',
                summary: 'Success',
                detail: 'File Added Successfully ',
                life: 3000,
              });
              // this.fileInfos = this.uploadService.getFiles();
            }
          },
          error: (err: any) => {
            console.log(err);
            this.progress = 0;

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
              console.log("Some Issue while uploading file, Please check");
            }
            this.currentFile = undefined;
          },
        });
      }
      // this.productForm.reset();
      //this.selectedFiles = undefined;
    }
  }

  finalSoSubmitPage() {
    // updated complete PO so that gross total can be updated

    // alert("Final Sales Order Submission Done");
    var sFormVal = this.soForm.value;
    sFormVal.id = this.id;
    sFormVal.grossTotal = this.soSubTotal;
    sFormVal.comapny = this.currentCompany;
    // alert(JSON.stringify(sFormVal));
    if (sFormVal.id) {
      //this.poForm.value.id = poFormVal.id;
      this.submitted = true;
      this.invoiceS.updateSalesOrder(sFormVal).then(
        (res) => {
          console.log(res);
          this.soForm.patchValue = { ...res };
          this.submitted = false;
          this.message.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Sales Order Saved Successfully',
            life: 3000,
          });
          this.upload();
          setTimeout(() => {
            this.router.navigate(['/invoice/salesOrder']);
          }, 2000);
        }
      ).catch(
        (err) => {
          console.log(err);
          this.submitted = false;
          this.message.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Sales Order Error',
            life: 3000,
          });
        }
      )
    }
  }

  createSO() {
    this.router.navigate(['/invoice/salesOrder/create']);
  }

  OnCancelSO() {
    //this.createNew = false;
    this.router.navigate(['/invoice/salesOrder']);
  }

  cancelDeleteConfirm() {
    // this.selectedLineItem = null;
    this.currentDeleteLineItem = null;
    this.DeleteDialLogvisible = false;
  }

  deleteConfirm(lineItem: SalesOrderLine) {
    this.submitted = true;
    this.invoiceS.deletedSoLineItem(lineItem.id)
      .then((data) => {
        this.lineitems = this.lineitems.filter(
          (val) => val.id !== lineItem.id
        );

        this.soSubTotal = this.lineitems.reduce(
          (total, lineItem) => total + lineItem.amount, 0
        );

        this.DeleteDialLogvisible = false;
        this.submitted = false;
        this.message.add({
          severity: 'success',
          summary: 'Success',
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
  loadAllProductsNow() {
    this.loadProducts();
  }
}
