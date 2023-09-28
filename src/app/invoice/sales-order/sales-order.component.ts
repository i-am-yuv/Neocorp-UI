import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Product } from 'src/app/profile/profile-models';
import { Vendor } from 'src/app/settings/customers/customer';
import { SalesOrder, SalesOrderLine } from '../invoice-model';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PayPageService } from 'src/app/pay/pay-page.service';
import { InvoiceService } from '../invoice.service';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-sales-order',
  templateUrl: './sales-order.component.html',
  styleUrls: ['./sales-order.component.scss']
})
export class SalesOrderComponent implements OnInit {

  id: string | null = '';
  soForm!: FormGroup;

  submitted : boolean =  false;
  createNew : boolean =  false;

  vendors: Vendor[] = [];
  products: Product[] = [];

  lineitems: any[] = [];
  currentSoOrder: SalesOrder = {};

  editing: any;
  viewOnly: boolean = false;
  newRecord: boolean = false;
  isquantity: boolean = false;
  islineAvaliable: boolean = false;

  viewLineItemTable: boolean = false;

  uploadMessage = '';
  soSubTotal: number = 0;

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
      else if(lastSegment && lastSegment.path == this.id){
        this.createNew =  true;
      }
      else{
        this.availableSO();
      }
    });

    this.initForm();
    this.soForm.value.enablePartialPayments = false;
    this.loadVendors();
    this.loadProducts();
    this.getSoOrder();
  }

  initForm() {
    this.soForm = new FormGroup({
      documentno: new FormControl('', Validators.required),
      dueDate: new FormControl('', Validators.required),//
      billDate: new FormControl('', Validators.required),//
      termsOfPayments: new FormControl('', Validators.required),//
      termsOfDelivery: new FormControl('', Validators.required),//
      vendor: this.fb.group({
        id: this.fb.nonNullable.control('', {
          validators: Validators.required,
        })
      }),
      dispatchTo: new FormControl('', Validators.required),
      grossTotal: new FormControl('')
    });
  }

  availableSO()
  {
    this.submitted = true;
    this.invoiceS.getAllSo().then(
     (res) => {
       this.submitted = false;
       var count = res.totalElements ;
       //count=0
       if( count > 0 )
       {
         this.router.navigate(['/invoice/salesOrders']) ;
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

  getSoOrder() {
    if (this.id) {
      this.submitted = true;
      this.invoiceS.getCurrentSo(this.id).then(
        (salesOrder: SalesOrder) => {
          salesOrder.dueDate = salesOrder.dueDate ? new Date(salesOrder.dueDate) : undefined;
          salesOrder.billDate = salesOrder.billDate ? new Date(salesOrder.billDate) : undefined;
          console.log(salesOrder);

          this.currentSoOrder = salesOrder;
          this.soForm.patchValue(salesOrder);
          this.submitted = false;
          this.getLines(salesOrder); //Because backend api is not ready
        }
      ).catch(
        (err) => {
          console.log(err);
          this.submitted = false;
        }
      )
    }
  }

  getLines(salesOrder: SalesOrder) {
    this.submitted = true;
    this.invoiceS.getLineitemsBySo(salesOrder)
      .then((data: any) => {
        if (data) {
          this.lineitems = data;
          this.soSubTotal = this.lineitems.reduce(
            (total, lineItem) => total + lineItem.amount, 0
          );
          this.submitted = false;
        }
      }).catch(
        (err)=>{
          console.log(err);
          this.submitted = false;
        }
      );
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

  onSubmitSO()
  {
    this.soForm.value.dispatchTo = null ;
    this.soForm.value.company = null ;  // tempo
    //this.soForm.value.documentno = null ;

    var soFormVal = this.soForm.value;
    soFormVal.id = this.id;
    console.log(soFormVal);
    if (soFormVal.id) 
    {
      this.submitted = true;
      this.invoiceS.updateSalesOrder(soFormVal).then(
        (res) => {
          console.log(res);
          this.soForm.patchValue = { ...res };
          this.submitted = false;
          this.message.add({
            severity: 'success',
            summary: 'Sales Order Updated',
            detail: 'Sales Order updated',
            life: 3000,
          });
        }
      ).catch(
        (err) => {
          console.log(err);
          this.submitted = false;
          this.message.add({
            severity: 'error',
            summary: 'Sales Order updated Error',
            detail: 'Some Server Error',
            life: 3000,
          });
        }
      )
    }
    else {
      //  soFormVal.grossTotal = this.soSubTotal ;
     // this.upload(); // for upload file if attached
     this.submitted = true;
      this.invoiceS.createSalesOrder(soFormVal).then(
        (res) => {
          console.log(res);
          this.soForm.patchValue = { ...res };
          this.currentSoOrder = res;
          console.log("SO Order");
          console.log(this.currentSoOrder);
          this.viewLineItemTable = true;
          this.submitted = false;
          this.message.add({
            severity: 'success',
            summary: 'Sales Order Saved',
            detail: 'Sales Order Added',
            life: 3000,
          });
          this.router.navigate(['invoice/salesOrder/edit/' + res.id]);
        }
      ).catch(
        (err) => {
          console.log(err);
          this.viewLineItemTable = false;
          this.submitted = false;
          this.message.add({
            severity: 'error',
            summary: 'Sales Order error',
            detail: 'Some Server Error',
            life: 3000,
          });
        })
    }
  }


  selectVendor() { 
  }

  setLineValues(lineItem: SalesOrderLine) {
    var dc = this.products.find((t) => t.id === lineItem.expenseName?.id);
  }

  setLineQtyValuesQuantity(e: any, lineItem: SalesOrderLine) {
    if (e.value == null || e.value == 0) {
      this.isquantity = false;
    }
    if (e.value) {
      lineItem.quantity = e.value;
      this.setLineValues(lineItem);
      this.isquantity = true;
    }
  }

  setLineQtyValuesPrice(e: any, lineItem: SalesOrderLine) {

  }

  setLineQtyValuesDiscount(e: any, lineItem: SalesOrderLine) {

  }


  onRowEditInit(lineItem: SalesOrderLine) {

  }
  delete(lineItem: SalesOrderLine) {
    //(JSON.stringify(lineItem));
    this.confirmationService.confirm({
      message: 'Are you sure you want to deleteeeeeeeeeeeee ' + lineItem.expenseName?.name + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {

      },
    });

  }
  onRowEditSave(lineItem: SalesOrderLine) {
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
      lineItem.salesOrder = this.currentSoOrder; // this line will be change

      this.newRecord = false;
      this.islineAvaliable = true;
      console.log(lineItem);

      var _lineItem = lineItem;
    
      if (_lineItem.id) {
        alert("Update  Sales Line Item Entered");
        this.submitted = true;
        this.invoiceS.updateSoLineItem(lineItem).then(
          (res) => {
            console.log("Sales Order Line Item Updated Successfully");
            _lineItem = res;
            this.getSoOrder();
            this.submitted = false;
            this.message.add({
              severity: 'success',
              summary: 'Sales Order Line item Updated',
              detail: 'Line item Updated Successfully',
              life: 3000,
            });
          }
        ).catch(
          (err) => {
            console.log("Line Item Updated Error");
            this.submitted = false;
            this.message.add({
              severity: 'error',
              summary: 'Sales Order Line item Update Error',
              detail: 'Error While updating Line Item',
              life: 3000,
            });
          }
        )
      }
      else {
        this.submitted = true;
        this.invoiceS.createSoLineItem(lineItem).then(
          (res) => {
            console.log(res);
            _lineItem = res;
            this.getSoOrder();
            this.submitted = false;
            this.message.add({
              severity: 'success',
              summary: 'Sales Order Line item Added',
              detail: 'Line item Added Successfully',
              life: 3000,
            });
          }
        ).catch((err) => {
          console.log(err);
          this.submitted = false;
          this.message.add({
            severity: 'error',
            summary: 'Sales Order Line Item Error',
            detail: 'Error while Adding Line Item',
            life: 3000,
          });
        })
      }
    }

  }

  onRowEditCancel(lineItem: SalesOrderLine, index: any) {
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

        this.usedService.fileUploadForSalesOrder(this.id, this.currentFile).subscribe({
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

  finalSoSubmitPage() {
    // updated complete PO so that gross total can be updated
    alert("Final Sales Order Submission Done");
    var sFormVal = this.soForm.value;
    sFormVal.id = this.id;
    sFormVal.grossTotal = this.soSubTotal ;
    if (sFormVal.id) {
      //this.poForm.value.id = poFormVal.id;
      this.submitted = true;
      this.invoiceS.updateSalesOrder(sFormVal).then(
        (res) => {
          console.log(res);
          this.soForm.patchValue = { ...res };
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
        summary: 'Sales Order Created Successfully',
        detail: 'Sales Order created',
        life: 3000,
      });
      this.upload();
      this.router.navigate(['/invoice/salesOrder']);
  }

  createSO()
  {
    this.router.navigate(['/invoice/salesOrder/create']);
  }

  OnCancelSO()
  {
    //this.createNew = false;
    this.router.navigate(['/invoice/salesOrder']);
  }



}
