import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Product, State } from 'src/app/profile/profile-models';
import { CustomeR, Vendor } from 'src/app/settings/customers/customer';
import { DebitNote, dnLineItem } from '../bills-model';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PayPageService } from 'src/app/pay/pay-page.service';
import { BillsService } from '../bills.service';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-debit-note',
  templateUrl: './debit-note.component.html',
  styleUrls: ['./debit-note.component.scss']
})
export class DebitNoteComponent implements OnInit {

  submitted : boolean =  false;
  createNew : boolean = false;

  id: string | null = '';
  dnForm !: FormGroup ;

  vendors: Vendor[] = [];
  
  products: Product[] = [];
  states: State[] = [];

  lineitems: any[] = [];
  currDebitNote:DebitNote = {};

  editing: any;
  viewOnly: boolean = false;
  newRecord: boolean = false;
  isquantity: boolean = false;
  islineAvaliable: boolean = false;

  viewLineItemTable: boolean = false;

  uploadMessage = '';
  dnSubTotal: number = 0;

  mergedOptions: any[] = [];
  selectedOption : any;


  constructor(private router: Router,
    private route: ActivatedRoute,
    private message: MessageService,
    private fb: FormBuilder,
    private usedService: PayPageService,
    private billS: BillsService,
    private confirmationService: ConfirmationService) {     
     }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');

    this.route.url.subscribe(segments => {
      let lastSegment = segments[segments.length - 1];
      if (lastSegment && lastSegment.path == 'create') {
        this.createNew = true;
      } 
      else if(lastSegment && lastSegment.path == this.id){
        this.createNew =  true;
      }
      else{
        this.availableDN();
      }
    });

    this.initForm();
    this.loadVendors();
    this.loadStates();
    this.loadProducts();
    this.getDebitNote();
    
 //   this.bind();
    
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
      debitNote: new FormControl('') ,
      grossTotal: new FormControl('')
    });
  }

  availableDN()
  {
    this.submitted = true;
    this.billS.getAllDn().then(
     (res) => {
       this.submitted = false;
       var count = res.totalElements ;
       //count=0
       if( count > 0 )
       {
         this.router.navigate(['/bills/debitNotes']) ;
       }
       else{
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

  loadStates()
  {
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
    this.usedService.allVendor().then(
      (res) => {
        this.vendors = res.content;
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
    this.usedService.allProduct().then(
      (res) => {
        this.products = res.content;
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

  selectVendor(){}

  onSubmitDN()
  {

    var dnFormVal = this.dnForm.value;
    dnFormVal.id = this.id;
    dnFormVal.placeOfSupply = null ;
    alert(JSON.stringify(dnFormVal));

    if (dnFormVal.id) {
      this.submitted = true;
      this.billS.updateDebitNote(dnFormVal).then(
        (res) => {
          console.log(res);
          this.dnForm.patchValue = { ...res };
          this.submitted = false;
          this.message.add({
            severity: 'success',
            summary: 'Debit Note Updated',
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
            summary: 'Debit Note updated Error',
            detail: 'Debit Note Error',
            life: 3000,
          });
        }
      )
    }
    else {
      //  poFormVal.grossTotal = this.poSubTotal ;
      this.upload(); // for upload file if attached
      this.submitted =  true;

      this.billS.createDebitNote(dnFormVal).then(
        (res) => {
          console.log(res);
          this.dnForm.patchValue = { ...res };
          this.currDebitNote = res;
          // this.id = res.id;
          console.log("Debit Note Added");
          console.log(this.currDebitNote);
          this.viewLineItemTable = true;
          this.submitted = false;
          this.message.add({
            severity: 'success',
            summary: 'Debit Note Saved',
            detail: 'Debit Note Added',
            life: 3000,
          });
          this.router.navigate(['bills/debitNote/edit/' + res.id]);
        }
      ).catch(
        (err) => {
          console.log(err);
          this.viewLineItemTable = false;
          this.submitted = false;
          this.message.add({
            severity: 'error',
            summary: 'Debit Note error',
            detail: 'Some Server Error',
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

    //(JSON.stringify(lineItem));
    // this.confirmationService.confirm({
    //   message: 'Are you sure you want to deleteeeeeeeeeeeee ' + lineItem.expenseName?.name + '?',
    //   header: 'Confirm',
    //   icon: 'pi pi-exclamation-triangle',
    //   accept: () => {

    //   },
    // });
  }

  onRowEditSave(lineItem: dnLineItem) {
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
      lineItem.debitNote = this.currDebitNote; // this line will be change

      this.newRecord = false;
      this.islineAvaliable = true;
      console.log(lineItem);

      var _lineItem = lineItem;

      if (_lineItem.id) {
        alert("Update Line Item Entered");
        // line line item should have id inside
        this.submitted = true;
        this.usedService.updateDebitNoteLineItem(lineItem).then(
          (res) => {
            console.log("Line Item Updated Successfully");
            _lineItem = res;
           // this.lineitem.Amount = res.Amount;
           this.submitted = false;
            this.getDebitNote();
            this.message.add({
              severity: 'success',
              summary: 'Line item Updated',
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
              summary: 'Line item Update Error',
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
              summary: 'Line item Added',
              detail: 'Debit Note Line item Added Successfully',
              life: 3000,
            });
          }
        ).catch((err) => {
          console.log(err);
          this.submitted = false;
          this.message.add({
            severity: 'error',
            summary: 'Line Item Error',
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
    this.message.add({
      severity: 'success',
      summary: 'File Attached',
      detail: 'File Attached Successfully',
      life: 2000,
    });
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
    rnFormVal.grossTotal = this.dnSubTotal ;
    if (rnFormVal.id) {

      this.submitted = true;
      this.billS.updateDebitNote(rnFormVal).then(
        (res) => {
          console.log(res);
          this.submitted = false;
          this.dnForm.patchValue = { ...res };
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
        summary: 'Debit Note Created Successfully',
        detail: 'Debit Note created',
        life: 3000,
      });
      this.upload();
      this.router.navigate(['/bills/debitNote']);
  }

  createDN()
  {
    this.router.navigate(['/bills/debitNote/create']);
  }

  OnCancelDN()
  {
    this.createNew = false;
    this.router.navigate(['/bills/debitNote']);
  }


}
