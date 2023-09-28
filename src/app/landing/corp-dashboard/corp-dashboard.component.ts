import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { AccountDetails, Address, CustomeR, Vendor } from 'src/app/settings/customers/customer';
import { CustomerService } from 'src/app/settings/customers/customer.service';

@Component({
  selector: 'app-corp-dashboard',
  templateUrl: './corp-dashboard.component.html',
  styleUrls: ['./corp-dashboard.component.scss']
})
export class CorpDashboardComponent implements OnInit {

  accounts: any = {};
  items: MenuItem[] = [];

  vendors: Vendor[] = [];
  selectedVendor : Vendor = {} ;
  activeItem!: MenuItem;
  activeAccount: any;
  showbalance: boolean = false;

  selectedOrderDate !: Date;
  selectedDueDate !: Date;

  poForm!: FormGroup;

  

  constructor(
    private router: Router,
    private message: MessageService,
    private customerService: CustomerService,  private fb: FormBuilder) { }

  ngOnInit(): void {
    // this.accounts = [
    //   {
    //     accountNo: '4532 4599 9787 6966',
    //     accountName: 'SPLENTA SYSTEMS PVT LTD',
    //     accountType: 'TRADE ROAMING CURRENT ACCOUNT',
    //     banklogo: 'Federal_bank_India.svg',
    //     validTill: '12/24'
    //   },
    //   {
    //     accountNo: '4532 4599 9987 7788',
    //     accountName: 'Y P PARTHASARATHY',
    //     accountType: 'SOLE PROPRIETORSHIP',
    //     banklogo: 'ICICI_Bank_Logo.svg',
    //     validTill: '12/24'
    //   },
    // ];
    // this.items = [
    //   { label: 'Beneficiary', icon: 'pi pi-fw pi-cog' },
    //   { label: 'Fund Transfer', icon: 'pi pi-fw pi-copy' },
    //   { label: 'Quick Pay', icon: 'pi pi-fw pi-copy' },
    //   { label: 'Addon Users', icon: 'pi pi-fw pi-user' },
    //   { label: 'Invoices', icon: 'pi pi-fw pi-file' }
    // ];
    // this.activeItem = this.items[0];
    // this.activeAccount = this.accounts[0];

  
    this.poForm = this.fb.group({
      id: [''],
      vendor: this.fb.group({
        id: this.fb.nonNullable.control('', {
          validators: Validators.required,
        }),
      }),
      selectedOrderDate:[''],
      selectedDueDate:[''],
      status: [''],
      description: ['']
    });
  //this.loadVendor();
  }
  
  onSubmit() {
    console.log( this.poForm.value) ;
  }

//  loadVendor()
//  {
//     this.customerService.allVendor().then(
//       (res)=>{
//         this.vendors = res.content;
//         console.log(this.vendors);
//       }
//     ).catch(
//       (err)=>{
//         console.log("Error in all vendor");
//       }
//     )
//  }

//  setSelectedVendor()
// {
//   var vendorSelected = this.vendors.find(
//     (t) => t.id === this.poForm.value.vendor.id
//   );
//   this.selectedVendor = vendorSelected ? vendorSelected : {};
//   console.log(this.selectedVendor);
// }

  

}

// {
//   "displayName": "string",
//   "contactName": "string",
//   "mobileNumber": "string",
//   "email": "string",
//   "upiId": "string",
//   "accountDetails": {
//     "bankname": "string",
//     "branchName": "string",
//     "accountNumber": "string",
//     "ifsc": "string",
//     "accountType": "string"
//   },
//   "address": {
//     "billingName": "string",
//     "billingAddress": "string",
//     "pincode": 0,
//     "city": "string",
//     "shippingName": "string",
//     "shippingAddress": "string",
//     "shippingAddressSameAsBillingAddress": true
//   },
//   "notes": "string"
// }