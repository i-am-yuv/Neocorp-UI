import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SettingService } from '../setting.service';
import { DelegationRole } from '../privilege/privilege';
import { MenuItem } from 'primeng/api';
import { AuthService } from 'src/app/auth/auth.service';
import { BreadCrumbService } from 'src/app/shared/navbar/bread-crumb.service';

@Component({
  selector: 'app-delegation-role-dashboard',
  templateUrl: './delegation-role-dashboard.component.html',
  styleUrls: ['./delegation-role-dashboard.component.scss']
})
export class DelegationRoleDashboardComponent implements OnInit {
  submitted: boolean = false;
  alldelegationRoles: any[] = [];
  activeDele: DelegationRole = {};

  totalRecords: number = 0;

  items!: MenuItem[]

  constructor(private router: Router, private settingService: SettingService,
    private authS: AuthService, private breadcrumbS: BreadCrumbService) { }

  ngOnInit(): void {
    this.breadcrumbS.breadCrumb([{ label: 'Delegation Role' }, { label: 'Dashboard' }]);
    this.loadUser();
  }

  loadOtherInfo() {

    this.getAlldelegationRoles();
  }

  getAlldelegationRoles() {
    this.submitted = true;
    this.settingService.getAlldelegationRole(this.currentUser)
      .then((res: any) => {
        this.alldelegationRoles = res;
        if (this.alldelegationRoles.length > 0) {
          this.changeDeleRole(this.alldelegationRoles[0]);
        } else {
          this.activeDele = {};
        }
        this.totalRecords = res.length;
        this.submitted = false;
      })
      .catch((err) => {
        console.log(err);
        this.submitted = false;
      })
  }

  changeDeleRole(delegationRole: DelegationRole) {
    this.activeDele = delegationRole;
  }

  onSubmitDelegationRole() {
    this.router.navigate(['/setting/delegationRole/create']);
  }

  onEditDelegationRole(id: string) {
    this.router.navigate(['setting/delegationRole/edit/' + id]);
  }

  currentCompany: any = {};
  currentUser: any = {};
  loadUser() {
    this.submitted = true;
    this.authS.getUser().then((res: any) => {
      this.currentCompany = res.comapny;
      this.currentUser = res;
      this.submitted = false;

      this.loadOtherInfo();
    })
      .catch((err) => {
        console.log(err);
        this.submitted = false;
      });
  }

  searchDeleRole : any ;

  searchDeleRoles( a : any )
  {

  }


}
