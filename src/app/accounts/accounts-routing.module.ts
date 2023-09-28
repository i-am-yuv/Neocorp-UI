import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DispatcherComponent } from '../dutch/dispatcher/dispatcher.component';
import { LayoutComponent } from '../dutch/layout/layout.component';
import { AccountFormComponent } from './account-form/account-form.component';
import { AccountListComponent } from './account-list/account-list.component';
import { AccountViewComponent } from './account-view/account-view.component';

const routes: Routes = [{
  path: '',
  component: LayoutComponent,
  children: [
    {
      path: '',
      component: AccountListComponent
    },
    {
      path: 'view/:id',
      component: AccountViewComponent
    },
    {
      path: 'create',
      component: AccountFormComponent
    },
    {
      path: 'edit/:id',
      component: AccountFormComponent
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountsRoutingModule { }
