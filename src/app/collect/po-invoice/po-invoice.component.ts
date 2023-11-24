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
import { PurchaseOrder } from 'src/app/bills/bills-model';
import { BreadCrumbService } from 'src/app/shared/navbar/bread-crumb.service';

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
  currVendorShow: Vendor = {};

  poInvoiceForm !: FormGroup;

  currentPO: PurchaseOrder = {};

  vendors: Vendor[] = [];
  allPOs: any[] = [];
  createNew: boolean = false;
  customers: CustomeR[] = [];
  lineitems: any[] = [];
  products: Product[] = [];
  currPurchaseInvoice: PurchaseInvoice = {};
  currPO: PurchaseOrder = {};

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

  penalty: number = 0;

  stateOptions: any[] = [{ label: 'YES', value: true }, { label: 'NO', value: false }];
  currentDeleteLineItem: any;

  //value: string = 'off';

  constructor(private router: Router,
    private route: ActivatedRoute,
    private message: MessageService,
    private fb: FormBuilder,
    private usedService: PayPageService,
    private billS: BillsService,
    private collectS: CollectService, private authS: AuthService, private breadCrumbService: BreadCrumbService) { }

  ngOnInit(): void {

    this.initForm();
    this.loadUser();
  }

  loadOtherInfo() {
    this.id = this.route.snapshot.paramMap.get('id');

    if (this.id === null) {
      this.breadCrumbService.breadCrumb([{ label: 'Purchase Invoice', routerLink: ['/collect/purchaseInvoices'] }, { label: 'Create' }]);
    } else {
      this.breadCrumbService.breadCrumb([{ label: 'Purchase Invoice', routerLink: ['/collect/purchaseInvoices'] }, { label: 'Edit' }]);
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
        this.availablePI();
      }
    });

    this.sidebarVisibleProduct = false;
    this.loadVendors();
    this.loadProducts();
    this.loadPOs();
    this.getPurchaseInvoice();
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
      remainingAmount: new FormControl(''),
      taxableTotal: new FormControl(''),
      vendor: this.fb.group({
        id: this.fb.nonNullable.control('')
      }),
      purchaseOrder: this.fb.group({
        id: this.fb.nonNullable.control('', Validators.required)
      }),
      enablePartialPayments: new FormControl(true)
    });
  }

  // selectVendor(e: any) {
  //   this.submitted = true;
  //   this.usedService.getPurchageOrderByPOId(e.value).then(
  //     (res) => {
  //       // alert(JSON.stringify(res) ) ;
  //       this.submitted = false;
  //       this.currPO = res;
  //       this.currVendorShow = res.vendor;
  //       this.poInvoiceForm.value.vendor.id = res.vendor.id;
  //       // this.loadLineItembyPO(this.currPO);
  //     }
  //   ).catch(
  //     (err) => {
  //       console.log(err);
  //       this.submitted = false;
  //       this.message.add({
  //         severity: 'error',
  //         summary: 'Error',
  //         detail: 'Error While fetching the vendor',
  //         life: 3000,
  //       });
  //     }
  //   )
  // }


  minEndDate!: Date;

  updateEndDateMinDate(selectedStartDate: Date) {
     // Update the minimum end date based on the selected start date
     this.minEndDate = selectedStartDate;
   }




  selectVendor(e: any) {
    this.submitted = true;
  
    if (!e || !e.value) {
      // Clear vendor details when no purchase order is selected
      // this.currVendorShow = null;
      this.poInvoiceForm.get('vendor.id')?.setValue(null); 
      this.submitted = false;
      return;
    }
  
    this.usedService.getPurchageOrderByPOId(e.value).then(
      (res) => {
        this.submitted = false;
        this.currPO = res;
        this.currVendorShow = res.vendor;
        this.poInvoiceForm.get('vendor.id')?.setValue(res.vendor?.id || null);
      }
    ).catch(
      (err) => {
        console.log(err);
        this.submitted = false;
        this.message.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error While fetching the vendor',
          
          life: 3000,
        });
      }
    );
  }
  

  



  // loadLineItembyPO( po : PurchaseOrder)
  // {
  //   this.submitted = true;
  //   this.usedService.getAllLineItemsByPo(po.id).then(
  //     (res) => {
  //      // console.log(res);
  //       this.lineitems = res;
  //         this.poInvoiceSubTotal = this.lineitems.reduce(
  //           (total, lineItem) => total + lineItem.amount, 0
  //         );
  //     //  this.lineitems = res.content;
  //       this.submitted = false;
  //     }
  //   ).catch(
  //     (err) => {
  //       console.log(err);
  //       this.submitted = false;
  //     }
  //   )
  // }

  loadVendors() {
    this.submitted = true;
    this.usedService.allVendor(this.currentUser).then(
      (res) => {
        this.vendors = res;
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

  loadPOs() {
    this.submitted = true;
    this.billS.getAllPo(this.currentUser).then(
      (res: any) => {
        console.log(res);
        this.allPOs = res;
        this.submitted = false;
      }
    ).catch(
      (err) => {
        console.log(err);
        this.submitted = false;
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

  availablePI() {
    this.submitted = true;
    this.collectS.allPurchaseInvoice(this.currentUser).then(
      (res: any) => {
        var count = res.length;
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

          this.currPurchaseInvoice = purchaseInvoice;
          this.poInvoiceForm.patchValue(purchaseInvoice);
          // alert( JSON.stringify(this.poInvoiceForm.value) );
          this.submitted = false;
          this.getLines(purchaseInvoice);
          this.loadthisVendor(this.poInvoiceForm.value.vendor.id); //Because backend api is not ready
        }
      ).catch(
        (err) => {
          console.log(err);
          this.submitted = false;
        }
      )
    }
  }

  loadthisVendor(vendorId: any) {
    this.submitted = true;
    this.usedService
      .getVendor(vendorId)
      .then((res: any) => {
        this.currVendorShow = res;
        // alert(JSON.stringify(res) );
        this.poInvoiceForm.value.vendor = res;
      }).catch(
        (err) => {
          console.log(err);
          this.submitted = false;
        }
      );
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
    invoiceFormVal.branch = this.currentUser.branch;

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
            summary: 'Success',
            detail: 'Purchase Invoice Updated Successfully',
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
            detail: 'Error while updating the PI',
            life: 3000,
          });
        }
      )
    }
    else {
      this.upload();
      this.submitted = true;

      invoiceFormVal.requestStatus = 'DRAFT';
      invoiceFormVal.user = this.currentUser;

      this.collectS.createPurchaseInvoice(invoiceFormVal).then(
        (res) => {
          console.log("Purchase Invoice Created");
          console.log(res);
          this.poInvoiceForm.patchValue = { ...res };
          this.currPurchaseInvoice = res;
          this.submitted = false;
          this.message.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Purchase Invoice Added Successfully',
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
            summary: 'Error',
            detail: 'Error while saving the PI',
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
    this.currentDeleteLineItem = lineItem;
    this.DeleteDialLogvisible = true;
  }

  onRowEditSave(lineItem: PurchaseInvoiceLine) {

    if (
      (((lineItem.unitPrice ? lineItem.unitPrice : 0) * (lineItem.quantity ? lineItem.quantity : 0 )) - (lineItem?.discount ? lineItem?.discount  : 0)) < 0
    ){
      console.log("discount");
      this.message.add({
        severity: 'error',
        summary: 'discount Error',
        detail: 'Discount limit exceeded',
        life: 3000,
      });
       this.getLines(this.currPurchaseInvoice) ;
       this.newRecord = false;
    }
else{

    var currentProduct = this.products.find((t) => t.id === lineItem.expenseName?.id);
    console.log("current Product"); console.log(currentProduct);
    if (lineItem.discount === null || lineItem.discount === 0) {

    }
    if (lineItem.unitPrice === null || lineItem.unitPrice === 0) {
      lineItem.unitPrice = currentProduct?.mrp;
    }
    if (currentProduct == null || currentProduct == undefined || lineItem.expenseName == null) {
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
        // line line item should have id inside
        this.submitted = true;
        this.collectS.updateInvoiceLineItem(lineItem).then(
          (res) => {

            _lineItem = res;
            this.submitted = false;
      //      this.getPurchaseInvoice();
            this.getLines(this.currPurchaseInvoice);

            this.message.add({
              severity: 'success',
              summary: 'Success',
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
              summary: 'Error',
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
            //this.getPurchaseInvoice();
            this.getLines(this.currPurchaseInvoice);

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

  onRowEditCancel(lineItem: PurchaseInvoiceLine, index: any) {
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

  uploadFileName: string = '';
  selectFile(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.uploadFileName = file.name;
      this.message.add({
        severity: 'success',
        summary: 'File uploaded',
        detail: 'File uploaded',
        life: 3000,
      })
    } else {
      this.uploadFileName = '+ Upload your file';
    }
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
    poInvoiceFormVal.penalty = this.penalty;
    // if first time then remaining amoun will be same as gross Total
    if (this.poInvoiceForm.value.remainingAmount == null) {
      poInvoiceFormVal.remainingAmount = poInvoiceFormVal.grossTotal;
    }
    else {

    }

    if (poInvoiceFormVal.id) {
      this.submitted = true;
      this.collectS.updatePurchaseInvoice(poInvoiceFormVal).then((res) => {
        console.log(res);
        this.poInvoiceForm.patchValue = { ...res };
        this.submitted = false;
        this.message.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Purchase Invoice Saved Successfully',
          life: 3000,
        });

        this.upload();
      }
      ).catch(
        (err) => {
          console.log(err);
          this.submitted = false;
          this.message.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Purchase Invoice Error',
            life: 3000,
          });
        }
      )
    }
    setTimeout(() => {
      this.router.navigate(['/collect/purchaseInvoice']);
    }, 2000);
  }

  createPI() {
    this.router.navigate(['/collect/purchaseInvoice/create']);
  }

  OnCancelPI() {
    // this.poInvoiceForm
    this.router.navigate(['/collect/purchaseInvoice']);

  }

  cancelDeleteConfirm() {
    this.currentDeleteLineItem = null;
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
          summary: 'Success',
          detail: 'Line Item Deleted Successfully',
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

  selectPO() {

  }

  loadAllProductsNow()
  {
    this.loadProducts();
  }


}
