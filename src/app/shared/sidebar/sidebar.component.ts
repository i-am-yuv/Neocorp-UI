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
      "id": "1",
      "name": "Create Vendor"
    },
    {
      "id": "2",
      "name": "Create Customer"
    },
    {
      "id": "3",
      "name": "Create Product"
    },
    {
      "id": "4",
      "name": "Create Purchase Order"
    },
    {
      "id": "5",
      "name": "Create Purchase Invoice"
    },
    {
      "id": "6",
      "name": "Create Sales Order"
    },
    {
      "id": "7",
      "name": "Create Receipt Note"
    },
    {
      "id": "8",
      "name": "Create Debit Note"
    },
    {
      "id": "9",
      "name": "Create Credit Note"
    },
    {
      "id": "10",
      "name": "Create product Category"
    },
    {
      "id": "11",
      "name": "Create Cash Memo"
    },
    {
      "id": "12",
      "name": "Create beneficairy"
    },
    {
      "id": "13",
      "name": "Create Return & Refund"
    },
    {
      "id": "14",
      "name": "Create Role"
    },
    {
      "id": "15",
      "name": "Create Delegation Role"
    },
    {
      "id": "16",
      "name": "Create Sales Invoice"
    },
    {
      "id": "17",
      "name": "Create Vendor Invoice"
    }
  ]

  ngOnInit(): void {
  }

  goToPay() {
    this.router.navigate(['/pay']);
  }

  viewPayPages() {
    if (this.choosePayPageId == 1) {
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
      this.router.navigate(['/collect/purchaseInvoice/create']);
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
