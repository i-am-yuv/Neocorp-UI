import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-blue-layout',
  templateUrl: './blue-layout.component.html',
  styleUrls: ['./blue-layout.component.scss'],
})
export class BlueLayoutComponent implements OnInit {
  items!: MenuItem[];
  userMenuItems!: MenuItem[];

  userrole: string = 'user';
  username: string = '';
  optionalMenu!: MenuItem[];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.userrole = this.authService.getRoles();
    this.username = this.authService.getUserName();

    var superAdminMenu = {
      label: 'Admin',
      icon: 'pi pi-fw pi-user-edit',
      items: [
        // {
        //   label: 'Vendors', icon: 'pi pi-fw pi-sun',
        //   routerLink: ['/admin/vendors']
        // },
        {
          label: 'Distributor Users',
          icon: 'pi pi-fw pi-users',
          routerLink: ['/admin/distributor-users'],
        },
        {
          label: 'Store Users',
          icon: 'pi pi-fw pi-users',
          routerLink: ['/admin/store-users'],
        },
        {
          label: 'Customers',
          icon: 'pi pi-fw pi-users',
          routerLink: ['/admin/customers'],
        },
        {
          label: 'Roles',
          icon: 'pi pi-fw pi-users',
          routerLink: ['/admin/roles'],
        },
        {
          label: 'Users',
          icon: 'pi pi-fw pi-users',
          routerLink: ['/admin/users'],
        },
        {
          label: 'Privileges',
          icon: 'pi pi-fw pi-users',
          routerLink: ['/admin/privileges'],
        },
        {
          label: 'Billing',
          icon: 'pi pi-fw pi-file',
          routerLink: ['/admin/billing'],
        },
        {
          label: 'Settings',
          icon: 'pi pi-fw pi-file',
          routerLink: ['/admin/settings'],
        },
      ],
    };

    var masterMenu = {
      label: 'Masters',
      icon: 'pi pi-fw pi-user-edit',
      items: [
        {
          label: 'Companies',
          icon: 'pi pi-fw pi-file',
          routerLink: ['/masters/companies'],
        },
        {
          label: 'Stores',
          icon: 'pi pi-fw pi-shopping-bag',
          routerLink: ['/masters/stores'],
        },
        {
          label: 'Distributors',
          icon: 'pi pi-fw pi-sun',
          routerLink: ['/masters/distributors'],
        },
        {
          label: 'Warehouses',
          icon: 'pi pi-fw pi-inbox',
          routerLink: ['/masters/warehouses'],
        },
        {
          label: 'Tax Rates',
          icon: 'pi pi-fw pi-flag',
          routerLink: ['/masters/tax-rates'],
        },
        {
          label: 'Countries',
          icon: 'pi pi-fw pi-file',
          routerLink: ['/masters/countries'],
        },
        {
          label: 'States',
          icon: 'pi pi-fw pi-file',
          routerLink: ['/masters/states'],
        },
        {
          label: 'Product Categories',
          icon: 'pi pi-fw pi-file',
          routerLink: ['/masters/product-categories'],
        },
        {
          label: 'Products',
          icon: 'pi pi-fw pi-file',
          routerLink: ['/masters/products'],
        },
        {
          label: 'Brands',
          icon: 'pi pi-fw pi-file',
          routerLink: ['/masters/brands'],
        },
      ],
    };

    var distributorMenu = {
      label: 'Distributor',
      icon: 'pi pi-fw pi-user-edit',
      items: [
        {
          label: 'Distributors',
          icon: 'pi pi-fw pi-building',
          routerLink: ['/distributor/my-distributors'],
        },
        {
          label: 'Users',
          icon: 'pi pi-fw pi-users',
          routerLink: ['/distributor/users'],
        },
        {
          label: 'Warehouses',
          icon: 'pi pi-fw pi-users',
          routerLink: ['/distributor/warehouses'],
        },
        {
          label: 'Catalog',
          icon: 'pi pi-fw pi-users',
          routerLink: ['/distributor/distributorcatalog'],
        },
        {
          label: 'Inventory',
          icon: 'pi pi-fw pi-users',
          routerLink: ['/distributor/inventory'],
        },
        {
          label: 'Stock',
          icon: 'pi pi-fw pi-users',
          routerLink: ['/distributor/stock'],
        },
        {
          label: 'Store Stock',
          icon: 'pi pi-fw pi-users',
          routerLink: ['/distributor/store-stock'],
        },
        {
          label: 'Sales Requests',
          icon: 'pi pi-fw pi-users',
          routerLink: ['/distributor/sales-requests'],
        },
        {
          label: 'Sales Orders',
          icon: 'pi pi-fw pi-users',
          routerLink: ['/distributor/sales-orders'],
        },
      ],
    };

    var storeMenu = {
      label: 'Store',
      icon: 'pi pi-fw pi-user-edit',
      items: [
        {
          label: 'Stores',
          icon: 'pi pi-fw pi-building',
          routerLink: ['/store/my-stores'],
        },
        {
          label: 'Store Users',
          icon: 'pi pi-fw pi-users',
          routerLink: ['/store/users'],
        },
        {
          label: 'Store Customers',
          icon: 'pi pi-fw pi-users',
          routerLink: ['/store/customers'],
        },
        {
          label: 'Discounts',
          icon: 'pi pi-fw pi-users',
          routerLink: ['/store/discounts'],
        },
        {
          label: 'POS Machines',
          icon: 'pi pi-fw pi-print',
          routerLink: ['/store/posmachines'],
        },
        {
          label: 'Catalog',
          icon: 'pi pi-fw pi-users',
          routerLink: ['/store/storecatalog'],
        },
        {
          label: 'Inventory',
          icon: 'pi pi-fw pi-users',
          routerLink: ['/store/inventory'],
        },
        {
          label: 'Stock',
          icon: 'pi pi-fw pi-users',
          routerLink: ['/store/stock'],
        },
        {
          label: 'Sales Orders',
          icon: 'pi pi-fw pi-users',
          routerLink: ['/store/orders'],
        },
        {
          label: 'Returns & Refunds',
          icon: 'pi pi-fw pi-users',
          routerLink: ['/store/return-refund'],
        },
        {
          label: 'Purchase Orders',
          icon: 'pi pi-fw pi-users',
          routerLink: ['/store/purchase-orders'],
        },
        {
          label: 'Goods Receipt',
          icon: 'pi pi-fw pi-users',
          routerLink: ['/store/goods-receipt'],
        },
        {
          label: 'Stock Transactions',
          icon: 'pi pi-fw pi-users',
          routerLink: ['/store/stock-transactions'],
        },
      ],
    };

    var cashierMenu = {
      label: 'Store',
      icon: 'pi pi-fw pi-user-edit',
      items: [
        {
          label: 'Catalog',
          icon: 'pi pi-fw pi-users',
          routerLink: ['/store/storecatalog/view'],
        },
        {
          label: 'Stock',
          icon: 'pi pi-fw pi-users',
          routerLink: ['/store/stock'],
        },
        {
          label: 'Receipts',
          icon: 'pi pi-fw pi-users',
          routerLink: ['/store/orders'],
        },
      ],
    };
    var corpMenu = {
      label: 'Corporate',
      icon: 'pi pi-qrcode',
      items: [
        {
          label: 'Accounts',
          icon: 'pi pi-fw pi-users',
          routerLink: ['/accounting'],
        },
        {
          label: 'Payments',
          icon: 'pi pi-fw pi-copy',

          items: [
            {
              label: 'Fund Transfer',
              routerLink: ['/payments/fund-transfer'],
            },
            {
              label: 'Insta Pay',
              routerLink: ['/payments/insta-pay'],
            },
            {
              label: 'Bill Payments',
              routerLink: ['/payments/bill-payments'],
            },
            {
              label: 'Recurring Payments',
              routerLink: ['/payments/scheduled-payments'],
            },
            {
              label: 'Bulk Payments',
              routerLink: ['/payments/bulk-payments'],
            },
          ],
        },
        {
          label: 'Invoicing',
          icon: 'pi pi-fw pi-file',
          items: [
            {
              label: 'All Invoices',
              routerLink: ['/invoicing'],
            },
            {
              label: 'Purchase Invoices',
              routerLink: ['/invoicing'],
            },
            {
              label: 'Proforma Invoices',
              routerLink: ['/invoicing'],
            },
            {
              label: 'Sales Invoices',
              routerLink: ['/invoicing'],
            },
            {
              label: 'Recurring Invoices',
              routerLink: ['/invoicing'],
            },
          ],
        },
        {
          label: 'Payroll',
          icon: 'pi pi-fw pi-wallet',
          routerLink: ['/dashboard'],
        },
        {
          label: 'Expenses',
          icon: 'pi pi-fw pi-wallet',
          routerLink: ['/dashboard'],
        },
        { label: 'Taxes', icon: 'pi pi-fw pi-ticket' },
      ],
    };

    var userMenu = {};

    if (this.userrole === 'SuperAdmin') {
      this.optionalMenu = [masterMenu, superAdminMenu];
    } else if (this.userrole === 'Distributor') {
      this.optionalMenu = [distributorMenu];
    } else if (
      this.userrole.includes('Store') ||
      this.userrole === 'Store Manager'
    ) {
      this.optionalMenu = [storeMenu];
    } else if (
      this.userrole === 'Cashier' ||
      this.userrole === 'Store Cashier'
    ) {
      this.optionalMenu = [cashierMenu];
    } else if (this.userrole == 'Corporate') {
      this.optionalMenu = [corpMenu];
    }
    this.items = [
      {
        label: 'Quick Links',
        items: [
          {
            label: 'Home',
            icon: 'pi pi-fw pi-home',
            routerLink: ['/dashboard'],
          },
          // {
          //   label: 'Marketplace',
          //   icon: 'pi pi-fw pi-sun',
          //   routerLink: ['/dashboard'],
          // },
        ],
      },
    ];
    this.optionalMenu.forEach((itm: any) => {
      this.items.push(itm);
    });
    this.userMenuItems = [
      {
        label: 'Profile',
        icon: 'pi pi-user',
        items: [
          {
            label:
              '<div class="small-heading">Username</div> ' +
              this.username.toUpperCase(),
            escape: false,
            icon: 'pi pi-user',
          },
          {
            label: '<div class="small-heading">Roles</div> ' + this.userrole,
            escape: false,
            icon: 'pi pi-users',
          },
          {
            label: 'My Account',
            icon: 'pi pi-user-edit',
            routerLink: ['/settings'],
          },
        ],
      },

      {
        label: 'Settings',
        routerLink: ['/settings'],
        icon: 'pi pi-fw pi-cog',
      },
      {
        label: 'Notifications',
        routerLink: ['/settings/notifications'],
        icon: 'pi pi-fw pi-bell',
      },
      {
        label: 'Quit',
        icon: 'pi pi-fw pi-power-off',
        routerLink: ['/'],
        command: () => sessionStorage.clear(),
      },
    ];
  }
}
