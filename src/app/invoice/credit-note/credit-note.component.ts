import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Product, State } from 'src/app/profile/profile-models';
import { CustomeR, Vendor } from 'src/app/settings/customers/customer';
import { CompanyNew, CreditNote, cnLineItem } from '../invoice-model';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { PayPageService } from 'src/app/pay/pay-page.service';
import { BillsService } from 'src/app/bills/bills.service';
import { HttpEventType } from '@angular/common/http';
import { InvoiceService } from '../invoice.service';
import { LineItem } from 'src/app/bills/bills-model';
import { AuthService } from 'src/app/auth/auth.service';
import { BreadCrumbService } from 'src/app/shared/navbar/bread-crumb.service';

@Component({
  selector: 'app-credit-note',
  templateUrl: './credit-note.component.html',
  styleUrls: ['./credit-note.component.scss']
})
export class CreditNoteComponent implements OnInit {


  submitted: boolean = false;
  createNew: boolean = false;
  DeleteDialLogvisible: boolean = false;
  currentUser: any = {};

  id: string | null = '';
  cnForm !: FormGroup;

  vendors: Vendor[] = [];
  products: Product[] = [];
  customers: CustomeR[] = [];
  states: State[] = [];
  lineitems: any[] = [];
  currCreditNote: CreditNote = {};

  editing: any;
  viewOnly: boolean = false;
  newRecord: boolean = false;
  isquantity: boolean = false;
  islineAvaliable: boolean = false;

  viewLineItemTable: boolean = false;

  uploadMessage = '';
  cnSubTotal: number = 0;

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
  sidebarVisibleProduct: boolean = false;
  currentCompany: CompanyNew = {};
  currentDeleteLineItem: any;


  constructor(private router: Router,
    private route: ActivatedRoute,
    private message: MessageService,
    private fb: FormBuilder,
    private usedService: PayPageService,
    private invoiceS: InvoiceService,
    private authS: AuthService, private breadCrumbService: BreadCrumbService) {


  }

  ngOnInit(): void {

    this.loadUser();
  }

  loadOtherInfo() {
    this.id = this.route.snapshot.paramMap.get('id');

    if (this.id === null) {
      this.breadCrumbService.breadCrumb([{ label: 'Credit Note', routerLink: ['/invoice/creditNotes'] }, { label: 'Create' }]);
    } else {
      this.breadCrumbService.breadCrumb([{ label: 'Credit Note', routerLink: ['/invoice/creditNotes'] }, { label: 'Edit' }]);
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
        this.availableCN();
      }
    });

    this.initForm();
    this.loadStates();
    this.loadProducts();
    this.loadCustomer();
    this.getCreditNote();
    this.sidebarVisibleProduct = false;
  }

  initForm() {
    this.cnForm = new FormGroup({
      id: new FormControl(''),
      creditNoteNo: new FormControl(''),
      startdate: new FormControl('', Validators.required),//
      duedate: new FormControl('', Validators.required),//
      creditNoteDescription: new FormControl(''),//
      notes: new FormControl(''),//
      requestStatus: new FormControl(''),
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



  availableCN() {
    this.submitted = true;
    this.invoiceS.getAllCn(this.currentUser).then(
      (res) => {

        var count = res.length;
        this.submitted = false;

        if (count > 0) {
          this.router.navigate(['/invoice/creditNotes']);
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

  loadStates() {
    this.submitted = true;
    this.usedService.allState().then(
      (res) => {
        this.states = res.content;
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

  getCreditNote() {
    if (this.id) {
      this.submitted = true;
      this.invoiceS.getCurrentCn(this.id).then(
        (creditNote: CreditNote) => {
          creditNote.duedate = creditNote.duedate ? new Date(creditNote.duedate) : undefined;
          creditNote.startdate = creditNote.startdate ? new Date(creditNote.startdate) : undefined;
          console.log(creditNote);
          this.currCreditNote = creditNote;
          this.cnForm.patchValue(creditNote);
          this.submitted = false;
          this.getLines(creditNote); //Because backend api is not ready
        }
      ).catch(
        (err) => {
          console.log(err);
          this.submitted = false;
        }
      )
    }
  }

  getLines(creditNote: CreditNote) {
    this.submitted = true;
    this.invoiceS
      .getLineitemsByCn(creditNote)
      .then((data: any) => {
        if (data) {
          this.lineitems = data;
          this.cnSubTotal = this.lineitems.reduce(
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
    this.submitted = true;
    this.usedService.allCustomer(this.currentUser).then(
      (res) => {
        this.customers = res;
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
    ).catch(
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

  loadUser() {
    this.submitted = true;
    this.authS.getUser().then((res: any) => {
      this.currentUser = res;
      this.currentCompany = res.comapny;
      this.submitted = false;

      this.loadOtherInfo();
    })
      .catch((err) => {
        console.log(err);
        this.submitted = false;
      })
  }

  selectVendor() { }

  onSubmitCN() {
    this.cnForm.value.branch = this.currentUser.branch;

    var cnFormVal = this.cnForm.value;
    cnFormVal.id = this.id;
    cnFormVal.comapny = this.currentCompany;

    if (cnFormVal.id) {
      //this.poForm.value.id = poFormVal.id;
      this.submitted = true;
      this.invoiceS.updateCreditNote(cnFormVal).then(
        (res) => {
          console.log(res);
          this.cnForm.patchValue = { ...res };
          this.submitted = false;
          this.message.add({
            severity: 'success',
            summary: 'Credit Note Updated',
            detail: 'Credit Note updated',
            life: 3000,
          });
        }
      ).catch(
        (err) => {
          console.log(err);
          this.submitted = false;
          this.message.add({
            severity: 'error',
            summary: 'Credit Note updated Error',
            detail: 'Credit Note Error',
            life: 3000,
          });
        }
      )
    }
    else {
      //  poFormVal.grossTotal = this.poSubTotal ;
      this.upload(); // for upload file if attached
      this.submitted = true;
      cnFormVal.user = this.currentUser;
      this.invoiceS.createCreditNote(cnFormVal).then(
        (res) => {
          console.log(res);
          this.cnForm.patchValue = { ...res };
          this.currCreditNote = res;
          this.submitted = false;
          this.message.add({
            severity: 'success',
            summary: 'Credit Note Saved',
            detail: 'Credit Note Saved',
            life: 3000,
          });
          setTimeout(() => {
            this.router.navigate(['invoice/creditNote/edit/' + res.id]);
          }, 2000);

        }
      ).catch(
        (err) => {
          console.log(err);
          this.submitted = false;
          this.viewLineItemTable = false;
          this.message.add({
            severity: 'error',
            summary: 'Credit Note error',
            detail: 'Some Server Error',
            life: 3000,
          });
        })
    }
  }

  setLineValues(lineItem: cnLineItem) {
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

  setLineQtyValuesQuantity(e: any, lineItem: cnLineItem) {
    if (e.value == null || e.value == 0) {
      this.isquantity = false;
    }
    if (e.value) {
      lineItem.quantity = e.value;
      this.setLineValues(lineItem);
      this.isquantity = true;
    }
  }

  setLineQtyValuesPrice(e: any, lineItem: cnLineItem) {

  }

  setLineQtyValuesDiscount(e: any, lineItem: cnLineItem) {

  }


  onRowEditInit(lineItem: cnLineItem) {

  }

  delete(lineItem: cnLineItem) {
    this.currentDeleteLineItem = lineItem;
    this.DeleteDialLogvisible = true;
  }

  onRowEditSave(lineItem: cnLineItem) {

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
      this.getLines(this.currCreditNote);
      this.newRecord = false;
    }
    else {
      // alert(JSON.stringify(lineItem));
      var currentProduct = this.products.find((t) => t.id === lineItem.expenseName?.id);
      console.log("current Product"); console.log(currentProduct);
      if (lineItem.discount == null || lineItem.discount == 0) {

      }
      if (lineItem.unitPrice == null || lineItem.unitPrice == 0) {
        lineItem.unitPrice = currentProduct?.mrp;
      }
      if (currentProduct == null || currentProduct == undefined || lineItem.expenseName == null) {

        this.message.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Please Select the Product',
          life: 3000,
        });
      }
      else {
        lineItem.expenseName = currentProduct;
        lineItem.creditNote = this.currCreditNote; // this line will be change

        this.newRecord = false;
        this.islineAvaliable = true;
        console.log(lineItem);

        var _lineItem = lineItem;

        if (_lineItem.id) {
          // alert("Update Line Item Entered");
          // line line item should have id inside
          this.submitted = true;
          this.usedService.updateCreditNoteLineItem(lineItem).then(
            (res) => {
              console.log("Line Item Updated Successfully");
              _lineItem = res;
              // this.lineitem.Amount = res.Amount;
              this.getCreditNote();
              this.submitted = false;
              this.message.add({
                severity: 'success',
                summary: 'Line item Updated',
                detail: 'Credit Note Line item Updated Successfully',
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
                detail: 'Error While updating Credit Note Line Item',
                life: 3000,
              });
            }
          )
        }
        else {
          this.submitted = true;
          this.usedService.createCreditNoteLineItem(lineItem).then(
            (res) => {
              console.log(res);
              _lineItem = res;
              this.getCreditNote();
              this.submitted = false;
              this.message.add({
                severity: 'success',
                summary: 'Line item Added',
                detail: 'Credit Note Line item Added Successfully',
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
  }

  onRowEditCancel(lineItem: cnLineItem, index: any) {
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
        this.submitted = true;
        this.usedService.fileUploadForCreditNote(this.id, this.currentFile).subscribe({
          next: (event: any) => {
            if (event.type === HttpEventType.UploadProgress) {
              this.progress = Math.round((100 * event.loaded) / event.total);
            } else if (event.ok == true) {
              // this.message = event.body.message;
              this.submitted = false;
              this.message.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Credit Note File Added Successfully ',
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

  finalCNSubmitPage() {
    var cnFormVal = this.cnForm.value;
    cnFormVal.id = this.id;
    cnFormVal.grossTotal = this.cnSubTotal;
    cnFormVal.comapny = this.currentCompany;

    if (cnFormVal.id) {
      this.submitted = true;
      this.invoiceS.updateCreditNote(cnFormVal).then(
        (res) => {
          console.log(res);
          this.cnForm.patchValue = { ...res };
          this.submitted = false;
          this.message.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Credit Note Saved',
            life: 3000,
          });

          this.upload();
          setTimeout(() => {
            this.router.navigate(['/invoice/creditNote']);
          }, 2000);

        }
      ).catch(
        (err) => {
          this.submitted = false;
          console.log(err);
          this.message.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Credit Note error',
            life: 3000,
          });
        }
      )
    }

  }

  createCN() {
    this.router.navigate(['/invoice/creditNote/create']);
  }

  OnCancelCN() {
    //this.createNew = false;
    this.router.navigate(['/invoice/creditNote']);
  }

  cancelDeleteConfirm() {
    this.currentDeleteLineItem = null;
    this.DeleteDialLogvisible = false;
  }

  deleteConfirm(lineItem: any) {
    this.submitted = true;
    this.usedService
      .deleteCreditNoteLineItem(lineItem.id)
      .then((data) => {
        this.lineitems = this.lineitems.filter(
          (val) => val.id !== lineItem.id
        );

        this.cnSubTotal = this.lineitems.reduce(
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

  loadAllProductsNow() {
    this.loadProducts();
  }

}
