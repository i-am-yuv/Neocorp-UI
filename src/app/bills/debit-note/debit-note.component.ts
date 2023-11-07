import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Product, State } from 'src/app/profile/profile-models';
import { CustomeR, Vendor } from 'src/app/settings/customers/customer';
import { DebitNote, dnLineItem } from '../bills-model';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { PayPageService } from 'src/app/pay/pay-page.service';
import { BillsService } from '../bills.service';
import { HttpEventType } from '@angular/common/http';
import { CompanyNew } from 'src/app/invoice/invoice-model';
import { AuthService } from 'src/app/auth/auth.service';
import { BreadCrumbService } from 'src/app/shared/navbar/bread-crumb.service';

@Component({
  selector: 'app-debit-note',
  templateUrl: './debit-note.component.html',
  styleUrls: ['./debit-note.component.scss']
})
export class DebitNoteComponent implements OnInit {

  submitted: boolean = false;
  createNew: boolean = false;
  DeleteDialLogvisible: boolean = false;

  id: string | null = '';
  dnForm !: FormGroup;

  vendors: Vendor[] = [];

  products: Product[] = [];
  states: State[] = [];

  lineitems: any[] = [];
  currDebitNote: DebitNote = {};

  editing: any;
  viewOnly: boolean = false;
  newRecord: boolean = false;
  isquantity: boolean = false;
  islineAvaliable: boolean = false;

  viewLineItemTable: boolean = false;

  uploadMessage = '';
  dnSubTotal: number = 0;

  mergedOptions: any[] = [];
  selectedOption: any;

  items!: MenuItem[];
  sidebarVisibleProduct: boolean = false;
  currCompany: CompanyNew = {};

  constructor(private router: Router,
    private route: ActivatedRoute,
    private message: MessageService,
    private fb: FormBuilder,
    private usedService: PayPageService,
    private billS: BillsService, private authS: AuthService, private breadcrumbS: BreadCrumbService) {
  }

  ngOnInit(): void {
    this.breadcrumbS.breadCrumb([{ label: 'Debit Note', routerLink: ['/bills/debitNotes'] }]);
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
        this.availableDN();
      }
    });

    this.sidebarVisibleProduct = false;

    this.initForm();
    this.loadVendors();
    this.loadStates();
    this.loadProducts();
    this.getDebitNote();
  }

  initForm() {
    this.dnForm = new FormGroup({
      id: new FormControl(''),
      debitNoteNumber: new FormControl(''),
      startDate: new FormControl('', Validators.required),//
      duedate: new FormControl('', Validators.required),//
      internalNotes: new FormControl(''),//
      vendor: this.fb.group({
        id: this.fb.nonNullable.control('', {
          validators: Validators.required,
        })
      }),
      placeOfSupply: this.fb.group({
        id: this.fb.nonNullable.control('')
      }),
      notes: new FormControl(''),
      grossTotal: new FormControl('')
    });
  }

  availableDN() {
    this.submitted = true;
    this.billS.getAllDn(this.currentUser).then(
      (res) => {
        this.submitted = false;
        var count = res.length;
        //count=0
        if (count > 0) {
          this.router.navigate(['/bills/debitNotes']);
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

  currentUser: any = {};
  loadUser() {
    this.submitted = true;
    this.authS.getUser().then((res: any) => {
      this.currCompany = res.comapny;
      this.currentUser = res;
      this.submitted = false;
      this.loadOtherInfo();
    })
      .catch((err) => {
        console.log(err);
        this.submitted = false;
      });
  }

  loadStates() {
    this.submitted = true;
    this.usedService.allState().then(
      (res) => {
        this.states = res.content;
        this.submitted = false;
        console.log(res);
      }
    ).catch(
      (err) => {
        console.log(err);
        this.submitted = false;
      }
    )
  }

  getDebitNote() {
    if (this.id) {
      this.submitted = true;
      this.billS.getCurrentDn(this.id).then(
        (debitNote: DebitNote) => {
          debitNote.duedate = debitNote.duedate ? new Date(debitNote.duedate) : undefined;
          debitNote.startDate = debitNote.startDate ? new Date(debitNote.startDate) : undefined;
          console.log(debitNote);
          this.submitted = false;
          this.currDebitNote = debitNote;
          this.dnForm.patchValue(debitNote);
          this.getLines(debitNote); //Because backend api is not ready
        }
      ).catch(
        (err) => {
          console.log(err);
          this.submitted = false;
        }
      )
    }
  }

  getLines(debitNote: DebitNote) {
    this.submitted = true;
    this.billS
      .getLineitemsByDn(debitNote)
      .then((data: any) => {
        if (data) {
          this.lineitems = data;
          this.dnSubTotal = this.lineitems.reduce(
            (total, lineItem) => total + lineItem.amount, 0
          );
          this.submitted = false;
        }
        this.submitted = false;
      });
  }

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

  selectVendor() { }

  onSubmitDN() {
    var dnFormVal = this.dnForm.value;
    dnFormVal.id = this.id;
    dnFormVal.comapny = this.currCompany;

    if (dnFormVal.id) {
      this.submitted = true;
      this.billS.updateDebitNote(dnFormVal).then(
        (res) => {
          console.log(res);
          this.dnForm.patchValue = { ...res };
          this.submitted = false;
          this.message.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Debit Note updated',
            life: 3000,
          });
        }
      ).catch(
        (err) => {
          console.log(err)
          this.submitted = false;
          this.message.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Debit Note Updation Error',
            life: 3000,
          });
        }
      )
    }
    else {

      this.submitted = true;
      dnFormVal.user = this.currentUser;

      this.billS.createDebitNote(dnFormVal).then(
        (res) => {
          console.log(res);
          this.dnForm.patchValue = { ...res };
          this.currDebitNote = res;

          this.viewLineItemTable = true;
          this.submitted = false;
          this.message.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Debit Note Added Successfully',
            life: 3000,
          });
          setTimeout(() => {
            this.router.navigate(['bills/debitNote/edit/' + res.id]);
          }, 2000);
        }
      ).catch(
        (err) => {
          console.log(err);
          this.viewLineItemTable = false;
          this.submitted = false;
          this.message.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error while saving debit note',
            life: 3000,
          });
        })
    }
  }

  setLineValues(lineItem: dnLineItem) {
    var dc = this.products.find((t) => t.id === lineItem.expenseName?.id);
  }

  setLineQtyValuesQuantity(e: any, lineItem: dnLineItem) {
    if (e.value == null || e.value == 0) {
      this.isquantity = false;
    }
    if (e.value) {
      lineItem.quantity = e.value;
      this.setLineValues(lineItem);
      this.isquantity = true;
    }
  }

  setLineQtyValuesPrice(e: any, lineItem: dnLineItem) {

  }

  setLineQtyValuesDiscount(e: any, lineItem: dnLineItem) {

  }


  onRowEditInit(lineItem: dnLineItem) {

  }
  delete(lineItem: dnLineItem) {
    this.DeleteDialLogvisible = true;
  }

  onRowEditSave(lineItem: dnLineItem) {

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
      lineItem.debitNote = this.currDebitNote; // this line will be change

      this.newRecord = false;
      this.islineAvaliable = true;
      console.log(lineItem);

      var _lineItem = lineItem;

      if (_lineItem.id) {
        // line line item should have id inside
        this.submitted = true;
        this.usedService.updateDebitNoteLineItem(lineItem).then(
          (res) => {

            _lineItem = res;
            // this.lineitem.Amount = res.Amount;
            this.submitted = false;
            this.getDebitNote();
            this.message.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Debit Note Line item Updated Successfully',
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
              detail: 'Debit Note Error While updating Line Item',
              life: 3000,
            });
          }
        )
      }
      else {
        this.submitted = true;
        this.usedService.createDebitNoteLineItem(lineItem).then(
          (res) => {
            console.log(res);
            _lineItem = res;
            this.submitted = false;
            this.getDebitNote();
            this.message.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Debit Note Line item Added Successfully',
              life: 3000,
            });
          }
        ).catch((err) => {
          console.log(err);
          this.submitted = false;
          this.message.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error while Adding Debit Note Line Item',
            life: 3000,
          });
        })
      }
    }

  }

  onRowEditCancel(lineItem: dnLineItem, index: any) {
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
      if (file) {
        this.currentFile = file;


        this.usedService.fileUploadForDebitNote(this.id, this.currentFile).subscribe({
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

  finalDNSubmitPage() {

    var rnFormVal = this.dnForm.value;

    rnFormVal.id = this.id;
    rnFormVal.grossTotal = this.dnSubTotal;
    rnFormVal.comapny = this.currCompany;

    if (rnFormVal.id) {
      this.submitted = true;

      this.billS.updateDebitNote(rnFormVal).then(
        (res) => {
          console.log(res);
          this.submitted = false;
          this.dnForm.patchValue = { ...res };
          this.message.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Debit Note Saved Successfully',
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
            detail: 'Error while saving debit note',
            life: 3000,
          });
        }
      )
    }

    setTimeout(() => {
      this.router.navigate(['/bills/debitNote']);
    }, 2000);

  }

  createDN() {
    this.router.navigate(['/bills/debitNote/create']);
  }

  OnCancelDN() {
    this.createNew = false;
    this.router.navigate(['/bills/debitNote']);
  }


  cancelDeleteConfirm() {
    this.DeleteDialLogvisible = false;
  }

  deleteConfirm(lineItem: any) {
    this.submitted = true;
    this.usedService
      .deleteDebitNoteLineItem(lineItem.id)
      .then((data) => {

        this.lineitems = this.lineitems.filter(
          (val) => val.id !== lineItem.id
        );

        this.dnSubTotal = this.lineitems.reduce(
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
}
