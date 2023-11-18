import { Component, OnInit, ViewChild } from '@angular/core';
import { Privilege } from '../privilege/privilege';
import { PrivilegeService } from '../privilege/privilege.service';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { SettingsComponent } from 'src/app/settings/settings/settings.component';
import { SettingService } from '../setting.service';

@Component({
  selector: 'app-roles-privilege',
  templateUrl: './roles-privilege.component.html',
  styleUrls: ['./roles-privilege.component.scss']
})
export class RolesPrivilegeComponent implements OnInit {

  role: any;
  submitted: boolean = false;
  roleid: any;
  privileges: Privilege[] = [];

  @ViewChild('dt') dt: Table | undefined;
  allprivileges: any[] = [];
  newprivilege: any;

  constructor(
    private route: ActivatedRoute,
    private privilegeService: PrivilegeService,
    private messageService: MessageService,
    private SettingS : SettingService
  ) { }

  ngOnInit(): void {
    this.roleid = this.route.snapshot.paramMap.get('roleid');
    this.SettingS.getRoleById(this.roleid).then((role: any) => this.role = role);
    this.getPrivileges();

  }

  getPrivileges() {
    this.privilegeService.getByRole(this.roleid).then((privileges: any) => {
      this.privileges = privileges;
      this.privilegeService.getPrivileges(0,10,'','DESC','').then((allprivileges: any) => {
        this.allprivileges = allprivileges.filter((el: any) => {
          return !this.privileges.find(t => t.id === el.id);
        });
      })
    })
  }

  applyFilterGlobal($event: any, stringVal: any) {
    this.dt?.filterGlobal(($event.target as HTMLInputElement).value, 'contains');
  }

  deletePrivilege(privilege: any) {
    this.privilegeService.unlinkRole(this.role.id, privilege.id).then(() => {
      this.getPrivileges();
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Privilege removed' })
    })
  }

  addPrivilege() {
    this.privilegeService.addToRole(this.role.id, this.newprivilege.id).then(() => {
      this.getPrivileges();
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Privilege added' })
    })
  }


  
  
}
