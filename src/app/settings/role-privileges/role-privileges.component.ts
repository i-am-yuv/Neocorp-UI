import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Privilege } from '../privileges/privilege';
import { PrivilegeService } from '../privileges/privilege.service';
import { RoleService } from '../roles/roleService';

@Component({
  selector: 'app-role-privileges',
  templateUrl: './role-privileges.component.html',
  styleUrls: ['./role-privileges.component.scss']
})
export class RolePrivilegesComponent implements OnInit {
  role: any;

  roleid: any;
  privileges: Privilege[] = [];

  @ViewChild('dt') dt: Table | undefined;
  allprivileges: any[] = [];
  newprivilege: any;

  constructor(
    private route: ActivatedRoute,
    private privilegeService: PrivilegeService,
    private roleService: RoleService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.roleid = this.route.snapshot.paramMap.get('roleid');
    this.roleService.getRole(this.roleid).then((role: any) => this.role = role);
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
