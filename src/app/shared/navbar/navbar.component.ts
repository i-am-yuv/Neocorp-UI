import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { BreadCrumbService } from './bread-crumb.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  creatBtn : boolean = false;
  roles : any[] = [];

  items: MenuItem[]  = [];

  home: MenuItem = {};
  constructor(private breadCrumbService: BreadCrumbService) { }

  ngOnInit(): void {
   // this.items = [{ label: 'Computer' }, { label: 'Notebook' }, { label: 'Accessories' }, { label: 'Backpacks' }, { label: 'Item' }];
// this.items = this.breadCrumbService.items;
this.breadCrumbService.breadCrumb$.subscribe((data) => {
  this.items = data; // And he have data here too!
}
);
        this.home = { icon: 'pi pi-home', routerLink: '/' };
  }

  selectVendor()
  {
    
  }
}
