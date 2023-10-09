import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Product } from 'src/app/profile/profile-models';
import { CustomeR, Vendor } from 'src/app/settings/customers/customer';
import { SalesInvoice, SalesInvoiceLine } from '../invoice-model';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PayPageService } from 'src/app/pay/pay-page.service';
import { InvoiceService } from '../invoice.service';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-sales-invoice',
  templateUrl: './sales-invoice.component.html',
  styleUrls: ['./sales-invoice.component.scss']
})
export class SalesInvoiceComponent implements OnInit {

  id: string | null = '';
  siForm !: FormGroup;

  submitted: boolean = false;
  createNew: boolean = false;

  vendors: Vendor[] = [];
  products: Product[] = [];
  customers: CustomeR[] = [];

  salesOrders: any[] = [];
  vendorInvoices: any[] = [];

  lineitems: any[] = [];
  currSI: SalesInvoice = {};

  editing: any;
  viewOnly: boolean = false;
  newRecord: boolean = false;
  isquantity: boolean = false;
  islineAvaliable: boolean = false;

  viewLineItemTable: boolean = false;

  uploadMessage = '';
  siSubTotal: number = 0;

  vendorVisible: boolean = false;
  customerVisible: boolean = false;

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
    private usedService: PayPageService,
    private invoiceS: InvoiceService,
    private confirmationService: ConfirmationService) { }

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
        this.availableSI();
      }
    });

     this.initForm();
    this.loadVendors();
    this.loadProducts();
    this.loadCustomer();
    this.loadSalesOrders();
    this.loadVendorInvoices();
    this.getSI();
  }

  initForm() {

    this.siForm = new FormGroup({
      id: new FormControl(''),
      invoiceNo: new FormControl(''),
      invoiceDate: new FormControl('', Validators.required),
      vendor: this.fb.group({
        id: this.fb.nonNullable.control('')
      }),
      customer: this.fb.group({
        id: this.fb.nonNullable.control('')
      }),
      vendorInvoice: this.fb.group({
        id: this.fb.nonNullable.control('')
      }),
      salesOrder: this.fb.group({
        id: this.fb.nonNullable.control('', {
          validators: Validators.required,
        })
      }),
      grossTotal: new FormControl(''),
      status: new FormControl('', Validators.required),
      billToName: new FormControl('')
    });

  }


  availableSI() {
    this.submitted = true;
    this.invoiceS.getAllSI().then(
      (res) => {
        this.submitted = false;
        var count = res.totalElements;
        //count=0
        if (count > 0) {
          this.router.navigate(['/invoice/salesInvoices']);
        }
        else {
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

  getSI() {
    if (this.id) {
      this.submitted = true;
      this.invoiceS.getCurrentSI(this.id).then(
        (si: SalesInvoice) => {
          si.invoiceDate = si.invoiceDate ? new Date(si.invoiceDate) : undefined;

          console.log(si);
          this.currSI = si;
          this.siForm.patchValue(si);
          this.submitted = false;
          this.getLines(si); //Because backend api is not ready
        }
      ).catch(
        (err) => {
          console.log(err);
          this.submitted = false;
        }
      )
    }
  }

  getLines(si: SalesInvoice) {
    this.submitted = true;
    this.invoiceS
      .getLineitemsBySI(si)
      .then((data: any) => {
        if (data) {
          this.lineitems = data;
          this.siSubTotal = this.lineitems.reduce(
            (total, lineItem) => total + lineItem.amount, 0
          );
          this.submitted = false;
        }
      });
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

  loadSalesOrders() {
    this.submitted = true;
    this.invoiceS.getAllSo().then(
      (res) => {
        this.submitted = false;
        this.salesOrders = res.content;
      }
    ).catch(
      (err) => {
        this.submitted = false;
        console.log(err);
      }
    )
  }

  loadVendorInvoices() {

    this.submitted = true;
    this.invoiceS.getAllVendorInvoices().then(
      (res) => {
        
        this.vendorInvoices = res.content;
        this.submitted = false;
      }
    ).catch(
      (err) => {
        this.submitted = false;
        console.log(err);
      }
    )
  }

  billToSelect() {
    if (this.siForm.value.billToName == "Vendor") {
      this.vendorVisible = true;
      this.customerVisible = false;
    }
    else if (this.siForm.value.billToName == "Customer") {
      this.customerVisible = true;
      this.vendorVisible = false;
    }
  }

  selectVendor() { }

  onSubmitSI() {

    if (this.siForm.value.vendor.id == null || this.siForm.value.vendor.id == "") {
      this.siForm.value.vendor = null;
    }
    if (this.siForm.value.customer.id == null || this.siForm.value.customer.id == "") {
      this.siForm.value.customer = null;
    }
    if (this.siForm.value.vendorInvoice.id == null || this.siForm.value.vendorInvoice.id == "") {
      this.siForm.value.vendorInvoice = null;
    }

    var siFormVal = this.siForm.value;
    siFormVal.id = this.id;
    if (siFormVal.id) {
      //this.poForm.value.id = poFormVal.id;
      this.submitted = true;
      this.invoiceS.updateSI(siFormVal).then(
        (res) => {
          console.log(res);
          this.siForm.patchValue = { ...res };
          this.submitted = false;
          this.message.add({
            severity: 'success',
            summary: 'Sales Invoice Updated',
            detail: 'Sales Invoice updated',
            life: 3000,
          });
        }
      ).catch(
        (err) => {
          console.log(err);
          this.submitted = false;
          this.message.add({
            severity: 'error',
            summary: 'Sales Invoice updated Error',
            detail: 'Sales Invoice Error',
            life: 3000,
          });
        }
      )
    }
    else {
      //  poFormVal.grossTotal = this.poSubTotal ;
      //this.upload(); // for upload file if attached
      this.submitted = true;
      this.invoiceS.createSI(siFormVal).then(
        (res) => {
          console.log(res);
          this.siForm.patchValue = { ...res };
          this.currSI = res;
          // this.id = res.id;
          console.log("SI Added");
          console.log(this.currSI);
          this.viewLineItemTable = true;
          this.submitted = false;
          this.message.add({
            severity: 'success',
            summary: 'Sales Invoice Saved',
            detail: 'Sales Invoice Added',
            life: 3000,
          });
          this.router.navigate(['invoice/salesInvoice/edit/' + res.id]);
        }
      ).catch(
        (err) => {
          console.log(err);
          this.viewLineItemTable = false;
          this.submitted = false;
          this.message.add({
            severity: 'error',
            summary: 'Sales Invoice error',
            detail: 'Sales Invoice Error',
            life: 3000,
          });
        })
    }
  }

  setLineValues(lineItem: SalesInvoiceLine) {
    var dc = this.products.find((t) => t.id === lineItem.expenseName?.id);
  }

  setLineQtyValuesQuantity(e: any, lineItem: SalesInvoiceLine) {
    if (e.value == null || e.value == 0) {
      this.isquantity = false;
    }
    if (e.value) {
      lineItem.quantity = e.value;
      this.setLineValues(lineItem);
      this.isquantity = true;
    }
  }

  setLineQtyValuesPrice(e: any, lineItem: SalesInvoiceLine) {

  }

  setLineQtyValuesDiscount(e: any, lineItem: SalesInvoiceLine) {

  }


  onRowEditInit(lineItem: SalesInvoiceLine) {

  }
  delete(lineItem: SalesInvoiceLine) {
    //(JSON.stringify(lineItem));
    this.confirmationService.confirm({
      message: 'Are you sure you want to deleteeeeeeeeeeeee ' + lineItem.expenseName?.name + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {

      },
    });

  }
  onRowEditSave(lineItem: SalesInvoiceLine) {
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
      lineItem.salesInvoice = this.currSI; // this line will be change

      this.newRecord = false;
      this.islineAvaliable = true;
      console.log(lineItem);

      var _lineItem = lineItem;

      if (_lineItem.id) {
        alert("Update Line Item Entered");
        // line line item should have id inside
        this.submitted = true;
        this.usedService.updateSILineItem(lineItem).then(
          (res) => {
            console.log("Line Item Updated Successfully");
            _lineItem = res;
            // this.lineitem.Amount = res.Amount;
            this.getSI();
            this.submitted = false;
            this.message.add({
              severity: 'success',
              summary: 'Line item Updated',
              detail: 'Sales Invoice Line item Updated Successfully',
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
              detail: 'Error While updating Sales Invoice Line Item',
              life: 3000,
            });
          }
        )
      }
      else {
        this.submitted = true;
        this.usedService.createSILineItem(lineItem).then(
          (res) => {
            console.log(res);
            _lineItem = res;
            this.getSI();
            this.submitted = false;
            this.message.add({
              severity: 'success',
              summary: 'Line item Added',
              detail: 'Sales Invoice Line item Added Successfully',
              life: 3000,
            });
          }
        ).catch((err) => {
          console.log(err);
          this.submitted = false;
          this.message.add({
            severity: 'error',
            summary: 'Line Item Error',
            detail: 'Sales Invoice Adding Line Item',
            life: 3000,
          });
        })
      }
    }

  }

  onRowEditCancel(lineItem: SalesInvoiceLine, index: any) {
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

  selectedFiles?: FileList;
  currentFile?: File;
  progress = 0;

  selectFile(event: any) {
    this.selectedFiles = event.target.files;
  }

  // upload() {
  //   if (this.selectedFiles) {
  //     const file: File | null = this.selectedFiles.item(0);
  //     //var data = this.productForm.value;
  //     //console.log(this.productForm.value);
  //     //var jsonString = JSON.stringify(this.productForm.value);
  //     if (file) {
  //       this.currentFile = file;
  //       this.submitted = true;
  //       this.usedService.fileUploadForCashMemo(this.id, this.currentFile).subscribe({
  //         next: (event: any) => {
  //           if (event.type === HttpEventType.UploadProgress) {
  //             this.progress = Math.round((100 * event.loaded) / event.total);
  //           } else if (event.ok == true) {
  //             // this.message = event.body.message;
  //             this.submitted = false;
  //             this.message.add({
  //               severity: 'success',
  //               summary: 'Success',
  //               detail: 'Cash Memo File Added Successfully ',
  //               life: 3000,
  //             });
  //             // this.fileInfos = this.uploadService.getFiles();
  //           }
  //         },
  //         error: (err: any) => {
  //           console.log(err);
  //           this.progress = 0;
  //           this.submitted = false;
  //           if (err.error && err.error.message) {
  //             this.message = err.error.message;
  //             this.uploadMessage = 'Could not upload the file!';
  //             this.message.add({
  //               severity: 'error',
  //               summary: 'Error',
  //               detail: 'Issue happend while creation ',
  //               life: 3000,
  //             });
  //           } else {
  //             console.log("Some Issue while uploading file, Please check");
  //           }
  //           this.currentFile = undefined;
  //         },
  //       });
  //     }
  //     // this.productForm.reset();
  //     //this.selectedFiles = undefined;
  //   }
  // }

  finalSISubmitPage() {
    // updated complete PO so that gross total can be updated
    if (this.siForm.value.vendor.id == null || this.siForm.value.vendor.id == "") {
      this.siForm.value.vendor = null;
    }
    if (this.siForm.value.customer.id == null || this.siForm.value.customer.id == "") {
      this.siForm.value.customer = null;
    }
    if (this.siForm.value.vendorInvoice.id == null || this.siForm.value.vendorInvoice.id == "") {
      this.siForm.value.vendorInvoice = null;
    }

    var siFormVal = this.siForm.value;
    siFormVal.id = this.id;
    siFormVal.grossTotal = this.siSubTotal;
    if (siFormVal.id) {

      this.submitted = true;
      this.invoiceS.updateSI(siFormVal).then(
        (res) => {
          console.log(res);
          this.siForm.patchValue = { ...res };
          this.submitted = false;
        }
      ).catch(
        (err) => {
          console.log(err);
          this.submitted = false;
        }
      )
    }
    this.message.add({
      severity: 'success',
      summary: 'Sales Invoice Created Successfully',
      detail: 'Sales Invoice created',
      life: 3000,
    });
    //  this.upload();
    this.router.navigate(['/invoice/salesInvoice']);
  }

  createSI() {
    this.router.navigate(['/invoice/salesInvoice/create']);
  }

  OnCancelSI() {
    this.router.navigate(['/invoice/salesInvoice']);
  }

}
