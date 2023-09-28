import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleComponent } from './role/role.component';
import { DispatcherComponent } from '../dutch/dispatcher/dispatcher.component';
import { DelegationRoleComponent } from './delegation-role/delegation-role.component';

const routes: Routes = [
  {
    path: 'role',
    component:DispatcherComponent ,
    children: [
      { path: 'create', component: RoleComponent },
      { path: 'edit/:id', component: RoleComponent },
    ],
  },
  {
    path: 'delegationRole',
    component:DispatcherComponent ,
    children: [
      { path: 'create', component: DelegationRoleComponent },
      { path: 'edit/:id', component: DelegationRoleComponent },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingRoutingModule { }
