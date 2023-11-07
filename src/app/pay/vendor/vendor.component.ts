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
    this.breadCrumbService.breadCrumb([{ label: 'Vendor', routerLink: ['/pay/vendors'] }]);
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
        this.getAllVendor();
      }
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
      branchName: new FormControl('', Validators.required),
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

  getAllVendor() {
    this.submitted = true;
    this.payPageS.allVendor(this.currentUser).then(
      (res) => {
        this.submitted = false;
        var count = res.length;
        if (count > 0) {
          this.router.navigate(['/pay/vendors']);
        }
        else {
          this.createNew = false;
        }
      }
    ).catch((err) => {
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
      // save account details API
      this.submitted = true;
      this.payPageS.createAccountDetails(this.accountDetailsForm.value).then(
        (res) => {
          this.vendorForm.value.accountDetails = res;
          console.log("Account Saved");
          this.submitted = false;
          this.saveAddress();
        }
      ).catch((err) => {
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
      // this.saveAddress();
    }

  }

  saveAddress() {
    console.log("Step 2");
    if (this.addressDetailsForm.status == 'VALID') {
      // save Address Details API
      if (this.addressDetailsForm.value.shippingAddress == "" || this.addressDetailsForm.value.shippingName == "") {
        this.addressDetailsForm.value.isShippingAddressSameAsBillingAddress = true;
      }
      // else {
      //   this.addressDetailsForm.value.isShippingAddressSameAsBillingAddress = false;
      // }
      this.submitted = true;
      this.payPageS.createAddress(this.addressDetailsForm.value).then(
        (res) => {
          this.vendorForm.value.address = res;
          console.log("Complete Address Saved");
          this.submitted = false;
          this.saveVendor();
        }
      ).catch((err) => {
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

    this.vendorForm.value.user.id = this.currentUser.id;
    this.submitted = true;
    this.payPageS.createVendor(this.vendorForm.value).then(
      (res) => {
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

      }
    ).catch((err) => {
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

}
