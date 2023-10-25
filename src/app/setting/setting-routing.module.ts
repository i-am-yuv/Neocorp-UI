import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleComponent } from './role/role.component';
import { DispatcherComponent } from '../dutch/dispatcher/dispatcher.component';
import { DelegationRoleComponent } from './delegation-role/delegation-role.component';
import { LayoutComponent } from '../shared/layout/layout.component';
import { RolesComponent } from '../setting/roles/roles.component';
import { PrivilegesComponent } from '../settings/privileges/privileges.component';
import { RolePrivilegesComponent } from '../settings/role-privileges/role-privileges.component';
import { PrivilegeComponent } from './privilege/privilege.component';
import { RolesPrivilegeComponent } from './roles-privilege/roles-privilege.component';
import { WorkflowComponent } from './workflow/workflow.component';
import { DelegationRoleDashboardComponent } from './delegation-role-dashboard/delegation-role-dashboard.component';
import { RolesDashboardComponent } from './roles-dashboard/roles-dashboard.component';


const routes: Routes = [
  {
    path: 'role',
    component:LayoutComponent ,
    children: [
      { path: '', component: RolesComponent },
      { path: 'create', component: RolesComponent },
      { path: 'edit/:id', component: RolesComponent },
    ],
  },
  {
    path: 'roles',
    component:LayoutComponent ,
    children: [
      { path: '', component: RolesDashboardComponent }
    ],
  },
  {
    path: 'delegationRole',
    component:LayoutComponent ,
    children: [
      { path: '', component: DelegationRoleComponent },
      { path: 'create', component: DelegationRoleComponent },
      { path: 'edit/:id', component: DelegationRoleComponent },
    ],
  },
  {
    path: 'delegationRoless',
    component:LayoutComponent ,
    children: [
      { path: '', component: DelegationRoleDashboardComponent }
    ],
  },
  {
    path: 'privileges',
    component:LayoutComponent ,
    children: [
      { path: '', component: PrivilegeComponent },
      { path: 'edit/:id', component: PrivilegeComponent },
      
    ],
  },
  {
    path: 'roles-privilege/:roleid',
    component:LayoutComponent ,
    children: [
      { path: '', component: RolesPrivilegeComponent },
      // { path: 'edit/:id', component: PrivilegeComponent },
      
    ],
  },
  {
    path: 'workflow',
    component:LayoutComponent ,
    children: [
      { path: '', component: WorkflowComponent },
      // { path: 'edit/:id', component: PrivilegeComponent },
      
    ],
  },
  
  // {
  //       path: 'roles',
  //       component: RolesComponent
  //     },
  //     {
  //       path: 'privileges',
  //       component: PrivilegesComponent
  //     },
  //     {
  //       path: 'role-privileges/:roleid',
  //       component: RolePrivilegesComponent
  //     }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingRoutingModule { }
