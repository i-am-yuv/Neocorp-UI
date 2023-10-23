import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Product } from 'src/app/profile/profile-models';
import { CustomeR, Vendor } from 'src/app/settings/customers/customer';
import { VendorInvoice, VendorInvoiceLine } from '../invoice-model';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { PayPageService } from 'src/app/pay/pay-page.service';
import { InvoiceService } from '../invoice.service';


@Component({
  selector: 'app-vendor-invoice',
  templateUrl: './vendor-invoice.component.html',
  styleUrls: ['./vendor-invoice.component.scss']
})
export class VendorInvoiceComponent implements OnInit {

  id: string | null = '';
  viForm !: FormGroup;

  submitted: boolean = false;
  createNew: boolean = false;

  vendors: Vendor[] = [];
  products: Product[] = [];

  lineitems: any[] = [];
  currvendorInvoice: VendorInvoice = {};

  editing: any;
  viewOnly: boolean = false;
  newRecord: boolean = false;
  isquantity: boolean = false;
  islineAvaliable: boolean = false;

  viewLineItemTable: boolean = false;

  uploadMessage = '';
  viSubTotal: number = 0;

  items!: MenuItem[];

  constructor(private router: Router,
    private route: ActivatedRoute,
    private message: MessageService,
    private fb: FormBuilder,
    private usedService: PayPageService,
    private invoiceS: InvoiceService,
    private confirmationService: ConfirmationService) { }


  ngOnInit(): void {
    
    this.items = [{label: 'Invoices'},{ label: 'Vendor Invoice', routerLink: ['/invoice/vendorInvoices'] }, { label: 'Create', routerLink: ['/invoice/vendorInvoice/create'] }];

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
        this.availableVI();
      }
    });

    this.initForm();
    this.loadVendors();
    this.loadProducts();
    this.getVI();
  }

  initForm() {
    this.viForm = new FormGroup({
      id: new FormControl(''),
      documentnumber: new FormControl(''),
      orderDate: new FormControl('', Validators.required),
      dueDate: new FormControl('', Validators.required),
      vendor: this.fb.group({
        id: this.fb.nonNullable.control('', Validators.required)
      }),
      grosstotal: new FormControl(''),
      status: new FormControl('')
    });
  }


  availableVI() {
    this.submitted = true;
    this.invoiceS.getAllVI().then(
      (res) => {
        this.submitted = false;
        var count = res.totalElements;
        //count=0
        if (count > 0) {
          this.router.navigate(['/invoice/vendorInvoices']);
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

  getVI() {
    if (this.id) {
      this.submitted = true;
      this.invoiceS.getCurrentVI(this.id).then(
        (vi: VendorInvoice) => {
          vi.orderDate = vi.orderDate ? new Date(vi.orderDate) : undefined;
          vi.dueDate = vi.dueDate ? new Date(vi.dueDate) : undefined;

          console.log(vi);
          this.currvendorInvoice = vi;
          this.viForm.patchValue(vi);
          this.submitted = false;
          this.getLines(vi); //Because backend api is not ready
        }
      ).catch(
        (err) => {
          console.log(err);
          this.submitted = false;
        }
      )
    }
  }

  getLines(vi: VendorInvoice) {
    this.submitted = true;
    this.invoiceS
      .getLineitemsByVI(vi)
      .then((data: any) => {
        if (data) {
          this.lineitems = data;
          this.viSubTotal = this.lineitems.reduce(
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

  selectVendor() { }

  onSubmitVI() {

    var viFormVal = this.viForm.value;
    viFormVal.id = this.id;
    if (viFormVal.id) {
      //this.poForm.value.id = poFormVal.id;
      this.submitted = true;
      this.invoiceS.updateVI(viFormVal).then(
        (res) => {
          console.log(res);
          this.viForm.patchValue = { ...res };
          this.submitted = false;
          this.message.add({
            severity: 'success',
            summary: 'Vendor Invoice Updated',
            detail: 'Vendor Invoice updated',
            life: 3000,
          });
        }
      ).catch(
        (err) => {
          console.log(err);
          this.submitted = false;
          this.message.add({
            severity: 'error',
            summary: 'Vendor Invoice updated Error',
            detail: 'Vendor Invoice Error',
            life: 3000,
          });
        }
      )
    }
    else {
      //  poFormVal.grossTotal = this.poSubTotal ;
      //this.upload(); // for upload file if attached
      this.submitted = true;
      this.invoiceS.createVI(viFormVal).then(
        (res) => {
          console.log(res);
          this.viForm.patchValue = { ...res };
          this.currvendorInvoice = res;
          // this.id = res.id;
          console.log("VI Added");
          console.log(this.currvendorInvoice);
          this.viewLineItemTable = true;
          this.submitted = false;
          this.message.add({
            severity: 'success',
            summary: 'Vendor Invoice Saved',
            detail: 'Vendor Invoice Added',
            life: 3000,
          });
          this.router.navigate(['invoice/vendorInvoice/edit/' + res.id]);
        }
      ).catch(
        (err) => {
          console.log(err);
          this.viewLineItemTable = false;
          this.submitted = false;
          this.message.add({
            severity: 'error',
            summary: 'Vendor Invoice error',
            detail: 'Vendor Invoice Error',
            life: 3000,
          });
        })
    }
  }

  setLineValues(lineItem: VendorInvoiceLine) {
    var dc = this.products.find((t) => t.id === lineItem.expenseName?.id);
  }

  setLineQtyValuesQuantity(e: any, lineItem: VendorInvoiceLine) {
    if (e.value == null || e.value == 0) {
      this.isquantity = false;
    }
    if (e.value) {
      lineItem.quantity = e.value;
      this.setLineValues(lineItem);
      this.isquantity = true;
    }
  }

  setLineQtyValuesPrice(e: any, lineItem: VendorInvoiceLine) {

  }

  setLineQtyValuesDiscount(e: any, lineItem: VendorInvoiceLine) {

  }


  onRowEditInit(lineItem: VendorInvoiceLine) {

  }
  delete(lineItem: VendorInvoiceLine) {
    //(JSON.stringify(lineItem));
    this.confirmationService.confirm({
      message: 'Are you sure you want to deleteeeeeeeeeeeee ' + lineItem.expenseName?.name + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {

      },
    });

  }
  onRowEditSave(lineItem: VendorInvoiceLine) {
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
      lineItem.vendorInvoice = this.currvendorInvoice; // this line will be change

      this.newRecord = false;
      this.islineAvaliable = true;
      console.log(lineItem);

      var _lineItem = lineItem;

      if (_lineItem.id) {
        alert("Update Line Item Entered");
        // line line item should have id inside
        this.submitted = true;
        this.usedService.updateVILineItem(lineItem).then(
          (res) => {
            console.log("Line Item Updated Successfully");
            _lineItem = res;
            // this.lineitem.Amount = res.Amount;
            this.getVI();
            this.submitted = false;
            this.message.add({
              severity: 'success',
              summary: 'Line item Updated',
              detail: 'Vendor Invoice Line item Updated Successfully',
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
              detail: 'Error While updating Vendor Invoice Line Item',
              life: 3000,
            });
          }
        )
      }
      else {
        this.submitted = true;
        this.usedService.createVILineItem(lineItem).then(
          (res) => {
            console.log(res);
            _lineItem = res;
            this.getVI();
            this.submitted = false;
            this.message.add({
              severity: 'success',
              summary: 'Line item Added',
              detail: 'Vendor Invoice Line item Added Successfully',
              life: 3000,
            });
          }
        ).catch((err) => {
          console.log(err);
          this.submitted = false;
          this.message.add({
            severity: 'error',
            summary: 'Line Item Error',
            detail: 'Vendor Invoice Adding Line Item',
            life: 3000,
          });
        })
      }
    }

  }

  onRowEditCancel(lineItem: VendorInvoiceLine, index: any) {
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

  finalVISubmitPage() {
    // updated complete PO so that gross total can be updated

    var viFormVal = this.viForm.value;
    viFormVal.id = this.id;
    viFormVal.grosstotal = this.viSubTotal;
    if (viFormVal.id) {

      this.submitted = true;
      this.invoiceS.updateVI(viFormVal).then(
        (res) => {
          console.log(res);
          this.viForm.patchValue = { ...res };
          this.submitted = false;
          this.message.add({
            severity: 'success',
            summary: 'Vendor Invoice Updated Successfully',
            detail: 'Vendor Invoice Updated',
            life: 3000,
          });
          setTimeout(() => {
            this.router.navigate(['/invoice/vendorInvoices']);
          }, 2000);
        }
      ).catch(
        (err) => {
          console.log(err);
          this.submitted = false;
        }
      )
    } else {
      //  this.upload();
      //this.router.navigate(['/invoice/salesInvoice']);
      // this.router.navigate(['/invoice/vendorInvoice']);
      this.message.add({
        severity: 'success',
        summary: 'Vendor Invoice Created Successfully',
        detail: 'Vendor Invoice created',
        life: 3000,
      });
      setTimeout(() => {
        this.router.navigate(['/invoice/vendorInvoices']);
      }, 2000);
    }
  }

  createVI() {
    this.router.navigate(['/invoice/vendorInvoice/create']);
  }

  OnCancelVI() {
    this.router.navigate(['/invoice/vendorInvoice']);
  }

}
