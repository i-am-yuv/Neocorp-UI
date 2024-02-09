import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { Menu } from 'primeng/menu';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  constructor(private route: ActivatedRoute,
    private router: Router,
    private message: MessageService) { }

  ngOnInit(): void {
    // this.id = this.route.snapshot.paramMap.get('id');

    // New Code

    // For Dashboard
    var home = {
      label: 'Dashboard',
      icon: 'pi pi-home',
      routerLink: ['/dashboard'],
    }

    this.dashboardItems = [
      home
    ];

    this.finalOne = [];

    this.dashboardItems.forEach((itm: any) => {
      this.finalOne.push(itm);
    });

    // For essentials

    var essentialsMenu1 = {
      label: 'Pay',
      icon: '',
      items: [
        {
          label: 'Vendor',
          icon: '',
          routerLink: ['/pay/vendor'],
        }
      ],
    };
    var essentialsMenu2 = {
      label: 'Collect',
      icon: '',
      items: [
        {
          label: 'Customer',
          icon: '',
          routerLink: ['/collect/customer'],
        }
      ],
    };
    var essentialsMenu3 = {
      label: 'Setting',
      icon: '',
      items: [
        {
          label: 'Product',
          icon: '',
          routerLink: ['/profile/product'],
        },
        {
          label: 'Product Category',
          icon: '',
          routerLink: ['/profile/productCategory'],
        },
        {
          label: 'Role',
          icon: '',
          routerLink: ['/setting/role'],
        },
        {
          label: 'Delegation Role',
          icon: '',
          routerLink: ['/setting/delegationRole'],
        },
        {
          label: 'Workflow',
          icon: '',
          routerLink: ['/setting/workflow'],
        }
      ],
    };

    this.essentialsItems = [
      essentialsMenu1,
      essentialsMenu2,
      essentialsMenu3
    ]

    this.finalTwo = [];

    this.essentialsItems.forEach((itm: any) => {
      this.finalTwo.push(itm);
    });

    // For utilities

    var utility1 = {
      label: 'Bills',
      icon: '',
      items: [
        {
          label: 'Purchase Order',
          icon: '',
          routerLink: ['/bills/purchaseOrder'],
        },
        {
          label: 'Purchase Invoice',
          icon: '',
          routerLink: ['/collect/purchaseInvoice'],
        },
        {
          label: 'Debit Note',
          icon: '',
          routerLink: ['/bills/debitNote'],
        },
        {
          label: 'Return & Refund',
          icon: '',
          routerLink: ['/pay/returnAndRefund'],
        },
        {
          label: 'Receipt Note',
          icon: '',
          routerLink: ['/bills/receiptNote'],
        },
        {
          label: 'Goods Shipment',
          icon: '',
          routerLink: ['/bills/goodsShipment'],
        },
        {
          label: 'Goods Receipt',
          icon: '',
          routerLink: ['/bills/goodsReceipt'],
        }
      ],
    }

    var utility2 = {
      label: 'Invoices',
      icon: '',
      items: [
        {
          label: 'Sales Orders',
          icon: '',
          routerLink: ['/invoice/salesOrder'],
        },
        {
          label: 'Sales Invoices',
          icon: '',
          routerLink: ['/collect/purchaseInvoice'],
        },
        {
          label: 'Vendor Invoices',
          icon: '',
          routerLink: ['/invoice/vendorInvoice'],
        },
        {
          label: 'Credit Note',
          icon: '',
          routerLink: ['/invoice/creditNote'],
        },
        {
          label: 'Cash Memo',
          icon: '',
          routerLink: ['/invoice/cashMemo'],
        },
      ],
    }

    var utility3 = {
      label: 'Banking',
      icon: '',
      items: [
        {
          label: 'Beneficiary',
          icon: '',
          routerLink: ['/banking/beneficiary'],
        },
        {
          label: 'Payments',
          icon: '',
          routerLink: ['/banking/paymentse'],
        },
        {
          label: 'Track Account',
          icon: '',
          routerLink: ['/banking/track'],
        },
        {
          label: 'Accounts',
          icon: '',
          routerLink: ['/banking/accounts'],
        }
      ],
    }

    this.finalThree = [];

    this.utilitiesItems = [
      utility1, utility2, utility3
    ]

    this.utilitiesItems.forEach((itm: any) => {
      this.finalThree.push(itm);
    });


  }

  // New Code
  dashboardItems !: MenuItem[];
  finalOne !: MenuItem[];

  essentialsItems !: MenuItem[];
  finalTwo !: MenuItem[];

  utilitiesItems !: MenuItem[];
  finalThree !: MenuItem[];

  getDashboardIconSVG(): string {
    return `
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 18 18" fill="none">
    <path
        d="M9 1.82812C7.58154 1.82812 6.19493 2.24875 5.01552 3.0368C3.83611 3.82486 2.91688 4.94495 2.37405 6.25544C1.83123 7.56593 1.68921 9.00796 1.96593 10.3992C2.24266 11.7904 2.92572 13.0683 3.92872 14.0713C4.93173 15.0743 6.20963 15.7573 7.60084 16.0341C8.99205 16.3108 10.4341 16.1688 11.7446 15.6259C13.055 15.0831 14.1751 14.1639 14.9632 12.9845C15.7513 11.8051 16.1719 10.4185 16.1719 9C16.1696 7.09859 15.4133 5.27569 14.0688 3.93119C12.7243 2.58668 10.9014 1.83036 9 1.82812ZM14.2552 5.47875L9.42188 8.26945V2.68594C10.3874 2.7509 11.3252 3.03644 12.1631 3.52061C13.001 4.00477 13.7167 4.67466 14.2552 5.47875ZM8.57813 2.68594V8.75672L3.32157 11.7914C2.86314 10.8588 2.64146 9.82755 2.67612 8.7889C2.71078 7.75024 3.0007 6.73611 3.52028 5.83609C4.03986 4.93607 4.7731 4.17786 5.65523 3.62845C6.53736 3.07904 7.54122 2.75534 8.57813 2.68594ZM9 15.3281C7.96093 15.3277 6.93796 15.0714 6.02144 14.5818C5.10491 14.0923 4.32303 13.3846 3.74485 12.5212L14.6784 6.20859C15.1526 7.17332 15.3732 8.24293 15.3195 9.31654C15.2657 10.3902 14.9393 11.4324 14.3711 12.3449C13.8029 13.2574 13.0116 14.0101 12.0719 14.5321C11.1322 15.054 10.075 15.328 9 15.3281Z"
        fill="black" />
        </svg>
    `;
  }

}
