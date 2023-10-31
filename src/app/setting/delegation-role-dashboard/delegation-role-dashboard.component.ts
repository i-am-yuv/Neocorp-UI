import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SettingService } from '../setting.service';
import { DelegationRole } from '../privilege/privilege';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-delegation-role-dashboard',
  templateUrl: './delegation-role-dashboard.component.html',
  styleUrls: ['./delegation-role-dashboard.component.scss']
})
export class DelegationRoleDashboardComponent implements OnInit {
  submitted: boolean = false;
  alldelegationRoles: any[] = [];
  activeProductCategory : DelegationRole = {};

  totalRecords : number = 0;

  items!: MenuItem[]

  constructor(private router: Router, private settingService: SettingService) { }

  ngOnInit(): void {
    this.items = [{label: 'Settings'}, {label: 'Delegation Role'}, {label: 'Dashboard'}];

    this.getAlldelegationRoles();
  }

  getAlldelegationRoles(){
    this.submitted = true;
    this.settingService.getAlldelegationRole()
    .then((res: any) =>{
      this.alldelegationRoles = res.content;
      if (this.alldelegationRoles.length > 0) {
        this.changeProductCategory(this.alldelegationRoles[0]);
      } else {
        this.activeProductCategory = {};
      }
      this.totalRecords = res.totalElements;
      this.submitted = false;
    })
    .catch((err) => {
      console.log(err);
      this.submitted = false;
    })
  }

  changeProductCategory(delegationRole: DelegationRole){
    this.activeProductCategory = delegationRole;
  }

  onSubmitDelegationRole() {
    this.router.navigate(['/setting/delegationRole/create']);
  }

  onEditDelegationRole(id: string){
    this.router.navigate(['setting/delegationRole/edit/' + id]);
  }


}
