import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingRoutingModule } from './setting-routing.module';
import { RoleComponent } from './role/role.component';
import { SharedModule } from '../shared/shared.module';
import { DutchModule } from '../dutch/dutch.module';
import { DelegationRoleComponent } from './delegation-role/delegation-role.component';
import { WorkflowComponent } from './workflow/workflow.component';
import { RolesComponent } from './roles/roles.component';
import { PrivilegeComponent } from './privilege/privilege.component';
import { RolesPrivilegeComponent } from './roles-privilege/roles-privilege.component';
import { DelegationRoleDashboardComponent } from './delegation-role-dashboard/delegation-role-dashboard.component';
import { RolesDashboardComponent } from './roles-dashboard/roles-dashboard.component';
import { WorkflowDashboardComponent } from './workflow-dashboard/workflow-dashboard.component';


@NgModule({
  declarations: [
    RoleComponent,
    DelegationRoleComponent,
    WorkflowComponent,
    RolesComponent,
    PrivilegeComponent,
    RolesPrivilegeComponent,
    DelegationRoleDashboardComponent,
    RolesDashboardComponent,
    WorkflowDashboardComponent
  ],
  imports: [
    CommonModule,
    SettingRoutingModule,
    SharedModule
  ]
})
export class SettingModule { }
