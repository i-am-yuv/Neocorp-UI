import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InvoiceComponent } from './invoice/invoice.component';
import { LayoutComponent } from '../shared/layout/layout.component';
import { DebitNoteComponent } from './debit-note/debit-note.component';
import { ReceiptNoteComponent } from './receipt-note/receipt-note.component';
import { CashmemoComponent } from './cashmemo/cashmemo.component';

const routes: Routes = [
  {
    path: 'invoices',
    component:LayoutComponent ,
    children: [
      { path: '', component: InvoiceComponent 
    }
    ],
  },
  {
    path: 'debitNotes',
    component:LayoutComponent ,
    children: [
      { path: '', component: DebitNoteComponent 
    }
    ],
  },
  {
    path: 'receiptNotes',
    component:LayoutComponent ,
    children: [
      { path: '', component: ReceiptNoteComponent 
    }
    ],
  },
  {
    path: 'cashMemos',
    component:LayoutComponent ,
    children: [
      { path: '', component: CashmemoComponent 
    }
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VendorPortalRoutingModule { }
