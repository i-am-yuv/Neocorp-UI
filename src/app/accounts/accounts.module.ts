import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountsRoutingModule } from './accounts-routing.module';
import { AccountListComponent } from './account-list/account-list.component';
import { StatementComponent } from './statement/statement.component';
import { LimitsComponent } from './limits/limits.component';
import { DutchModule } from '../dutch/dutch.module';
import { AccountViewComponent } from './account-view/account-view.component';
import { AccountFormComponent } from './account-form/account-form.component';


@NgModule({
  declarations: [
    AccountListComponent,
    StatementComponent,
    LimitsComponent,
    AccountViewComponent,
    AccountFormComponent
  ],
  imports: [
    CommonModule,
    AccountsRoutingModule,
    DutchModule
  ]
})
export class AccountsModule { }
