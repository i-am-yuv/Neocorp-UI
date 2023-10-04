import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  choosePayPageId: any;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private message: MessageService) { }

  paymentOptions: any = [
    {
      'heading': 'Essentials',
      'items': [
        // {
        //   "id": "0",
        //   "name": "Dashboard",
        //   "url": "/dashboard",
        //   "icon": "home"
        // },
        {
          "id": "1",
          "name": "Vendor",
          "url":"/pay/vendor",
          "icon": "home"
        },
        {
          "id": "2",
          "name": "Customer",
          "url":"/collect/createCustomer",
          "icon": "home"
        },
        {
          "id": "3",
          "name": "Product",
          "url": "/profile/product",
          "icon":"home"
        },
      ]
    },
    {
      'heading': 'Utilities',
      items: [
        {
          "id": "4",
          "name": "Purchase Order",
          "url": "/bills/purchaseOrder",
          "icon":"home"
        },
        {
          "id": "5",
          "name": "Purchase Invoice",
          "url": "/collect/purchaseInvoice",
          "icon":"home"
        },
        {
          "id": "6",
          "name": "Sales Order",
          "url": "/invoice/salesOrder",
          "icon":"home"
        },
        {
          "id": "7",
          "name": "Receipt Note",
          "url": "/bills/receiptNote",
          "icon":"home"
        },
        {
          "id": "8",
          "name": "Debit Note",
          "url": "/bills/debitNote",
          "icon":"home"
        },
        {
          "id": "9",
          "name": "Credit Note",
          "url": "/invoice/creditNote",
          "icon":"home"
        },
        {
          "id": "10",
          "name": "product Category",
          "url": "/profile/productCateogry",
          "icon":"home"
        },
        {
          "id": "11",
          "name": "Cash Memo",
          "url": "/invoice/cashMemo",
          "icon":"home"
        },
        {
          "id": "12",
          "name": "beneficairy",
          "url": "/profile/beneficiary/create",
          "icon":"home"
        },
        {
          "id": "13",
          "name": "Return & Refund",
          "url": "/pay/returnAndRefund",
          "icon":"home"
        },
        {
          "id": "14",
          "name": "Role",
          "url": "/setting/role/create",
          "icon":"home"
        },
        {
          "id": "15",
          "name": "Delegation Role",
          "url": "/setting/delegationRole/create",
          "icon":"home"
        },
        {
          "id": "16",
          "name": "Sales Invoice",
          "url": "/invoice/salesInvoice",
          "icon":"home"
        },
        {
          "id": "17",
          "name": "Vendor Invoice",
          "url": "/invoice/vendorInvoice",
          "icon":"home"
        }
      ]
    }
  ]

  ngOnInit(): void {
  }

  goToPay() {
    this.router.navigate(['/pay']);
  }

  goToDashBoard()
  {
    this.router.navigate(['/dashboard']);
  }

  viewPayPages() {
    if (this.choosePayPageId == 0) {
      this.router.navigate(['/dashboard']);
    }
    else if (this.choosePayPageId == 1) {
      this.router.navigate(['/pay/vendor']);
    }
    else if (this.choosePayPageId == 2) {
      this.router.navigate(['/collect/createCustomer']);
    }
    else if (this.choosePayPageId == 3) {
      this.router.navigate(['/profile/product']);
    }
    else if (this.choosePayPageId == 4) {
      this.router.navigate(['/bills/purchaseOrder']);
    }
    else if (this.choosePayPageId == 5) {
      this.router.navigate(['/collect/purchaseInvoice']);
    }
    else if (this.choosePayPageId == 6) {
      this.router.navigate(['/invoice/salesOrder']);
    }
    else if (this.choosePayPageId == 7) {
      this.router.navigate(['/bills/receiptNote']);
    }
    else if (this.choosePayPageId == 8) {
      this.router.navigate(['/bills/debitNote']);
    }
    else if (this.choosePayPageId == 9) {
      this.router.navigate(['/invoice/creditNote']);
    }
    else if (this.choosePayPageId == 10) {
      this.router.navigate(['/profile/productCateogry']);
    }
    else if (this.choosePayPageId == 11) {
      this.router.navigate(['/invoice/cashMemo']);
    }
    else if (this.choosePayPageId == 12) {
      this.router.navigate(['/profile/beneficiary/create']);
    }
    else if (this.choosePayPageId == 13) {
      this.router.navigate(['/pay/returnAndRefund']);
    }
    else if (this.choosePayPageId == 14) {
      this.router.navigate(['/setting/role/create']);
    }
    else if (this.choosePayPageId == 15) {
      this.router.navigate(['/setting/delegationRole/create']);
    }
    else if (this.choosePayPageId == 16) {
      this.router.navigate(['/invoice/salesInvoice']);
    }
    else if (this.choosePayPageId == 17) {
      this.router.navigate(['/invoice/vendorInvoice']);
    }

  }

}
