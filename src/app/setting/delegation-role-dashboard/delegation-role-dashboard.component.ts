import { Component, OnInit } from '@angular/core';
import { DelegationRoleComponent } from '../delegation-role/delegation-role.component';
import { Router } from '@angular/router';
import { SettingService } from '../setting.service';
import { ProductCategory } from 'src/app/profile/product-category';
import { DelegationRole } from '../privilege/privilege';

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

  constructor(private router: Router, private settingService: SettingService) { }

  ngOnInit(): void {
    this.getAlldelegationRoles();
  }

  getAlldelegationRoles(){
    this.submitted = true;
    this.settingService.getAlldelegationRole()
    .then((res: any) =>{
      this.alldelegationRoles = res.content;
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
