import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { PayPageService } from 'src/app/pay/pay-page.service';
import { Product, State } from 'src/app/profile/profile-models';
import { CustomeR, Vendor } from 'src/app/settings/customers/customer';
import { BillsService } from '../bills.service';
import { ReceiptNote, rnLineItem } from '../bills-model';
import { HttpEventType } from '@angular/common/http';
import { CompanyNew } from 'src/app/invoice/invoice-model';
import { AuthService } from 'src/app/auth/auth.service';
import { BreadCrumbService } from 'src/app/shared/navbar/bread-crumb.service';

@Component({
  selector: 'app-receipt-note',
  templateUrl: './receipt-note.component.html',
  styleUrls: ['./receipt-note.component.scss']
})
export class ReceiptNoteComponent implements OnInit {

  createNew: boolean = false;
  submitted: boolean = false;

  id: string | null = '';
  rnForm !: FormGroup;

  vendors: Vendor[] = [];
  customers: CustomeR[] = [];
  products: Product[] = [];
  states: State[] = [];

  lineitems: any[] = [];
  currReceiptNote: ReceiptNote = {};

  editing: any;
  viewOnly: boolean = false;
  newRecord: boolean = false;
  isquantity: boolean = false;
  islineAvaliable: boolean = false;

  viewLineItemTable: boolean = false;

  uploadMessage = '';
  rnSubTotal: number = 0;

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

  items!: MenuItem[];
  deleteDialogvisible: boolean = false;
  sidebarVisibleProduct: boolean = false;
  currentCompany: CompanyNew = {};

  constructor(private router: Router,
    private route: ActivatedRoute,
    private message: MessageService,
    private fb: FormBuilder,
    private usedService: PayPageService,
    private billS: BillsService, private authS: AuthService, private breadcrumbS: BreadCrumbService) { }

  ngOnInit(): void {
    this.breadcrumbS.breadCrumb([{ label: 'Receipt Notes', routerLink: ['/bills/receiptNote'] }]);
    this.initForm();
    this.loadUser();
  }

  loadOtherInfo() {
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
        this.availableRN();
      }
    });

    this.items = [{ label: 'Bills' },];

    this.sidebarVisibleProduct = false;

   
    this.loadVendors();
    this.loadCustomer();
    this.loadProducts();
    this.loadStates();
    this.getReceiptNote();
  }

  initForm() {
    this.rnForm = new FormGroup({
      id: new FormControl(''),
      receiptNoteNumber: new FormControl(''),
      startDate: new FormControl('', Validators.required),//
      endDate: new FormControl('', Validators.required),//
      internalNotes: new FormControl(''),//
      description: new FormControl(''),//
      clientNotes: new FormControl(''),//
      vendor: this.fb.group({
        id: this.fb.nonNullable.control('')
      }),
      customer: this.fb.group({
        id: this.fb.nonNullable.control('')
      }),
      placeOfSupply: this.fb.group({
        id: this.fb.nonNullable.control('', {
          validators: Validators.required,
        })
      }),
      grossTotal: new FormControl(''),
      billToName: new FormControl('')
    });
  }

  availableRN() {
    this.submitted = true;
    this.billS.getAllRn(this.currentUser).then(
      (res) => {
        this.submitted = false;
        var count = res.length;
        //count=0
        if (count > 0) {
          this.router.navigate(['/bills/receiptNotes']);
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
          detail: 'Error While Fetching All The Receipt Notes',
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
      });
  }

  getReceiptNote() {
    if (this.id) {
      this.submitted = true;
      this.billS.getCurrentRn(this.id).then(
        (receiptNote: ReceiptNote) => {
          receiptNote.startDate = receiptNote.startDate ? new Date(receiptNote.startDate) : undefined;
          receiptNote.endDate = receiptNote.endDate ? new Date(receiptNote.endDate) : undefined;
          console.log(receiptNote);
          this.currReceiptNote = receiptNote;
          this.rnForm.patchValue(receiptNote);
          this.submitted = false;
          this.getLines(receiptNote);
          //Because backend api is not ready
        }
      ).catch(
        (err) => {
          console.log(err);
        }
      )
    }
  }

  getLines(receiptNote: ReceiptNote) {
    this.submitted = true;
    this.billS
      .getLineitemsByRn(receiptNote)
      .then((data: any) => {
        if (data) {
          this.lineitems = data;
          this.rnSubTotal = this.lineitems.reduce(
            (total, lineItem) => total + lineItem.amount, 0
          );
          this.submitted = false;
        }
      });
  }

  loadStates() {
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
    this.usedService.allProduct(this.currentUser).then(
      (res) => {
        this.products = res;
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

  selectCustomer() { }

  billToSelect() {
    if (this.rnForm.value.billToName == "Vendor") {
      this.vendorVisible = true;
      this.customerVisible = false;
    }
    else if (this.rnForm.value.billToName == "Customer") {
      this.customerVisible = true;
      this.vendorVisible = false;
    }
  }


  onSubmitRN() {

    if (this.rnForm.value.vendor == null || this.rnForm.value.vendor.id == "") {
      this.rnForm.value.vendor = null;
    }
    else {
      this.rnForm.value.customer = null;
    }

    var rnFormVal = this.rnForm.value;
    rnFormVal.id = this.id;
    rnFormVal.company = this.currentCompany;
    rnFormVal.branch =  this.currentUser.branch ;

    if (rnFormVal.id) {
      //this.poForm.value.id = poFormVal.id;
      this.submitted = true;
      this.billS.updateReceiptNote(rnFormVal).then(
        (res) => {
          this.submitted = false;
          console.log(res);
          this.rnForm.patchValue = { ...res };
          this.message.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Receipt Note Updated Successfully',
            life: 3000,
          });
        }
      ).catch(
        (err) => {
          this.submitted = false;
          console.log(err);
          this.message.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Receipt Note Updation Error',
            life: 3000,
          });
        }
      )
    }
    else {

      this.submitted = true;
      rnFormVal.user = this.currentUser;
      rnFormVal.status = 'DRAFT';
      this.billS.createReceiptNote(rnFormVal).then(
        (res) => {
          console.log(res);
          this.rnForm.patchValue = { ...res };
          this.currReceiptNote = res;

          this.viewLineItemTable = true;
          this.submitted = false;
          this.message.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Receipt Note Added Successfully',
            life: 3000,
          });
          this.router.navigate(['bills/receiptNote/edit/' + res.id]);
        }
      ).catch(
        (err) => {
          console.log(err);
          this.viewLineItemTable = false;
          this.submitted = false;
          this.message.add({
            severity: 'error',
            summary: 'rror',
            detail: 'Error While Saving The Receipt Note',
            life: 3000,
          });
        })
    }
  }

  setLineValues(lineItem: rnLineItem) {
    var dc = this.products.find((t) => t.id === lineItem.expenseName?.id);
  }

  setLineQtyValuesQuantity(e: any, lineItem: rnLineItem) {
    if (e.value == null || e.value == 0) {
      this.isquantity = false;
    }
    if (e.value) {
      lineItem.quantity = e.value;
      this.setLineValues(lineItem);
      this.isquantity = true;
    }
  }

  setLineQtyValuesPrice(e: any, lineItem: rnLineItem) { }

  setLineQtyValuesDiscount(e: any, lineItem: rnLineItem) { }

  onRowEditInit(lineItem: rnLineItem) { }

  onRowEditSave(lineItem: rnLineItem) {

    var currentProduct = this.products.find((t) => t.id === lineItem.expenseName?.id);
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
      lineItem.receiptNote = this.currReceiptNote; // this line will be change

      this.newRecord = false;
      this.islineAvaliable = true;

      var _lineItem = lineItem;
      if (_lineItem.id) {

        // line line item should have id inside
        this.submitted = true;
        this.usedService.updateReceiptNoteLineItem(lineItem).then(
          (res) => {
            this.submitted = false;
            _lineItem = res;
            this.getReceiptNote();
            this.message.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Receipt Note Line Item Updated Successfully',
              life: 3000,
            });
          }
        ).catch(
          (err) => {
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
        this.usedService.createReceiptNoteLineItem(lineItem).then(
          (res) => {
            console.log(res);
            _lineItem = res;
            this.getReceiptNote();
            this.submitted = false;
            this.message.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Receipt Note Line item Added',
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

  onRowEditCancel(lineItem: rnLineItem, index: any) {
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
        this.usedService.fileUploadForReceiptNote(this.id, this.currentFile).subscribe({
          next: (event: any) => {
            if (event.type === HttpEventType.UploadProgress) {
              this.progress = Math.round((100 * event.loaded) / event.total);
            } else if (event.ok == true) {
              // this.message = event.body.message;
              this.submitted = false;
              this.message.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Receipt Note File Added Successfully ',
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

  finalRNSubmitPage() {
    // updated complete PO so that gross total can be updated
    if (this.rnForm.value.vendor.id == null || this.rnForm.value.vendor.id == "") {
      this.rnForm.value.vendor = null;
    } else {
      this.rnForm.value.customer = null;
    }

    var rnFormVal = this.rnForm.value;
    rnFormVal.id = this.id;
    rnFormVal.grossTotal = this.rnSubTotal;
    rnFormVal.comapny = this.currentCompany;

    if (rnFormVal.id) {
      this.submitted = true;
      this.billS.updateReceiptNote(rnFormVal).then((res: any) => {
        console.log(res);
        this.rnForm.patchValue = { ...res };
        this.submitted = false;
        this.message.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Receipt Note Saved Successfully',
          life: 3000
        });
        this.upload();
        setTimeout(() => {
          this.router.navigate(['/bills/receiptNote']);
        }, 2000);
      }
      ).catch(
        (err) => {
          console.log(err);
          this.submitted = false;
        });
    }

  }

  createRN() {
    //this.createNew = true;
    this.router.navigate(['/bills/receiptNote/create']);
  }

  OnCancelRN() {
    this.createNew = false;
    this.router.navigate(['/bills/receiptNote']);

  }

  delete(lineItem: rnLineItem) {
    this.deleteDialogvisible = true;
  }

  cancelDeleteConfirm() {
    this.deleteDialogvisible = false;
  }

  deleteConfirm(lineItem: any) {
    this.submitted = true;
    this.usedService.deleteReceiptNoteLineItem(lineItem.id).then((data: any) => {
      this.lineitems = this.lineitems.filter((val) => val.id !== lineItem.id);

      this.rnSubTotal = this.lineitems.reduce((total, lineItem) => {
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
}


