import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PayPageService } from '../pay-page.service';
import { ReturnRefund } from '../pay-model';
import { Vendor } from 'src/app/settings/customers/customer';

@Component({
  selector: 'app-vendor-dashboard',
  templateUrl: './vendor-dashboard.component.html',
  styleUrls: ['./vendor-dashboard.component.scss']
})
export class VendorDashboardComponent implements OnInit {

  submitted: boolean = false;
  allVL: any = [];
  activeVendor: Vendor = {};
  totalRecord: number = 0;

  currentDue: number = 0;

  constructor(private router: Router, private route: ActivatedRoute, private payServices: PayPageService) { }

  ngOnInit(): void {
    this.loadVendors();

  }

  // GET ALL THE VENDOR LISTS
  loadVendors() {
    // this.submitted = true;
    this.payServices.allVendor().then((res: any) => {
      console.log(res);
      this.allVL = res.content;
      this.totalRecord = res.totalElements;
      // this.submitted = false;
    })
  }

  changeVender(vl: Vendor) {
    this.currentDue = 0;
    this.activeVendor = vl;
  }

  // FUNCTION FOR CREATE VENDOR BUTTON
  createVendor() {
    this.router.navigate(['/pay/vendor/create']);
  }

}
