import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingRoutingModule } from './setting-routing.module';
import { RoleComponent } from './role/role.component';
import { SharedModule } from '../shared/shared.module';
import { DutchModule } from '../dutch/dutch.module';
import { DelegationRoleComponent } from './delegation-role/delegation-role.component';


@NgModule({
  declarations: [
    RoleComponent,
    DelegationRoleComponent
  ],
  imports: [
    CommonModule,
    SettingRoutingModule,
    SharedModule,
    DutchModule
  ]
})
export class SettingModule { }
