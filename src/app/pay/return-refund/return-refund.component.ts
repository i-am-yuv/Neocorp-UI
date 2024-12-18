import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { Product } from 'src/app/profile/profile-models';
import { PayPageService } from '../pay-page.service';
import { ReturnRefund, ReturnRefundLine } from '../pay-model';
import { HttpEventType } from '@angular/common/http';
import { CompanyNew } from 'src/app/invoice/invoice-model';
import { AuthService } from 'src/app/auth/auth.service';
import { BreadCrumbService } from 'src/app/shared/navbar/bread-crumb.service';

@Component({
  selector: 'app-return-refund',
  templateUrl: './return-refund.component.html',
  styleUrls: ['./return-refund.component.scss']
})
export class ReturnRefundComponent implements OnInit {

  // refundCheck : any ;
  // returnCheck : any ;

  submitted: boolean = false;
  createNew: boolean = false;

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
  returnRefundQty: number = 0;

  items!: MenuItem[];
  deleteDialLogvisible: boolean = false;
  sidebarVisibleProduct: boolean = false;
  currentCompany: CompanyNew = {};

  constructor(private router: Router, private route: ActivatedRoute, private message: MessageService,
    private fb: FormBuilder, private payS: PayPageService, private authS: AuthService, private breadcrumbS: BreadCrumbService) { }

  ngOnInit(): void {

    this.initForm();
    this.loadUser();
  }

  loadOtherInfo() {
    this.id = this.route.snapshot.paramMap.get('id');

    if (this.id === null) {
      this.breadcrumbS.breadCrumb([{ label: 'Return & Refunds', routerLink: ['/pay/returnAndRefunds'] }, { label: 'Create' }]);
    }
    else {
      this.breadcrumbS.breadCrumb([{ label: 'Return & Refunds', routerLink: ['/pay/returnAndRefunds'] }, { label: 'Edit' }]);
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
        this.availableRR();
      }
    });

    this.sidebarVisibleProduct = false;

    this.loadProducts();
    this.loadSalesOrder();
    this.getReturnRefund();
  }

  isRefund: boolean = true;
  isReturn: boolean = true;

  initForm() {
    this.rrForm = new FormGroup({
      id: new FormControl(''),
      orderNo: new FormControl(''),
      // returnRefund: new FormGroup({
      refund: new FormControl(true),
      return: new FormControl(false),
      // }),
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

  get gender() {
    return this.rrForm.
      get(
        'isRefund');
  }

  // onRadioButtonChange(selectedFirstRadio: boolean) {
  //   if (selectedFirstRadio) {
  //     this.isReturn = !this.isRefund
  //   }
  //   else {
  //     this.isRefund = !this.isReturn
  //   }
  // }

  availableRR() {
    this.submitted = true;
    this.payS.getAllRR(this.currentUser).then((res) => {
      this.submitted = false;
      var count = res.length;
      //count=0
      if (count > 0) {
        this.router.navigate(['/pay/returnAndRefunds']);
      }
      else {
        this.createNew = false;
      }

    })
      .catch((err) => {
        this.submitted = false;
        console.log(err);
      })
  }

  loadProducts() {
    this.submitted = true;
    this.payS.allProduct(this.currentUser).then(
      (res) => {
        // this.products = res;
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
            detail: 'Error while fetching all the products',
            life: 3000,
          });
        }
      )
  }

  loadSalesOrder() {
    this.submitted = true;
    this.payS.allSO(this.currentUser).then((res: any) => {
      this.allSalesOrders = res;
      this.submitted = false;
    })
      .catch((err) => {
        console.log(err);
        this.submitted = false;
      })
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

  getReturnRefund() {
    if (this.id) {
      this.submitted = true;
      this.payS.getCurrentReturnRefund(this.id).then((returnRefund: ReturnRefund) => {
        returnRefund.processDate = returnRefund.processDate ? new Date(returnRefund.processDate) : undefined;

        console.log(returnRefund);
        this.currReturnRefund = returnRefund;
        this.rrForm.patchValue(returnRefund);
        this.submitted = false;
        this.getLines(returnRefund); //Because backend api is not ready
      })
        .catch((err) => {
          console.log(err);
        })
    }
  }

  getLines(returnRefund: ReturnRefund) {
    this.submitted = true;
    this.payS.getLineitemsByRR(returnRefund).then((data: any) => {
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
    this.rrForm.value.branch = this.currentUser.branch;

    if (this.rrForm.value.refund == true) {
      this.rrForm.value.return = false;
    }
    else {
      this.rrForm.value.return = true;
    }

    var rrFormVal = this.rrForm.value;
    rrFormVal.id = this.id;
    rrFormVal.comapny = this.currentCompany;
    rrFormVal.user = this.currentUser;
    console.log(rrFormVal);


    // if (rrFormVal.id) {
    //   //this.poForm.value.id = poFormVal.id;
    //   this.submitted = true;
    //   this.payS.updateReturnRefund(rrFormVal).then((res) => {
    //     console.log(res);
    //     this.rrForm.patchValue = { ...res };
    //     this.submitted = false;
    //     this.message.add({
    //       severity: 'success',
    //       summary: 'Return & Refund Saved',
    //       detail: 'Return & Refund Saved Successfully',
    //       life: 3000,
    //     });
    //   })
    //     .catch((err) => {
    //       console.log(err);
    //       this.submitted = false;
    //       this.message.add({
    //         severity: 'error',
    //         summary: 'Return & Refund Updated Error',
    //         detail: 'Return & Refund Error',
    //         life: 3000,
    //       });
    //     })
    // }
    // else {
    //   // this.upload(); // for upload file if attached
    //   this.submitted = true;
    //   rrFormVal.user = this.currentUser;

    //   if (this.rrForm.value.return === true) {
    //     this.rrForm.value.refund = false
    //   }
    //   else {
    //     this.rrForm.value.return = true;
    //   }

    // if (rrFormVal.isRefund == true) {
    //   rrFormVal.isReturn = false;
    // }
    // else {
    //   rrFormVal.isReturn = 
    // }

    // alert(JSON.stringify(rrFormVal));
    this.payS.createReturnRefund(rrFormVal).then((res) => {
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
        summary: 'Success',
        detail: 'Return and Refund Added Successfully',
        life: 3000,
      });
      this.router.navigate(['pay/returnAndRefund/edit/' + res.id]);
    })
      .catch((err) => {
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
    // }
  }

  selectVendor() { }

  setLineValues(lineItem: ReturnRefundLine) {
    var dc = this.products.find((t) => t.id === lineItem.expenseName?.id);

    // here i need to get all the info regarding this product from product id

    this.submitted = true;
    this.payS.getCurrentproduct(lineItem.expenseName).then((res) => {
      console.log(res);
      lineItem.unitPrice = res.mrp;
      this.submitted = false;
    })
      .catch((err) => {
        console.log(err);
        this.submitted = false;
        this.message.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Please select the product',
          life: 3000,
        });
      })
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

  setLineQtyValuesPrice(e: any, lineItem: ReturnRefundLine) { }

  setLineQtyValuesDiscount(e: any, lineItem: ReturnRefundLine) { }


  onRowEditInit(lineItem: ReturnRefundLine) { }

  currentDeleteLineItem: any;
  delete(lineItem: ReturnRefundLine) {
    this.currentDeleteLineItem = lineItem;
    this.deleteDialLogvisible = true;
  }

  // deleteConfirm(lineItem: ReturnRefundLine) {
  //   this.submitted = true;
  //   this.payS.deleteReturnRefundLineItem(lineItem.id).then((data) => {
  //     this.lineitems = this.lineitems.filter((val) =>
  //       val.id !== lineItem.id
  //     );

  //     this.returnRefundSubTotal = this.lineitems.reduce((total, lineItem) => {
  //       total + lineItem.amount, 0
  //     });

  //     this.deleteDialLogvisible = false;
  //     this.submitted = false;
  //     this.message.add({
  //       severity: 'success',
  //       summary: 'Successful',
  //       detail: 'Line Item Deleted',
  //       life: 3000,
  //     });
  //   })
  //     .catch((err) => {
  //       console.log(err);
  //       this.submitted = false;
  //       this.deleteDialLogvisible = false;
  //       this.message.add({
  //         severity: 'error',
  //         summary: 'Error',
  //         detail: 'Line item Deletion Error, Please refresh and try again',
  //         life: 3000,
  //       });
  //     });
  // }

  deleteConfirm(lineItem: ReturnRefundLine) {
    this.submitted = true;
    this.payS.deleteReturnRefundLineItem(lineItem.id).then((data) => {
      this.lineitems = this.lineitems.filter((val) => val.id !== lineItem.id);

      this.returnRefundSubTotal = this.lineitems.reduce((total, item) => total + item.amount, 0);

      this.deleteDialLogvisible = false;
      this.submitted = false;
      this.message.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Line Item Deleted',
        life: 3000,
      });
    })
      .catch((err) => {
        console.error(err); // Log the error for debugging
        this.submitted = false;
        this.message.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Line item Deletion Error. Please refresh and try again.',
          life: 3000,
        });
      });
  }

  onRowEditSave(lineItem: ReturnRefundLine) {

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
      this.getLines(this.currReturnRefund);
      this.newRecord = false;
    }
    else {
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
        lineItem.returnRefund = this.currReturnRefund; // this line will be change

        this.newRecord = false;
        this.islineAvaliable = true;
        console.log(lineItem);

        var _lineItem = lineItem;

        if (_lineItem.id) {
          // alert("Update Line Item Entered");
          // line line item should have id inside
          this.submitted = true;
          this.payS.updateReturnRefundLineItem(lineItem).then((res) => {
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
          })
            .catch((err) => {
              console.log("Line Item Updated Error");
              this.submitted = false;
              this.message.add({
                severity: 'error',
                summary: 'Line item Update Error',
                detail: 'Error While updating Return Refund Line Item',
                life: 3000,
              });
            })
        }
        else {
          this.submitted = true;
          this.payS.createReturnRefundLineItem(lineItem).then((res) => {
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
          })
            .catch((err) => {
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

  onRowEditCancel(lineItem: ReturnRefundLine, index: any) {
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
      if (file) {
        this.currentFile = file;

        this.payS.fileUploadForCashMemo(this.id, this.currentFile).subscribe({
          next: (event: any) => {
            if (event.type === HttpEventType.UploadProgress) {
              this.progress = Math.round((100 * event.loaded) / event.total);
            } else if (event.ok == true) {
              this.message.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Return Refund File Added Successfully ',
                life: 3000,
              });
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
    var rrFormVal = this.rrForm.value;
    rrFormVal.id = this.id;
    rrFormVal.grossTotal = this.returnRefundSubTotal;   // updated complete PO so that gross total can be updated
    rrFormVal.comapny = this.currentCompany;
    rrFormVal.user = this.currentUser;

    // Conditions for Radio button value change
    if (this.rrForm.value.refund == true) {
      this.rrForm.value.return = false;
    }
    else {
      this.rrForm.value.return = true;
    }

    if (rrFormVal.id) {
      this.submitted = true;
      this.payS.updateReturnRefund(rrFormVal).then((res) => {
        console.log(res);
        this.rrForm.patchValue = { ...res };
        this.submitted = false;
        this.message.add({
          severity: 'success',
          summary: 'Return & Refund Saved',
          detail: 'Return & Refund  Saved',
          life: 3000,
        })
        setTimeout(() => {
          this.router.navigate(['/pay/returnAndRefunds']);
        }, 2000);
      })
        .catch((err) => {
          console.log(err);
          this.submitted = false;
          this.message.add({
            severity: 'error',
            summary: 'Error while saving Return and Refund',
            detail: 'Error while saving Return and Refund',
            life: 3000,
          });
        })
    }
    else {
      setTimeout(() => {
        this.router.navigate(['/pay/returnAndRefunds']);
      }, 2000);
    }

    // this.submitted = true
    // this.payS.createReturnRefund(rrFormVal).then((res) => {
    //   console.log(res);
    //   this.submitted = false;
    //   this.message.add({
    //     severity: 'success',
    //     summary: 'Return & Refund Saved',
    //     detail: 'Return & Refund  Saved',
    //     life: 3000,
    //   });
    // setTimeout(() => {
    //   this.router.navigate(['/pay/returnAndRefunds']);
    // }, 2000);
    // })

    // .catch((err) => {
    //   console.log(err);
    //   // this.viewLineItemTable = false;
    //   this.submitted = false;
    //   this.message.add({
    //     severity: 'error',
    //     summary: 'Error while adding Return and Refund',
    //     detail: 'Error while adding Return and Refund',
    //     life: 3000,
    //   });
    // })
  }

  createRR() {
    this.router.navigate(['/pay/returnAndRefund/create']);
  }

  OnCancelRR() {
    this.router.navigate(['/pay/returnAndRefunds']);
  }

  cancelDeleteConfirm() {
    this.currentDeleteLineItem = null;
    this.deleteDialLogvisible = false;
  }

  loadAllProductsNow() {
    this.loadProducts();
  }

}
