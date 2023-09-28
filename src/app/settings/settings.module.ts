import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { UsersComponent } from './users/users.component';
import { ProfileComponent } from './profile/profile.component';
import { CredentialsComponent } from './credentials/credentials.component';
import { DutchModule } from '../dutch/dutch.module';
import { RolesComponent } from './roles/roles.component';
import { VendorsComponent } from './vendors/vendors.component';
import { DistributorUsersComponent } from './distributor-users/distributor-users.component';
import { CustomersComponent } from './customers/customers.component';
import { StoreUsersComponent } from './store-users/store-users.component';
import { ConfigurationComponent } from './configuration/configuration.component';
import { StoreConfigComponent } from './configuration/store-config/store-config.component';
import { BillingComponent } from './billing/billing.component';
import { DistributorBillingComponent } from './distributor-billing/distributor-billing.component';
import { DistributorConfigComponent } from './configuration/distributor-config/distributor-config.component';
import { PrivilegesComponent } from './privileges/privileges.component';
import { RolePrivilegesComponent } from './role-privileges/role-privileges.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { SettingsComponent } from './settings/settings.component';


@NgModule({
  declarations: [
    UsersComponent,
    ProfileComponent,
    CredentialsComponent,
    RolesComponent,
    VendorsComponent,
    DistributorUsersComponent,
    CustomersComponent,
    StoreUsersComponent,
    ConfigurationComponent,
    StoreConfigComponent,
    BillingComponent,
    DistributorBillingComponent,
    DistributorConfigComponent,
    PrivilegesComponent,
    RolePrivilegesComponent,
    NotificationsComponent,
    SettingsComponent
  ],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    DutchModule
  ]
})
export class SettingsModule { }
