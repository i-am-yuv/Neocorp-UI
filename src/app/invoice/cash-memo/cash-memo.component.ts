import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Product } from 'src/app/profile/profile-models';
import { CustomeR, Vendor } from 'src/app/settings/customers/customer';
import { CashMemo, CashMemoLine, CompanyNew } from '../invoice-model';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { InvoiceService } from '../invoice.service';
import { PayPageService } from 'src/app/pay/pay-page.service';
import { HttpEventType } from '@angular/common/http';
import { AuthService } from 'src/app/auth/auth.service';
import { BreadCrumbService } from 'src/app/shared/navbar/bread-crumb.service';


@Component({
  selector: 'app-cash-memo',
  templateUrl: './cash-memo.component.html',
  styleUrls: ['./cash-memo.component.scss']
})
export class CashMemoComponent implements OnInit {

  id: string | null = '';
  cashMemoForm !: FormGroup;

  submitted: boolean = false;
  createNew: boolean = false;

  vendors: Vendor[] = [];
  products: Product[] = [];
  customers: CustomeR[] = [];

  lineitems: any[] = [];
  currCashMemo: CashMemo = {};

  editing: any;
  viewOnly: boolean = false;
  newRecord: boolean = false;
  isquantity: boolean = false;
  islineAvaliable: boolean = false;

  viewLineItemTable: boolean = false;

  uploadMessage = '';
  cashMemoSubTotal: number = 0;

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

  vendorVisible: boolean = false;
  customerVisible: boolean = false;

  requestStatus: any = [
    {
      "id": "1",
      "name": "INPROGRESS"
    },
    {
      "id": "2",
      "name": "DRAFT"
    },
    {
      "id": "3",
      "name": "APPROVED"
    },
    {
      "id": "4",
      "name": "REJECTED"
    },
    {
      "id": "5",
      "name": "DISBURSED"
    },
    {
      "id": "6",
      "name": "COMPLETED"
    },
    {
      "id": "7",
      "name": "FORWARD"
    }
  ];

  items!: MenuItem[];
  deleteDialogvisible: boolean = false;
  sidebarVisibleProduct: boolean = false;
  currentCompany: CompanyNew = {};

  constructor(private router: Router, private route: ActivatedRoute, private message: MessageService, private fb: FormBuilder, private usedService: PayPageService, private invoiceS: InvoiceService,
    private authS: AuthService, private breadCrumbService: BreadCrumbService) { }

  ngOnInit(): void {

    this.loadUser();
  }

  loadOtherInfo() {
    this.id = this.route.snapshot.paramMap.get('id');

    if (this.id === null) {
      this.breadCrumbService.breadCrumb([{ label: 'Cash Memo', routerLink: ['/invoice/cashMemo'] }, { label: 'Create' }]);
    } else {
      this.breadCrumbService.breadCrumb([{ label: 'Cash Memo', routerLink: ['/invoice/cashMemo'] }, { label: 'Edit' }]);
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
        this.availableCM();
      }
    });

    this.initForm();
    this.loadVendors();
    this.loadProducts();
    this.loadCustomer();
    this.getCashMemo();
    this.sidebarVisibleProduct = false;
  }

  // initForm() {

  //   this.cashMemoForm = new FormGroup({
  //     id: new FormControl(''),
  //     cashMemoNumber: new FormControl(''),
  //     startDate: new FormControl('', Validators.required),//
  //     dueDate: new FormControl('', Validators.required),//
  //     decription: new FormControl(''),//
  //     internalNotes: new FormControl(''),//
  //     vendor: this.fb.group({
  //       id: this.fb.nonNullable.control('')
  //     }),
  //     customer: this.fb.group({
  //       id: this.fb.nonNullable.control('')
  //     }),
  //     grossTotal: new FormControl(''),
  //     billToName: new FormControl('', Validators.required),
  //   });

  // }
  atLeastOneRequired(control: AbstractControl): ValidationErrors | null {
    const customer = control.get('customer.id')?.value;
    const vendor = control.get('vendor.id')?.value;

    if (!customer && !vendor) {
      return { atLeastOneRequired: true };
    }

    return null;
  }

  initForm() {
    this.cashMemoForm = this.fb.group({
      id: new FormControl(''),
      cashMemoNumber: new FormControl(''),
      startDate: new FormControl('', Validators.required),
      dueDate: new FormControl('', Validators.required),
      decription: new FormControl(''),
      internalNotes: new FormControl(''),
      vendor: this.fb.group({
        id: this.fb.nonNullable.control('')
      }),
      customer: this.fb.group({
        id: this.fb.nonNullable.control('')
      }),
      grossTotal: new FormControl(''),
      billToName: new FormControl('', Validators.required),
    }, { validators: this.atLeastOneRequired.bind(this) });
  }




  availableCM() {
    this.submitted = true;
    this.invoiceS.getAllCashMemo(this.currentUser).then(
      (res) => {
        this.submitted = false;
        var count = res.length;
        //count=0
        if (count > 0) {
          this.router.navigate(['/invoice/cashMemos']);
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

  getCashMemo() {
    if (this.id) {
      this.submitted = true;
      this.invoiceS.getCurrentCashMemo(this.id).then(
        (cashMemo: CashMemo) => {
          cashMemo.dueDate = cashMemo.dueDate ? new Date(cashMemo.dueDate) : undefined;
          cashMemo.startDate = cashMemo.startDate ? new Date(cashMemo.startDate) : undefined;
          console.log(cashMemo);
          this.currCashMemo = cashMemo;
          this.cashMemoForm.patchValue(cashMemo);
          this.submitted = false;
          if( cashMemo.customer == null )
          {
            this.cashMemoForm.value.billToName = 'Vendor';
          }
          else{
            this.cashMemoForm.value.billToName = 'Customer';
          }
          this.billToSelect();
          this.getLines(cashMemo); //Because backend api is not ready
        }
      ).catch(
        (err) => {
          console.log(err);
          this.submitted = false;
        }
      )
    }
  }

  getLines(cashMemo: CashMemo) {
    this.submitted = true;
    this.invoiceS
      .getLineitemsByCashmemo(cashMemo)
      .then((data: any) => {
        if (data) {
          this.lineitems = data;
          this.cashMemoSubTotal = this.lineitems.reduce(
            (total, lineItem) => total + lineItem.amount, 0
          );
          this.submitted = false;
        }
      });
  }

  loadVendors() {
    this.usedService.allVendor(this.currentUser).then(
      (res) => {
        this.vendors = res;
        console.log(res);
      }
    ).catch(
      (err) => {
        console.log(err);
      }
    )
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

  selectVendor() { }

  billToSelect() {
      if (this.cashMemoForm.value.billToName == "Vendor") {
        this.vendorVisible = true;
        this.customerVisible = false;
      }
      else if (this.cashMemoForm.value.billToName == "Customer") {
        this.customerVisible = true;
        this.vendorVisible = false;
      }
    
  }

  onSubmitCashMemo() {
    this.cashMemoForm.value.branch = this.currentUser.branch;
    if (this.cashMemoForm.value.vendor.id == null || this.cashMemoForm.value.vendor.id == "") {
      this.cashMemoForm.value.vendor = null;
    }
    else {
      this.cashMemoForm.value.customer = null;
    }

    var cashMemoFormVal = this.cashMemoForm.value;
    cashMemoFormVal.id = this.id;
    cashMemoFormVal.comapny = this.currentCompany;
    if (cashMemoFormVal.id) {
      //this.poForm.value.id = poFormVal.id;
      this.submitted = true;
      this.invoiceS.updateCashMemo(cashMemoFormVal).then(
        (res) => {
          console.log(res);
          this.cashMemoForm.patchValue = { ...res };
          this.submitted = false;
          this.message.add({
            severity: 'success',
            summary: 'Cash Memo Updated',
            detail: 'Cash Memo updated',
            life: 3000,
          });
        }
      ).catch(
        (err) => {
          console.log(err);
          this.submitted = false;
          this.message.add({
            severity: 'error',
            summary: 'Cash Memo updated Error',
            detail: 'Cash Memo Error',
            life: 3000,
          });
        }
      )
    }
    else {
      //  poFormVal.grossTotal = this.poSubTotal ;
      this.upload(); // for upload file if attached
      this.submitted = true;
      cashMemoFormVal.user = this.currentUser;
      this.invoiceS.createCashMemo(cashMemoFormVal).then(
        (res) => {
          console.log(res);

          this.cashMemoForm.patchValue = { ...res };
          this.currCashMemo = res;
          // this.id = res.id;
          console.log("Cash Memo Added");
          console.log(this.currCashMemo);
          this.viewLineItemTable = true;
          this.submitted = false;
          this.message.add({
            severity: 'success',
            summary: 'Sucess',
            detail: 'Cash Memo Saved',
            life: 3000,
          });
          setTimeout(() => {
            this.router.navigate(['invoice/cashMemo/edit/' + res.id]);
          }, 2000);
        }
      ).catch(
        (err) => {
          console.log(err);
          this.viewLineItemTable = false;
          this.submitted = false;
          this.message.add({
            severity: 'error',
            summary: 'Cash Memo error',
            detail: 'Cash Memo Error',
            life: 3000,
          });
        })
    }
  }

  setLineValues(lineItem: CashMemoLine) {
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
            detail: 'Please select the Product',
            life: 3000,
          });
        }
      )
  }

  setLineQtyValuesQuantity(e: any, lineItem: CashMemoLine) {
    if (e.value == null || e.value == 0) {
      this.isquantity = false;
    }
    if (e.value) {
      lineItem.quantity = e.value;
      this.setLineValues(lineItem);
      this.isquantity = true;
    }
  }

  setLineQtyValuesPrice(e: any, lineItem: CashMemoLine) { }

  setLineQtyValuesDiscount(e: any, lineItem: CashMemoLine) { }


  onRowEditInit(lineItem: CashMemoLine) { }

  delete(lineItem: CashMemoLine) {
    this.deleteDialogvisible = true;
    //(JSON.stringify(lineItem));
    // this.confirmationService.confirm({
    //   message: 'Are you sure you want to deleteeeeeeeeeeeee ' + lineItem.expenseName?.name + '?',
    //   header: 'Confirm',
    //   icon: 'pi pi-exclamation-triangle',
    //   accept: () => {

    //   },
    // });

  }


  onRowEditSave(lineItem: CashMemoLine) {
    // alert(JSON.stringify(lineItem));
    var currentProduct = this.products.find((t) => t.id === lineItem.expenseName?.id);
    console.log("current Product"); console.log(currentProduct);
    if (lineItem.discount == null || lineItem.discount == 0) { }

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
      lineItem.cashMemo = this.currCashMemo; // this line will be change

      this.newRecord = false;
      this.islineAvaliable = true;
      console.log(lineItem);

      var _lineItem = lineItem;

      if (_lineItem.id) {
        // alert("Update Line Item Entered");
        // line line item should have id inside
        this.submitted = true;
        this.usedService.updateCashMemoLineItem(lineItem).then((res) => {
          console.log("Line Item Updated Successfully");
          _lineItem = res;
          // this.lineitem.Amount = res.Amount;
          this.getCashMemo();
          this.submitted = false;
          this.message.add({
            severity: 'success',
            summary: 'Line item Updated',
            detail: 'Cash Memo Line item Updated Successfully',
            life: 3000,
          });
        })
          .catch((err) => {
            console.log("Line Item Updated Error");
            this.submitted = false;
            this.message.add({
              severity: 'error',
              summary: 'Line item Update Error',
              detail: 'Error While updating Cash Memo Line Item',
              life: 3000,
            });
          })
      } else {
        this.submitted = true;
        this.usedService.createCashMemoLineItem(lineItem).then((res) => {
          console.log(res);
          _lineItem = res;
          this.getCashMemo();
          this.submitted = false;
          this.message.add({
            severity: 'success',
            summary: 'Line item Added',
            detail: 'Cash Memo Line item Added Successfully',
            life: 3000,
          });
        })
          .catch((err) => {
            console.log(err);
            this.submitted = false;
            this.message.add({
              severity: 'error',
              summary: 'Line Item Error',
              detail: 'Cash Memo Adding Line Item',
              life: 3000,
            });
          })
      }
    }

  }

  onRowEditCancel(lineItem: CashMemoLine, index: any) {
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
        this.submitted = true;
        this.usedService.fileUploadForCashMemo(this.id, this.currentFile).subscribe({
          next: (event: any) => {
            if (event.type === HttpEventType.UploadProgress) {
              this.progress = Math.round((100 * event.loaded) / event.total);
            } else if (event.ok == true) {
              // this.message = event.body.message;
              this.submitted = false;
              this.message.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Cash Memo File Added Successfully ',
                life: 3000,
              });
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

  finalCashMemoSubmitPage() {
    if (this.cashMemoForm.value.vendor.id == null || this.cashMemoForm.value.vendor.id == "") {
      this.cashMemoForm.value.vendor = null;
    }
    else {
      this.cashMemoForm.value.customer = null;
    }

    var cashMemoFormVal = this.cashMemoForm.value;
    cashMemoFormVal.id = this.id;
    cashMemoFormVal.grossTotal = this.cashMemoSubTotal;
    cashMemoFormVal.comapny = this.currentCompany;

    if (cashMemoFormVal.id) {
      this.submitted = true;
      this.invoiceS.updateCashMemo(cashMemoFormVal).then(
        (res) => {
          console.log(res);
          this.cashMemoForm.patchValue = { ...res };
          this.submitted = false;
          this.message.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Cash Memo Saved Successfully',
            life: 3000
          });
          setTimeout(() => {
            this.router.navigate(['/invoice/cashMemo']);
          }, 2000);
        }
      ).catch(
        (err) => {
          console.log(err);
          this.submitted = false;
        })
    }
    this.upload();
    // this.message.add({
    //   severity: 'success',
    //   summary: 'Cash Memo Saved',
    //   detail: 'Cash Memo Saved',
    //   life: 3000
    // });
  }

  createCM() {
    this.router.navigate(['/invoice/cashMemo/create']);
  }

  OnCancelCM() {
    //this.createNew = false;
    this.router.navigate(['/invoice/cashMemo']);
  }

  cancelDeleteConfirm() {
    this.deleteDialogvisible = false;
  }

  deleteConfirm(lineItem: any) {
    this.submitted = true;
    this.usedService.deleteCashMemoLineItem(lineItem.id).then((data: any) => {
      this.lineitems = this.lineitems.filter((val) => val.id !== lineItem.id);

      this.cashMemoSubTotal = this.lineitems.reduce((total, lineItem) => {
        total + lineItem.amount, 0
      });

      this.deleteDialogvisible = false;
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
        this.deleteDialogvisible = false;
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
