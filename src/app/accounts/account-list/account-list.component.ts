import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-account-list',
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.scss']
})
export class AccountListComponent implements OnInit {
  accounts: any[] = [];

  constructor() { }

  ngOnInit(): void {
    this.accounts = [

      {
        accountNo: '4532 4599 9787 6966',
        accountName: 'SPLENTA SYSTEMS PVT LTD',
        accountType: 'SOLE PROPRIETORSHIP',
        bankname: 'Federal Bank',
        banklogo: 'Federal_bank_India.svg',
        validTill: '12/24'
      },
      {
        accountNo: '4532 4599 9987 7788',
        accountName: 'Y P PARTHASARATHY',
        accountType: 'SOLE PROPRIETORSHIP',
        bankname: 'ICICI Bank',
        banklogo: 'ICICI_Bank_Logo.svg',
        validTill: '12/24'
      },
    ];
  }

}
