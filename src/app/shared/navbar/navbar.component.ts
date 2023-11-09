import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { BreadCrumbService } from './bread-crumb.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  creatBtn: boolean = false;
  roles: any[] = [];

  items: MenuItem[] = [];

  home: MenuItem = {};

  // options: any[] = [];
  options: any[] = [
    { label: 'Vendor', value: 'vendor' },
    { label: 'Customer', value: 'customer' },
    { label: 'Product', value: 'product' },
  ];

  selectedOption: any;
  constructor(private breadCrumbService: BreadCrumbService, private router: Router) { }

  ngOnInit(): void {
    this.breadCrumbService.breadCrumb$.subscribe((data) => {
      this.items = data;
    }
    );
    this.home = { icon: 'pi pi-home', routerLink: '/' };
  }

  selectVendor() {

  }

  onDropdownChange(event: any) {
  //  alert(JSON.stringify(event));
    if (event.value.label == 'Vendor') {
      this.router.navigate(['/pay/vendor/create']);
    }

    if (event.value.label == 'Customer') {
      this.router.navigate(['/collect/customer/create']);
    }

    if (event.value.label == 'Product') {
      this.router.navigate(['/profile/product/create']);
    }
  }

  logOut()
  {
    sessionStorage.clear();
    this.router.navigate(['/']);
  }

}
