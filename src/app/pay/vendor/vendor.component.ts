import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { PayPageService } from '../pay-page.service';
import { AuthService } from 'src/app/auth/auth.service';
import { BreadCrumbService } from 'src/app/shared/navbar/bread-crumb.service';

@Component({
  selector: 'app-vendor',
  templateUrl: './vendor.component.html',
  styleUrls: ['./vendor.component.scss']
})
export class VendorComponent implements OnInit {

  id: string | null = '';
  createNew: boolean = false;
  currentVendor: any = {};

  isSidebarVisible: boolean = true;
  submitted: boolean = false;

  vendorForm!: FormGroup;
  addressDetailsForm !: FormGroup;
  accountDetailsForm !: FormGroup;

  accountDetailsVisible: boolean = false;
  addressDetailsVisible: boolean = false;
  shippingAddressVisible: boolean = false;

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
    private route: ActivatedRoute,
    private message: MessageService,
    private payPageS: PayPageService,
    private fb: FormBuilder,
    private authS: AuthService, private breadCrumbService: BreadCrumbService) { }

  ngOnInit(): void {

    this.initForm();
    this.loadUser();
  }

  loadOtherInfo() {
    this.id = this.route.snapshot.paramMap.get('id');

    if (this.id === null) {
      this.breadCrumbService.breadCrumb([{ label: 'Vendor', routerLink: ['/pay/vendors'] }, { label: 'Create' }]);
    }
    else {
      this.breadCrumbService.breadCrumb([{ label: 'Vendor', routerLink: ['/pay/vendors'] }, { label: 'Edit' }]);
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
        this.availableVendor();
      }

      this.getVendorDetailsById();
    });

    // this.initForm();
  }

  initForm() {
    this.vendorFormFields();
    this.accountDetailsFormFields();
    this.addressDetailsFormFields();
  }

  vendorFormFields() {
    this.vendorForm = new FormGroup({
      id: new FormControl(''),
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      mobileNumber: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
      address: new FormControl(''),
      accountDetails: new FormControl(''),
      notes: new FormControl(''),
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      user: this.fb.group({
        id: this.fb.nonNullable.control('')
      })
    });
  }

  accountDetailsFormFields() {
    this.accountDetailsForm = new FormGroup({
      id: new FormControl(''),
      bankname: new FormControl('', Validators.required),
      // branchName: new FormControl('', Validators.required),
      accountNumber: new FormControl('', Validators.required),
      ifsc: new FormControl('', Validators.required),
      accountType: new FormControl('', Validators.required)
    });
  }

  addressDetailsFormFields() {
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
    console.log(this.vendorForm);
    console.log(this.accountDetailsForm);
    console.log(this.addressDetailsForm);

    this.saveAccount();
  }

  availableVendor() {
    this.submitted = true;
    this.payPageS.allVendor(this.currentUser).then((res) => {
      this.submitted = false;
      var count = res.length;

      if (count > 0) {
        this.router.navigate(['/pay/vendors']);
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
          detail: 'Error while fetching all Vendors',
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
        this.payPageS.updateVendorAccount(accountFormVal).then((data: any) => {
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
      // save account details API
      this.submitted = true;
      this.payPageS.createAccountDetails(this.accountDetailsForm.value).then((res) => {
        this.vendorForm.value.accountDetails = res;
        console.log("Account Saved");
        this.submitted = false;
        this.saveAddress();
      })
        .catch((err) => {
          console.log("Account error");
          this.submitted = false;
        })
    }
    else {
      this.vendorForm.value.accountDetails = null;
      this.message.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please, fill the mandatory account details',
        life: 3000,
      });
    }

  }

  saveAddress() {
    console.log("Step 2");
    if (this.addressDetailsForm.status == 'VALID') {
      // save Address Details API
      if (this.addressDetailsForm.value.shippingAddress == "" || this.addressDetailsForm.value.shippingName == "") {
        this.addressDetailsForm.value.isShippingAddressSameAsBillingAddress = true;
      }

      var addressFormVal = this.addressDetailsForm.value;
      addressFormVal.id = this.id;

      if (addressFormVal.id) {
        this.submitted = true;
        this.payPageS.updateVendorAddress(addressFormVal).then((data: any) => {
          this.addressDetailsForm.patchValue = { ...data };
          this.submitted = false;
          this.saveVendor();
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
        this.vendorForm.value.address = res;
        console.log("Complete Address Saved");
        this.submitted = false;
        this.saveVendor();
      })
        .catch((err) => {
          console.log("Complete Address error");
          this.submitted = false;
          this.message.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error while Saving the Address',
            life: 3000,
          });
        })

    }
    else {
      this.vendorForm.value.address = null;
      this.saveVendor();
    }
  }

  saveVendor() {
    var vendorFormVal = this.vendorForm.value;
    vendorFormVal.id = this.id;
    vendorFormVal.user = this.currentUser

    // this.vendorForm.value.user.id = this.currentUser.id;
    // this.submitted = true;

    if (vendorFormVal.id) {
      this.submitted = true;
      this.payPageS.updateVendor(vendorFormVal).then((res: any) => {
        this.vendorForm.patchValue = { ...res };
        this.submitted = false;
        this.message.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Vendor updated',
          life: 3000,
        });
        setTimeout(() => {
          this.router.navigate(['/pay/vendors']);
        }, 2000);
      })
        .catch((err) => {
          console.log(err);
          this.submitted = false;
          this.message.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error while updating the Vendor',
            life: 3000,
          });
        })
    }
    else {
      this.submitted = true;
      this.payPageS.createVendor(vendorFormVal).then((res) => {
        console.log(res);
        console.log("Vendor Saved");
        this.submitted = false;
        this.message.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Vendor Saved Successfully',
          life: 3000,
        });
        setTimeout(() => {
          this.router.navigate(['/pay/vendors']);
        }, 2000);

      })
        .catch((err) => {
          console.log("Vendor error");
          this.submitted = false;
          this.message.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Vendor Addition Error',
            life: 3000,
          });

        })
    }

  }


  ShippingAddressVisibility() {
    var element = <HTMLInputElement>document.getElementById("link-checkbox");
    var isChecked = element.checked;

    if (isChecked == false) {
      this.shippingAddressVisible = true;
      this.addressDetailsForm.value.shippingAddressSameAsBillingAddress = false;
      console.log("I unchecked");
    }
    else {
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

  onCloseVendor() {
    this.router.navigate(['/pay/vendors']);
  }

  createVendor() {
    this.router.navigate(['/pay/vendor/create']);
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
      });
  }

  getVendorDetailsById() {
    if (this.id) {
      this.submitted = true;
      this.payPageS.getVendorById(this.id).then((vendor: any) => {
        this.currentVendor = vendor;
        this.vendorForm.patchValue(vendor);
        this.getAddressByVendorId();
        this.getAccountByVendorId();
        this.submitted = false;
      })
        .catch((err) => {
          console.log(err);
          this.submitted = false;
        })
    }
  }

  getAddressByVendorId() {
    this.submitted = true;
    this.payPageS.getAddressByVendorId(this.id).then((address: any) => {

      this.addressDetailsForm.patchValue(address);
      this.submitted = false;
    })
      .catch((err) => {
        console.log(err);
        this.submitted = false;
      })
  }

  getAccountByVendorId() {
    this.submitted = true;
    this.payPageS.getAccountByVendorId(this.id).then((account: any) => {
      this.accountDetailsForm.patchValue(account);
      this.submitted = false;
    })
      .catch((err) => {
        console.log(err);
        this.submitted = false;
      })
  }

}

