import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from '../dutch/layout/layout.component';
import { BillingComponent } from './billing/billing.component';
import { ConfigurationComponent } from './configuration/configuration.component';
import { CustomersComponent } from './customers/customers.component';
import { DistributorUsersComponent } from './distributor-users/distributor-users.component';
import { StoreUsersComponent } from './store-users/store-users.component';
import { RolesComponent } from './roles/roles.component';
import { UsersComponent } from './users/users.component';
import { DistributorBillingComponent } from './distributor-billing/distributor-billing.component';
import { PrivilegesComponent } from './privileges/privileges.component';
import { RolePrivilegesComponent } from './role-privileges/role-privileges.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { SettingsComponent } from './settings/settings.component';
import { BlueLayoutComponent } from '../dutch/blue-layout/blue-layout.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: ConfigurationComponent
      },
      {
        path: 'users',
        component: UsersComponent
      },
      {
        path: 'roles',
        component: RolesComponent
      },
      {
        path: 'privileges',
        component: PrivilegesComponent
      },
      {
        path: 'role-privileges/:roleid',
        component: RolePrivilegesComponent
      },
      {
        path: 'distributor-users',
        component: DistributorUsersComponent
      },
      {
        path: 'store-users',
        component: StoreUsersComponent
      },
      {
        path: 'customers',
        component: CustomersComponent
      },
      {
        path: 'billing',
        component: BillingComponent
      },
      {
        path: 'notifications',
        component: NotificationsComponent
      },
      {
        path: 'distributor-billing',
        component: DistributorBillingComponent
      },
      {
        path: 'settings',
        component: SettingsComponent
      }
    ]

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
