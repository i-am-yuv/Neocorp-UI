import { HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';

import { PayPageService } from 'src/app/pay/pay-page.service';
import { Product } from 'src/app/profile/profile-models';
import { CustomeR, Vendor } from 'src/app/settings/customers/customer';
import { CollectService } from '../collect.service';
import { PurchaseInvoice, PurchaseInvoiceLine } from '../collect-models';
import { BillsService } from 'src/app/bills/bills.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-po-invoice',
  templateUrl: './po-invoice.component.html',
  styleUrls: ['./po-invoice.component.scss']
})
export class PoInvoiceComponent implements OnInit {

  id: string | null = '';
  DeleteDialLogvisible: boolean = false;

  sidebarVisibleProduct: boolean = false;

  submitted: boolean = false;

  poInvoiceForm !: FormGroup;

  vendors: Vendor[] = [];
  allPOs: any[] = [];
  createNew: boolean = false;
  customers: CustomeR[] = [];
  lineitems: any[] = [];
  products: Product[] = [];
  currPurchaseInvoice: PurchaseInvoice = {};

  poInvoiceSubTotal: number = 0;
  uploadMessage = '';

  editing: any;
  viewOnly: boolean = false;
  newRecord: boolean = false;
  isquantity: boolean = false;
  islineAvaliable: boolean = false;

  selectedFiles?: FileList;
  currentFile?: File;
  progress = 0;

  items!: MenuItem[];
  currentCompany: any = {};

  stateOptions: any[] = [{ label: 'YES', value: true }, { label: 'NO', value: false }];

  //value: string = 'off';

  constructor(private router: Router,
    private route: ActivatedRoute,
    private message: MessageService,
    private fb: FormBuilder,
    private usedService: PayPageService,
    private billS: BillsService,
    private confirmationService: ConfirmationService,
    private collectS: CollectService, private authS: AuthService) { }

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
        this.availablePI();
      }
    });

    this.items = [{ label: 'Bills' }, { label: 'Purchase Invoice', routerLink: ['/collect/purchaseInvoices'] }, { label: 'Create', routerLink: ['/collect/purchaseInvoice/create'] }];

    this.sidebarVisibleProduct = false;

    this.initForm();
    this.loadVendors();
    this.loadProducts();
    this.loadPOs();
    this.getPurchaseInvoice();
    this.loadUser();
  }

  initForm() {
    this.poInvoiceForm = new FormGroup({
      id: new FormControl(''),
      invoiceNo: new FormControl(''),
      duedate: new FormControl('', Validators.required),
      invoiceDate: new FormControl('', Validators.required),
      status: new FormControl(''),
      description: new FormControl(''),
      grossTotal: new FormControl(''),
      taxableTotal: new FormControl(''),
      vendor: this.fb.group({
        id: this.fb.nonNullable.control('', Validators.required)
      }),
      purchaseOrder: this.fb.group({
        id: this.fb.nonNullable.control('', Validators.required)
      }),
      enablePartialPayments: new FormControl(true)
    });
  }

  selectVendor() { }

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

  loadPOs() {
    this.billS.getAllPo().then(
      (res: any) => {
        console.log(res);
        this.allPOs = res.content;

      }
    ).catch(
      (err) => {
        console.log(err);
      }
    )
  }

  loadUser() {
    this.submitted = true;
    this.authS.getUser().then((res: any) => {
      this.currentCompany = res.comapny;
      this.submitted = false;
    })
      .catch((err) => {
        console.log(err);
        this.submitted = false;
      })
  }

  availablePI() {
    this.submitted = true;
    this.collectS.allPurchaseInvoice().then(
      (res: any) => {
        var count = res.totalElements;
        this.submitted = false;
        //count=0
        if (count > 0) {
          this.router.navigate(['/collect/purchaseInvoices']); // temp
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

  getPurchaseInvoice() {
    if (this.id) {
      this.submitted = true;
      this.collectS.getPurchaseInvoiceById(this.id).then(
        (purchaseInvoice: PurchaseInvoice) => {
          purchaseInvoice.duedate = purchaseInvoice.duedate ? new Date(purchaseInvoice.duedate) : undefined;
          purchaseInvoice.invoiceDate = purchaseInvoice.invoiceDate ? new Date(purchaseInvoice.invoiceDate) : undefined;
          console.log("Purchase Invoice");
          console.log(purchaseInvoice);
          this.currPurchaseInvoice = purchaseInvoice;
          this.poInvoiceForm.patchValue(purchaseInvoice);
          this.submitted = false;
          this.getLines(purchaseInvoice); //Because backend api is not ready
        }
      ).catch(
        (err) => {
          console.log(err);
          this.submitted = false;
        }
      )
    }
  }

  getLines(purchaseInvoice: PurchaseInvoice) {
    this.submitted = true;
    this.collectS
      .getPurchaseLineItemsByInvoice(purchaseInvoice)
      .then((data: any) => {
        if (data) {
          this.lineitems = data;
          this.poInvoiceSubTotal = this.lineitems.reduce(
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

  onSubmitPoInvoice() {
    console.log(this.poInvoiceForm.value);

    var invoiceFormVal = this.poInvoiceForm.value;
    invoiceFormVal.id = this.id;
    invoiceFormVal.comapny = this.currentCompany;
    alert(JSON.stringify(invoiceFormVal));

    if (invoiceFormVal.id) {
      this.submitted = true;
      invoiceFormVal.status = null;
      this.collectS.updatePurchaseInvoice(invoiceFormVal).then(
        (res) => {
          console.log(res);
          this.poInvoiceForm.patchValue = { ...res };
          this.submitted = false;
          this.message.add({
            severity: 'success',
            summary: 'Purchase Invoice updated',
            detail: 'Purchase Invoice updated Successfully',
            life: 3000,
          });
        }
      ).catch(
        (err) => {
          console.log(err);
          this.submitted = false;
          this.message.add({
            severity: 'error',
            summary: 'Purchase Invoice Updated Error',
            detail: 'Some Server Error',
            life: 3000,
          });
        }
      )
    }
    else {
      this.upload();
      this.submitted = true;
      invoiceFormVal.requestStatus = 'DRAFT';
      this.collectS.createPurchaseInvoice(invoiceFormVal).then(
        (res) => {
          console.log("Purchase Invoice Created");
          console.log(res);
          this.poInvoiceForm.patchValue = { ...res };
          this.currPurchaseInvoice = res;
          this.submitted = false;
          this.message.add({
            severity: 'success',
            summary: 'Purchase Invoice Saved',
            detail: 'Purchase Invoice Added',
            life: 3000,
          });
          setTimeout(() => {
            this.router.navigate(['collect/purchaseInvoice/edit/' + res.id]);
          }, 2000);

        }
      ).catch(
        (err) => {
          console.log(err);
          this.submitted = false;
          this.message.add({
            severity: 'error',
            summary: 'Purchase Order save Error',
            detail: 'Some Server Error',
            life: 3000,
          });
        }
      )
    }
  }

  selectCustomer() {

  }


  setLineValues(lineItem: PurchaseInvoiceLine) {
    var dc = this.products.find((t) => t.id === lineItem.expenseName?.id);
  }

  setLineQtyValuesQuantity(e: any, lineItem: PurchaseInvoiceLine) {
    if (e.value == null || e.value == 0) {
      this.isquantity = false;
    }
    if (e.value) {
      lineItem.quantity = e.value;
      this.setLineValues(lineItem);
      this.isquantity = true;
    }
  }

  setLineQtyValuesPrice(e: any, lineItem: PurchaseInvoiceLine) {
  }

  setLineQtyValuesDiscount(e: any, lineItem: PurchaseInvoiceLine) {
  }


  onRowEditInit(lineItem: PurchaseInvoiceLine) {
  }

  delete(lineItem: PurchaseInvoiceLine) {
    this.DeleteDialLogvisible = true;
  }
  onRowEditSave(lineItem: PurchaseInvoiceLine) {
    alert(JSON.stringify(lineItem));
    var currentProduct = this.products.find((t) => t.id === lineItem.expenseName?.id);
    console.log("current Product"); console.log(currentProduct);
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
      lineItem.purchaseInvoice = this.currPurchaseInvoice; // this line will be change

      this.newRecord = false;
      this.islineAvaliable = true;
      console.log(lineItem);

      var _lineItem = lineItem;

      if (_lineItem.id) {
        alert("Update Line Item Entered");
        // line line item should have id inside
        this.submitted = true;
        this.collectS.updateInvoiceLineItem(lineItem).then(
          (res) => {
            console.log("Purchase Invoice Line Item Updated Successfully");
            _lineItem = res;
            this.submitted = false;
            this.getPurchaseInvoice();
            this.message.add({
              severity: 'success',
              summary: 'Line item Updated',
              detail: 'Purchase Invoice Line Item Updated Successfully',
              life: 3000,
            });
          }
        ).catch(
          (err) => {
            console.log("Line Item Updated Error");
            this.submitted = false;
            this.message.add({
              severity: 'error',
              summary: 'Purchase Invoice Line item Update Error',
              detail: 'Error While updating Line Item',
              life: 3000,
            });
          }
        )
      }
      else {
        this.submitted = true;
        this.collectS.createInvoiceLineItem(lineItem).then(
          (res) => {
            console.log(res);
            _lineItem = res;
            this.submitted = false;
            this.getPurchaseInvoice();
            this.message.add({
              severity: 'success',
              summary: 'Purchase Invoice Line item Added',
              detail: 'Line item Added Successfully',
              life: 3000,
            });
          }
        ).catch((err) => {
          console.log(err);
          this.submitted = false;
          this.message.add({
            severity: 'error',
            summary: 'Purchase Invoice Line Item Error',
            detail: 'Error while Adding Line Item',
            life: 3000,
          });
        })
      }
    }

  }

  onRowEditCancel(lineItem: PurchaseInvoiceLine, index: any) {
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
      const file: File | null = this.selectedFiles.item(0);
      //var data = this.productForm.value;
      //console.log(this.productForm.value);
      //var jsonString = JSON.stringify(this.productForm.value);
      if (file) {
        this.currentFile = file;
        this.usedService.fileUploadForPurchaseInvoice(this.id, this.currentFile).subscribe({
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
    }
  }

  finalPoInvoiceSubmit() {
    // updated complete PO so that gross total can be updated
    var poInvoiceFormVal = this.poInvoiceForm.value;
    poInvoiceFormVal.id = this.id;
    poInvoiceFormVal.grossTotal = this.poInvoiceSubTotal;
    poInvoiceFormVal.comapny = this.currentCompany;

    if (poInvoiceFormVal.id) {
      this.submitted = true;
      alert(JSON.stringify(poInvoiceFormVal));
      this.collectS.updatePurchaseInvoice(poInvoiceFormVal).then(
        (res) => {
          console.log(res);
          this.poInvoiceForm.patchValue = { ...res };
          this.submitted = false;
          this.message.add({
            severity: 'success',
            summary: 'Purchase Invoice Saved Successfully',
            detail: 'Purchase Invoice Saved',
            life: 3000,
          });
        }
      ).catch(
        (err) => {
          console.log(err);
          this.submitted = false;
        }
      )
    }
    this.upload();

    setTimeout(() => {
      this.router.navigate(['/collect/purchaseInvoice']);
    }, 2000);

  }

  createPI() {
    this.router.navigate(['/collect/purchaseInvoice/create']);
  }

  OnCancelPI() {
    this.router.navigate(['/collect/purchaseInvoice']);

  }

  cancelDeleteConfirm() {
    this.DeleteDialLogvisible = false;
  }

  deleteConfirm(lineItem: any) {
    this.submitted = true;
    this.collectS
      .deleteInvoiceLineItem(lineItem.id)
      .then((data) => {

        this.lineitems = this.lineitems.filter(
          (val) => val.id !== lineItem.id
        );

        this.poInvoiceSubTotal = this.lineitems.reduce(
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

  myFunction1(item: any): string {
    return parseFloat(item.grossTotal).toFixed(2);
  }

}
