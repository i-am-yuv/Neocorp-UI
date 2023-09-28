import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Product } from 'src/app/profile/profile-models';
import { CustomeR, Vendor } from 'src/app/settings/customers/customer';
import { PayPageService } from '../pay-page.service';
import { ReturnRefund, ReturnRefundLine } from '../pay-model';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-return-refund',
  templateUrl: './return-refund.component.html',
  styleUrls: ['./return-refund.component.scss']
})
export class ReturnRefundComponent implements OnInit {


  submitted : boolean =  false;
  createNew : boolean =  false;

  id: string | null = '';
  rrForm !: FormGroup;

  allSalesOrders: any[] = [];
  products: Product[] = [];


  lineitems: any[] = [];
  
  currReturnRefund: ReturnRefund = {};

  editing: any;
  viewOnly: boolean = false;
  newRecord: boolean = false;
  isquantity: boolean = false;
  islineAvaliable: boolean = false;

  viewLineItemTable: boolean = false;

  uploadMessage = '';
  returnRefundSubTotal: number = 0;
  returnRefundQty : number = 0 ;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private message: MessageService,
    private fb: FormBuilder,
    private usedService: PayPageService,
    private confirmationService: ConfirmationService) { }

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
        this.availableRR();
      }
    });

    this.initForm();
    this.loadProducts();
    this.loadSalesOrder();
    this.getReturnRefund();
  }

  initForm() {

    this.rrForm = new FormGroup({
      id: new FormControl(''),
      documentNo: new FormControl(''),
      refund: new FormControl('', Validators.required),
      processDate: new FormControl('', Validators.required),
      grossTotal: new FormControl(''),
      reason: new FormControl('', Validators.required),
      salesOrder: this.fb.group({
        id: this.fb.nonNullable.control('', {
          validators: Validators.required,
        })
      })
    });

  }

  availableRR()
  {
    this.submitted = true;
    this.usedService.getAllRR().then(
     (res) => {
       this.submitted = false;
       var count = res.totalElements ;
       //count=0
       if( count > 0 )
       {
         this.router.navigate(['/pay/returnAndRefunds']) ;
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

  loadSalesOrder() {
    this.usedService.allSO().then(
      (res: any) => {
        this.allSalesOrders = res.content;
      }
    ).catch(
      (err) => {
        console.log(err);
      }
    )
  }

  getReturnRefund() {
    if (this.id) {
      this.submitted =  true;
      this.usedService.getCurrentReturnRefund(this.id).then(
        (returnRefund: ReturnRefund) => {
          returnRefund.processDate = returnRefund.processDate ? new Date(returnRefund.processDate) : undefined;
          
          console.log(returnRefund);
          this.currReturnRefund = returnRefund;
          this.rrForm.patchValue(returnRefund);
          this.submitted = false;
          this.getLines(returnRefund); //Because backend api is not ready
        }
      ).catch(
        (err) => {
          console.log(err);
        }
      )
    }
  }

  getLines(returnRefund: ReturnRefund) {
    this.submitted = true;
    this.usedService
      .getLineitemsByRR(returnRefund)
      .then((data: any) => {
        if (data) {
          this.lineitems = data;
          this.returnRefundSubTotal = this.lineitems.reduce(
            (total, lineItem) => total + lineItem.amount, 0
          );
          this.submitted = false;
        }
      });
  }

  onSubmitReturnRefund() {

    var rrFormVal = this.rrForm.value ;
    rrFormVal.id = this.id;
    // rrFormVal['orderLine'] = {};
    // rrFormVal['orderLine']['order'] = {};
    // rrFormVal['orderLine']['order']['id'] = this.rrForm.value.order.id;

    console.log(rrFormVal);

    if (rrFormVal.id) 
    {
      //this.poForm.value.id = poFormVal.id;
      this.submitted = true;
      this.usedService.updateReturnRefund(rrFormVal).then(
        (res) => {
          console.log(res);
          this.rrForm.patchValue = { ...res };
          this.submitted = false;
          this.message.add({
            severity: 'success',
            summary: 'Return & Refund Updated',
            detail: 'Return & Refund Updated Successfully',
            life: 3000,
          });
        }
      ).catch(
        (err) => {
          console.log(err);
          this.submitted = false;
          this.message.add({
            severity: 'error',
            summary: 'Return & Refund Updated Error',
            detail: 'Return & Refund Error',
            life: 3000,
          });
        }
      )
    }
    else {
     // this.upload(); // for upload file if attached
     this.submitted = true;
      this.usedService.createReturnRefund(rrFormVal).then(
        (res) => {
          console.log(res);
          this.rrForm.patchValue = { ...res };
          this.currReturnRefund = res;
          // this.id = res.id;
          console.log("Return Refund Added");
          console.log(this.currReturnRefund);
          this.viewLineItemTable = true;
          this.submitted = false;
          this.message.add({
            severity: 'success',
            summary: 'Return and Refund Saved',
            detail: 'Return and Refund Added Successfully',
            life: 3000,
          });
          this.router.navigate(['pay/returnAndRefund/edit/' + res.id]);
        }
      ).catch(
        (err) => {
          console.log(err);
          this.viewLineItemTable = false;
          this.submitted = false;
          this.message.add({
            severity: 'error',
            summary: 'Return and Refund error',
            detail: 'Return and Refund Error',
            life: 3000,
          });
        })
    }
  }

  selectVendor(){}

  setLineValues(lineItem: ReturnRefundLine) {
    var dc = this.products.find((t) => t.id === lineItem.expenseName?.id);
  }

  setLineQtyValuesQuantity(e: any, lineItem: ReturnRefundLine) {
    if (e.value == null || e.value == 0) {
      this.isquantity = false;
    }
    if (e.value) {
      lineItem.quantity = e.value;
      this.setLineValues(lineItem);
      this.isquantity = true;
    }
  }

  setLineQtyValuesPrice(e: any, lineItem: ReturnRefundLine) {

  }

  setLineQtyValuesDiscount(e: any, lineItem: ReturnRefundLine) {

  }


  onRowEditInit(lineItem: ReturnRefundLine) {

  }
  delete(lineItem: ReturnRefundLine) {
    //(JSON.stringify(lineItem));
    this.confirmationService.confirm({
      message: 'Are you sure you want to deleteeeeeeeeeeeee ' + lineItem.expenseName?.name + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {

      },
    });

  }
  onRowEditSave(lineItem: ReturnRefundLine) {
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
      lineItem.returnRefund = this.currReturnRefund; // this line will be change

      this.newRecord = false;
      this.islineAvaliable = true;
      console.log(lineItem);

      var _lineItem = lineItem;

      if (_lineItem.id) {
        alert("Update Line Item Entered");
        // line line item should have id inside
        this.submitted = true;
        this.usedService.updateReturnRefundLineItem(lineItem).then(
          (res) => {
            console.log("Line Item Updated Successfully");
            _lineItem = res;
           // this.lineitem.Amount = res.Amount;
            this.getReturnRefund();
            this.submitted = false;
            this.message.add({
              severity: 'success',
              summary: 'Line item Updated',
              detail: 'Return Refund Line item Updated Successfully',
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
              detail: 'Error While updating Return Refund Line Item',
              life: 3000,
            });
          }
        )
      }
      else {
        this.submitted = true;
        this.usedService.createReturnRefundLineItem(lineItem).then(
          (res) => {
            console.log(res);
            _lineItem = res;
            this.getReturnRefund();
            this.submitted = false;
            this.message.add({
              severity: 'success',
              summary: 'Line item Added',
              detail: 'Return & Refund Line item Added Successfully',
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

  onRowEditCancel(lineItem: ReturnRefundLine, index: any) {
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

  upload() {
    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);
      //var data = this.productForm.value;
      //console.log(this.productForm.value);
      //var jsonString = JSON.stringify(this.productForm.value);
      if (file) {
        this.currentFile = file;

        this.usedService.fileUploadForCashMemo(this.id, this.currentFile).subscribe({
          next: (event: any) => {
            if (event.type === HttpEventType.UploadProgress) {
              this.progress = Math.round((100 * event.loaded) / event.total);
            } else if (event.ok == true) {
              // this.message = event.body.message;
              this.message.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Return Refund File Added Successfully ',
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

  finalReturnRefundSubmitPage() {
    // updated complete PO so that gross total can be updated
    var rrFormVal = this.rrForm.value;
    rrFormVal.id = this.id;
    rrFormVal.grossTotal = this.returnRefundSubTotal ;
   
    if (rrFormVal.id) {
      this.submitted = true;
      this.usedService.updateReturnRefund(rrFormVal).then(
        (res) => {
          console.log(res);
          this.rrForm.patchValue = { ...res };
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
        summary: 'Return & Refund Created Successfully',
        detail: 'Return & Refund  created',
        life: 3000,
      });
      this.router.navigate(['/pay/returnAndRefund']);
  }

  createRR()
  {
    this.router.navigate(['/pay/returnAndRefund/create']);
  }

  OnCancelRR()
  {
    this.router.navigate(['/pay/returnAndRefund']);
  }

}
