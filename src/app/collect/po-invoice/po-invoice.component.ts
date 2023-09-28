import { HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';

import { PayPageService } from 'src/app/pay/pay-page.service';
import { Product } from 'src/app/profile/profile-models';
import { CustomeR } from 'src/app/settings/customers/customer';
import { CollectService } from '../collect.service';
import { PurchaseInvoice, PurchaseInvoiceLine } from '../collect-models';

@Component({
  selector: 'app-po-invoice',
  templateUrl: './po-invoice.component.html',
  styleUrls: ['./po-invoice.component.scss']
})
export class PoInvoiceComponent implements OnInit {

  id: string | null = '';

  poInvoiceForm !: FormGroup;

  customers: CustomeR[] = [];
  lineitems: any[] = [];
  products: Product[] = [];
  currPurchaseInvoice : PurchaseInvoice = {};

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

  constructor(private router: Router,
    private route: ActivatedRoute,
    private message: MessageService,
    private fb: FormBuilder,
    private usedService: PayPageService,
    private confirmationService: ConfirmationService,
    private collectS: CollectService) { }

  ngOnInit(): void {

    this.id = this.route.snapshot.paramMap.get('id');

    this.initForm();

    this.loadCustomer();
    this.loadProducts();
    this.getPurchaseInvoice();
  }

  initForm() {
    this.poInvoiceForm = new FormGroup({
      invoiceNo: new FormControl(''),
      duedate: new FormControl('', Validators.required),//
      invoiceDate: new FormControl('', Validators.required),//
      status: new FormControl('', Validators.required),//
      description: new FormControl('', Validators.required),//
      grossTotal: new FormControl(''),//
      taxableTotal: new FormControl(''),
      customer: this.fb.group({
        id: this.fb.nonNullable.control('', {
          validators: Validators.required,
        })
      }),
      purchaseOrder: this.fb.group({
        // orderNumber: this.fb.nonNullable.control('', {
        //   validators: Validators.required,
        // }),
        // id: this.fb.nonNullable.control('')
        orderNumber: this.fb.nonNullable.control(''),
        id: this.fb.nonNullable.control('')
      })
    });
  }

  loadCustomer() {
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

  getPurchaseInvoice() {
    if (this.id) {
      this.collectS.getPurchaseInvoiceById(this.id).then(
        (purchaseInvoice: PurchaseInvoice) => {
          purchaseInvoice.duedate = purchaseInvoice.duedate ? new Date(purchaseInvoice.duedate) : undefined;
          purchaseInvoice.invoiceDate = purchaseInvoice.invoiceDate ? new Date(purchaseInvoice.invoiceDate) : undefined;
          console.log("Purchase Invoice");
          console.log(purchaseInvoice);
           this.currPurchaseInvoice = purchaseInvoice ;
          this.poInvoiceForm.patchValue(purchaseInvoice);
          this.getLines(purchaseInvoice); //Because backend api is not ready
        }
      ).catch(
        (err) => {
          console.log(err);
        }
      )
    }
  }

  getLines(purchaseInvoice: PurchaseInvoice) {
    this.collectS
      .getPurchaseLineItemsByInvoice(purchaseInvoice)
      .then((data: any) => {
        if (data) {
          this.lineitems = data;
          this.poInvoiceSubTotal = this.lineitems.reduce(
            (total, lineItem) => total + lineItem.amount, 0
          );
        }
      });
  }

  onSubmitPoInvoice() {
    console.log(this.poInvoiceForm.value);

    var invoiceFormVal = this.poInvoiceForm.value;
    invoiceFormVal.id = this.id;

    if (invoiceFormVal.id) {
      invoiceFormVal.purchaseOrder = null ; 
      this.collectS.updatePurchaseInvoice(invoiceFormVal).then(
        (res) => {
          console.log(res);
          this.poInvoiceForm.patchValue = { ...res };

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
      invoiceFormVal.purchaseOrder = null ; // temporary making PI without ordernumber . check every where you did this when changing
      this.collectS.createPurchaseInvoice(invoiceFormVal).then(
        (res) => {
          console.log("Purchase Invoice Created");
          console.log(res);
          this.poInvoiceForm.patchValue = { ...res };
          this.currPurchaseInvoice = res;
          this.message.add({
            severity: 'success',
            summary: 'Purchase Invoice Saved',
            detail: 'Purchase Invoice Added',
            life: 3000,
          });
          this.router.navigate(['collect/purchaseInvoice/edit/' + res.id]);
        }
      ).catch(
        (err) => {
          console.log(err);
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
    //(JSON.stringify(lineItem));
    this.confirmationService.confirm({
      message: 'Are you sure you want to deleteeeeeeeeeeeee ' + lineItem.expenseName?.name + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {

      },
    });

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
      lineItem.purchaseInvoice = this.currPurchaseInvoice ; // this line will be change

      this.newRecord = false;
      this.islineAvaliable = true;
      console.log(lineItem);

      var _lineItem = lineItem;

      if (_lineItem.id) {
        alert("Update Line Item Entered");
        // line line item should have id inside
        this.collectS.updateInvoiceLineItem(lineItem).then(
          (res) => {
            console.log("Purchase Invoice Line Item Updated Successfully");
            _lineItem = res;
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
        this.collectS.createInvoiceLineItem(lineItem).then(
          (res) => {
            console.log(res);
            _lineItem = res;
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
    return { expenseName: {}, quantity: 1 };
  }

  // my code
  enableRowSubmit() {
    this.editing = true;
  }

  selectFile(event: any) {
    this.selectedFiles = event.target.files;
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
    poInvoiceFormVal.purchaseOrder = null ; 
    if (poInvoiceFormVal.id) {
      //this.poForm.value.id = poFormVal.id;
      this.collectS.updatePurchaseInvoice(poInvoiceFormVal).then(
        (res) => {
          console.log(res);
          this.poInvoiceForm.patchValue = { ...res };
        }
      ).catch(
        (err) => {
          console.log(err);
        }
      )
    }
    if (this.poInvoiceSubTotal != 0) {
      this.message.add({
        severity: 'success',
        summary: 'Purchase Invoice Created Successfully',
        detail: 'Purchase Invoice created',
        life: 3000,
      });
      this.upload();
    }
  }

}
