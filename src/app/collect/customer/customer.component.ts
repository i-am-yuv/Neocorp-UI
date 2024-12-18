import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { AuthService } from 'src/app/auth/auth.service';
import { PayPageService } from 'src/app/pay/pay-page.service';
import { BreadCrumbService } from 'src/app/shared/navbar/bread-crumb.service';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit {

  id: string | null = '';
  createNew: boolean = false;
  isSidebarVisible: boolean = true;

  submitted: boolean = false;
  customerForm!: FormGroup;
  addressDetailsForm !: FormGroup;
  accountDetailsForm !: FormGroup;
  currentCustomer: any = {};

  accountDetailsVisible: boolean = false;
  addressDetailsVisible: boolean = false;
  shippingAddressVisible: boolean = false;

  items!: MenuItem[];

  accountType: any = [
    {
      "id": "1",
      "name": "Current"
    },
    {
      "id": "2",
      "name": "Saving"
    }
  ];

  constructor(private router: Router,
    private message: MessageService,
    private payPageS: PayPageService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private authS: AuthService, private breadCrumbService: BreadCrumbService) { }

  ngOnInit(): void {
    this.initForm();
    this.loadUser();
  }

  loadOtherInfo() {
    this.id = this.route.snapshot.paramMap.get('id');

    if (this.id === null) {
      this.breadCrumbService.breadCrumb([{ label: 'Customer', routerLink: ['/collect/customers'] }, { label: 'Create' }]);
    } else {
      this.breadCrumbService.breadCrumb([{ label: 'Customer', routerLink: ['/collect/customers'] }, { label: 'Edit' }]);
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
        this.availableCustomer();
      }

      this.getCustomerDetailsById();
    });

    // this.initForm();
  }

  initForm() {
    this.customerForm = new FormGroup({
      id: new FormControl(''),
      displayName: new FormControl('', Validators.required),
      contactName: new FormControl('', Validators.required),
      mobileNumber: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
      address: new FormControl(''),
      accountDetails: new FormControl(''),
      upiId: new FormControl(''),
      notes: new FormControl(''),
      user: this.fb.group({
        id: this.fb.nonNullable.control('')
      })
    });

    this.accountDetailsForm = new FormGroup({
      id: new FormControl(''),
      bankname: new FormControl('', Validators.required),
      // branchName: new FormControl('', Validators.required),
      accountNumber: new FormControl('', Validators.required),
      ifsc: new FormControl('', Validators.required),
      accountType: new FormControl('', Validators.required)
    });

    this.addressDetailsForm = new FormGroup({
      id: new FormControl(''),
      billingName: new FormControl('', [Validators.required]),
      billingAddress: new FormControl('', [Validators.required]),
      pincode: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required),
      shippingName: new FormControl(''),
      shippingAddress: new FormControl(''),
      isShippingAddressSameAsBillingAddress: new FormControl(true)
    });
  }

  onSubmit() {
    console.log(this.customerForm);
    console.log(this.accountDetailsForm);
    console.log(this.addressDetailsForm);

    this.saveAccount();
  }

  availableCustomer() {
    this.submitted = true;
    this.payPageS.allCustomer(this.currentUser).then((res) => {
      this.submitted = false;
      var count = res.length;
      //count=0
      if (count > 0) {
        this.router.navigate(['/collect/customers']);
      }
      else {
        this.createNew = false;
      }
    })
      .catch((err) => {
        console.log("Vendor error");
        this.submitted = false;
        this.message.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error while fetching all Customers',
          life: 3000,
        });
      })
  }

  saveAccount() {
    console.log("Step 1");
    if (this.accountDetailsForm.status == 'VALID') {

      var accountFormVal = this.accountDetailsForm.value;
      accountFormVal.id = this.id;

      if (accountFormVal.id) {
        this.submitted = true;
        this.payPageS.updateCustomerAccount(accountFormVal).then((data: any) => {
          this.accountDetailsForm.patchValue = { ...data };
          this.submitted = false
          this.saveAddress();
          this.message.add({
            severity: 'success',
            summary: 'Address Updated',
            detail: 'Address Upadted',
            life: 3000,
          })
        })
      }

      this.submitted = true;
      this.payPageS.createAccountDetails(this.accountDetailsForm.value).then((res) => {
        this.customerForm.value.accountDetails = res;
        this.submitted = false;
        this.saveAddress();
      })
        .catch((err) => {
          console.log(err);
          this.submitted = false;
          this.message.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error while saving the account',
            life: 3000,
          });
        })
    }
    else {
      this.customerForm.value.accountDetails = null;
      this.saveAddress();
    }

  }

  saveAddress() {
    console.log("Step 2");
    if (this.addressDetailsForm.status == 'VALID') {

      if (this.addressDetailsForm.value.shippingAddress == "" || this.addressDetailsForm.value.shippingName == "") {
        this.addressDetailsForm.value.isShippingAddressSameAsBillingAddress = true;
      }

      var addressFormVal = this.addressDetailsForm.value;
      addressFormVal.id = this.id;

      if (addressFormVal.id) {
        this.submitted = true;
        this.payPageS.updateCustomerAddress(addressFormVal).then((data: any) => {
          this.addressDetailsForm.patchValue = { ...data };
          this.submitted = false;
          this.saveCustomer();
          this.message.add({
            severity: 'success',
            summary: 'Address Updated',
            detail: 'Address Upadted',
            life: 3000,
          })
        })
      }

      this.submitted = true;
      this.payPageS.createAddress(this.addressDetailsForm.value).then((res) => {
        this.customerForm.value.address = res;
        this.submitted = false;
        this.saveCustomer();
      })
        .catch((err) => {
          console.log(err);
          this.submitted = false;
          this.message.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error while filling the address Details',
            life: 3000,
          });
        })
    }
    else {
      this.customerForm.value.address = null;
      this.message.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please, Fill The Mandatory Customer Address Details',
        life: 3000,
      });
    }
  }

  getCustomerDetailsById() {
    if (this.id) {
      this.submitted = true;
      this.payPageS.getCustomerById(this.id).then((customer: any) => {
        this.currentCustomer = customer;
        this.customerForm.patchValue(customer);
        this.getAddressByCustomerId();
        this.getAccountByCustomerId();
        this.submitted = false;
      })
        .catch((err) => {
          console.log(err);
          this.submitted = false;
        })
    }
  }

  getAddressByCustomerId() {
    if (this.id) {
      this.submitted = true;
      this.payPageS.getCustomerAddressById(this.id).then((customer: any) => {

        this.addressDetailsForm.patchValue(customer);
        this.submitted = false;
      })
        .catch((err) => {
          console.log(err);
          this.submitted = false;
        })
    }
  }

  getAccountByCustomerId() {
    if (this.id) {
      this.submitted = true;
      this.payPageS.getCustomerAccountById(this.id).then((customer: any) => {

        this.accountDetailsForm.patchValue(customer);
        this.submitted = false;
      })
        .catch((err) => {
          console.log(err);
          this.submitted = false;
        })
    }
  }

  saveCustomer() {
    var customerFormVal = this.customerForm.value ;
    customerFormVal.id = this.id;
    customerFormVal.user = this.currentUser ;
    // this.customerForm.value.user.id = this.currentUser.id;
    // this.submitted = true;

    if (customerFormVal.id) {
      this.submitted = true;
      this.payPageS.updateCustomer(customerFormVal).then((res: any) => {
        this.customerForm.patchValue = { ...res };
        this.submitted = false;
        this.message.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Customer updated',
          life: 3000,
        });
        setTimeout(() => {
          this.router.navigate(['/collect/customers']);
        }, 2000);
      })
        .catch(
          (err) => {
            console.log(err);
            this.submitted = false;
            this.message.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error while updating the Vendor',
              life: 3000,
            });
          });
    }
    else {
      this.payPageS.createCustomer(customerFormVal).then((res) => {
        console.log(res);
        this.submitted = false;
        this.message.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Customer Saved Successfully',
          life: 3000,
        });
        setTimeout(() => {
          this.router.navigate(['/collect/customers']);
        }, 2000);
      })
        .catch((err) => {
          console.log("customer error");
          this.submitted = false;
          this.message.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Customer Addition Error',
            life: 3000,
          });
        });
    }

  }


  ShippingAddressVisibility() {
    var element = <HTMLInputElement>document.getElementById("link-checkbox");
    var isChecked = element.checked;
    if (isChecked == false) {
      this.shippingAddressVisible = true;
      this.addressDetailsForm.value.shippingAddressSameAsBillingAddress = false;
      console.log("I unchecked");
    } else {
      this.shippingAddressVisible = false;
      this.addressDetailsForm.value.shippingAddressSameAsBillingAddress = true;
      console.log("I checked");
    }
  }

  openAccountForm() {
    this.accountDetailsVisible = true;
  }

  openAddressForm() {
    this.addressDetailsVisible = true;
  }

  onCloseCustomer() {
    this.router.navigate(['/collect/customers']);
  }

  createCustomer() {
    //this.createNew = true;
    this.router.navigate(['/collect/customer/create']);
  }

  currentCompany: any = {};
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

  // get isFormDisabled(): boolean {
  //   const customerFormValid = !this.customerForm.valid && !this.addressDetailsForm.valid;

  //   return customerFormValid;
  // }

}
