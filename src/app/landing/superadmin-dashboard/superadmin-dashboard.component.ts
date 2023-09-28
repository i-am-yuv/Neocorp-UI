import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';


@Component({
  selector: 'app-superadmin-dashboard',
  templateUrl: './superadmin-dashboard.component.html',
  styleUrls: ['./superadmin-dashboard.component.scss']
})
export class SuperadminDashboardComponent implements OnInit {

  accounts: any = {};

  items: MenuItem[] = [];

  activeItem!: MenuItem;

  activeAccount: any;

  showbalance: boolean = false;

  constructor() { }

  ngOnInit(): void {
    this.accounts = [
      {
        accountNo: '4532 4599 9787 6966',
        accountName: 'SPLENTA SYSTEMS PVT LTD',
        accountType: 'TRADE ROAMING CURRENT ACCOUNT',
        banklogo: 'Federal_bank_India.svg',
        validTill: '12/24'
      },
      {
        accountNo: '4532 4599 9987 7788',
        accountName: 'Y P PARTHASARATHY',
        accountType: 'SOLE PROPRIETORSHIP',
        banklogo: 'ICICI_Bank_Logo.svg',
        validTill: '12/24'
      },
    ];
    this.items = [
      { label: 'Beneficiary', icon: 'pi pi-fw pi-cog' },
      { label: 'Fund Transfer', icon: 'pi pi-fw pi-copy' },
      { label: 'Quick Pay', icon: 'pi pi-fw pi-copy' },
      { label: 'Addon Users', icon: 'pi pi-fw pi-user' },
      { label: 'Invoices', icon: 'pi pi-fw pi-file' }
    ];
    this.activeItem = this.items[0];
    this.activeAccount = this.accounts[0];
  }

  pageChange(value: any) {
    this.activeAccount = this.accounts[value.page];
  }


}
