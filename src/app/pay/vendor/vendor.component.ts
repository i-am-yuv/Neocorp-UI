import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { PayPageService } from '../pay-page.service';

@Component({
  selector: 'app-vendor',
  templateUrl: './vendor.component.html',
  styleUrls: ['./vendor.component.scss']
})
export class VendorComponent implements OnInit {

  isSidebarVisible : boolean =  true;

  vendorForm!: FormGroup;
  addressDetailsForm !: FormGroup;
  accountDetailsForm !: FormGroup;

  accountDetailsVisible: boolean = false;
  addressDetailsVisible: boolean = false;
  shippingAddressVisible: boolean = true;

  constructor(private router: Router,
    private message: MessageService,
    private payPageS:PayPageService) { }

  ngOnInit(): void {
    this.vendorForm = new FormGroup({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      mobileNumber: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
      address: new FormControl(''),
      accountDetails: new FormControl(''),
      upiId : new FormControl('', Validators.required),
      notes : new FormControl('', Validators.required),
      username : new FormControl('', Validators.required),
      password : new FormControl('', Validators.required)
    });

    this.accountDetailsForm = new FormGroup({
      bankname: new FormControl('', Validators.required),
      branchName: new FormControl('', Validators.required),
      accountNumber: new FormControl('', Validators.required),
      ifsc: new FormControl('', Validators.required),
      accountType: new FormControl('', Validators.required)
    });

    this.addressDetailsForm = new FormGroup({
      billingName: new FormControl('', [Validators.required]),
      billingAddress: new FormControl('', [Validators.required]),
      pincode: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required),
      shippingName: new FormControl('', Validators.required),
      shippingAddress: new FormControl('', Validators.required),
      isShippingAddressSameAsBillingAddress: new FormControl('')
    });

    // Default making billing Address same as Shipping Address
    this.addressDetailsForm.value.shippingAddressSameAsBillingAddress = false;
  }

  onSubmit() {
    console.log(this.vendorForm);
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
          // this.customerForm.get('accountDetails')?.patchValue({
          //   accountDetails:res
          // });
          //this.customerDetails.accountDetails = res;
          this.vendorForm.value.accountDetails = res;
          console.log("Account Saved");
          this.saveAddress();
        }
      ).catch((err) => {
        console.log("Account error");
      })
    }
    else{
      this.vendorForm.value.accountDetails = null ;
      this.saveAddress();
    }
    
  }

  saveAddress() {
    console.log("Step 2");
    if (this.addressDetailsForm.status == 'VALID') {
      // save Address Details API
      this.payPageS.createAddress(this.addressDetailsForm.value).then(
        (res) => {
          //this.addressDetailS = res;
          //this.customerDetails.address = res;
          this.vendorForm.value.address = res;
          //this.add.push(res);
          console.log("Complete Address Saved");
          this.saveVendor();
        }
      ).catch((err) => {
        console.log("Complete Address error");
      })
    }
    else if (this.addressDetailsForm.status == 'INVALID') {
      if ((this.addressDetailsForm.value.billingName != ""   &&
        this.addressDetailsForm.value.billingAddress != "" ) &&
        (this.addressDetailsForm.value.pincode != "" &&
          this.addressDetailsForm.value.city != "")) {
        this.payPageS.createAddress(this.addressDetailsForm.value).then(
          (res) => {
             //this.addressDetailS = res;

           // this.customerDetails.address=res;
           this.vendorForm.value.address = res;
            //   this.add.push(res);
            console.log("Billing Address Saved");
            this.saveVendor();
            this.ngOnInit();
          }
        ).catch((err) => {
          console.log("BIlling Address error");
        })
      }
      else{
        this.vendorForm.value.address = null;
        this.saveVendor();
      }
    }
    
  }

  saveVendor() {
    //console.log("Step 3\n\n"+JSON.stringify(this.customerForm?.value) );
    console.log(this.vendorForm.value);
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
    this.payPageS.createVendor(this.vendorForm.value).then(
      (res) => {
        console.log(res);
        console.log("Vendor Saved");
        this.message.add({
          severity: 'success',
          summary: 'Vendor Saved',
          detail: 'Vendor Added',
          life: 3000,
        });
        // this.customerForm.reset();
        // this.addressDetailsForm.reset();
        // this.accountDetailsForm.reset();
      }
    ).catch((err) => {
      console.log("Vendor error");
      this.message.add({
        severity: 'error',
        summary: 'Vendor Error',
        detail: 'Vendor Not Added',
        life: 3000,
      });
      // this.vendorForm.reset();
      // this.addressDetailsForm.reset();
      // this.accountDetailsForm.reset();
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


}
