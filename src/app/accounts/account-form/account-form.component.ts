import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-account-form',
  templateUrl: './account-form.component.html',
  styleUrls: ['./account-form.component.scss']
})
export class AccountFormComponent implements OnInit {

  banks: any[] = [];
  items: MenuItem[] = [];
  home!: MenuItem;


  constructor() { }

  ngOnInit(): void {
    this.items = [
      { label: 'Accounts', routerLink: '/accounts' },
      { label: 'Create', disabled: true }
    ];

    this.home = { icon: 'pi pi-home', routerLink: '/dashboard' };

  }

}
