import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { PayPageService } from 'src/app/pay/pay-page.service';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit {

  isSidebarVisible: boolean = true;

  customerForm!: FormGroup;
  addressDetailsForm !: FormGroup;
  accountDetailsForm !: FormGroup;

  accountDetailsVisible: boolean = false;
  addressDetailsVisible: boolean = false;
  shippingAddressVisible: boolean = false;

  constructor(private router: Router,
    private message: MessageService,
    private payPageS: PayPageService) { }

  ngOnInit(): void {
    this.customerForm = new FormGroup({
      id: new FormControl(''),
      displayName: new FormControl('', Validators.required),
      contactName: new FormControl('', Validators.required),
      mobileNumber: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
      address: new FormControl(''),
      accountDetails: new FormControl(''),
      upiId: new FormControl(''),
      notes: new FormControl('')
    });

    this.accountDetailsForm = new FormGroup({
      id: new FormControl(''),
      bankname: new FormControl('', Validators.required),
      branchName: new FormControl('', Validators.required),
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

    // Default making billing Address same as Shipping Address
    this.addressDetailsForm.value.shippingAddressSameAsBillingAddress = true;
  }

  onSubmit() {
    console.log(this.customerForm);
    console.log(this.accountDetailsForm);
    console.log(this.addressDetailsForm);

    this.saveAccount();
  }

  saveAccount() {
    console.log("Step 1");
    if (this.accountDetailsForm.status == 'VALID') {
      // save account details API
      this.payPageS.createAccountDetails(this.accountDetailsForm.value).then(
        (res) => {
          this.customerForm.value.accountDetails = res;
          console.log("Account Saved");
          this.saveAddress();
        }
      ).catch((err) => {
        console.log("Account error");
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
      else {
        this.addressDetailsForm.value.isShippingAddressSameAsBillingAddress = false;
      }

      // save Address Details API
      this.payPageS.createAddress(this.addressDetailsForm.value).then(
        (res) => {
          //this.addressDetailS = res;
          //this.customerDetails.address = res;
          this.customerForm.value.address = res;
          //this.add.push(res);
          console.log("Complete Address Saved");
          this.saveCustomer();
        }
      ).catch((err) => {
        console.log("Complete Address error");
      })
    }
    else {
      this.customerForm.value.address = null;
      this.saveCustomer();
    }


  }

  saveCustomer() {
    //console.log("Step 3\n\n"+JSON.stringify(this.customerForm?.value) );
    console.log(this.customerForm.value);
    //console.log("\n\n"+this.accountDetailS+"\n\n");
    // alert(JSON.stringify(this.bank));

    // this.customerDetails.displayName = this.customerForm.value.displayName;
    // this.customerDetails.contactName = this.customerForm.value.contactName;
    // this.customerDetails.email = this.customerForm.value.email;
    // this.customerDetails.mobileNumber = this.customerForm.value.mobileNumber;
    // if (this.accountSaved == true) {
    //   this.customerDetails.accountDetails = this.bank[0];
    // }
    // if (this.addressSaved == true) {
    //   this.customerDetails.address = this.add[0];
    // }
    /// console.log(JSON.stringify(this.customerDetails));
    this.payPageS.createCustomer(this.customerForm.value).then(
      (res) => {
        console.log(res);
        console.log("Customer Saved");
        this.message.add({
          severity: 'success',
          summary: 'Customer Saved',
          detail: 'Customer Added',
          life: 3000,
        });
        // this.customerForm.reset();
        // this.addressDetailsForm.reset();
        // this.accountDetailsForm.reset();
      }
    ).catch((err) => {
      console.log("customer error");
      this.message.add({
        severity: 'error',
        summary: 'Customer Error',
        detail: 'Customer Not Added',
        life: 3000,
      });
      this.customerForm.reset();
      this.addressDetailsForm.reset();
      this.accountDetailsForm.reset();
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

  onCloseCustomer() {
    this.router.navigate(['/collect/Customers']);
  }

}
