import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, MenuItem } from 'primeng/api';
import { SettingService } from '../setting.service';
import { Privilege } from '../privilege/privilege';
import { Roles } from '../setting-models';
import { Role } from 'src/app/settings/roles/role';
import { AuthService } from 'src/app/auth/auth.service';
import { BreadCrumbService } from 'src/app/shared/navbar/bread-crumb.service';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent implements OnInit {

  id: string | null = '';
  createNew: boolean = false;
  submitted: boolean = false;

  roleForm !: FormGroup;

  roleType: any = [
    {
      "id": "1",
      "name": "Accountant"
    },
    {
      "id": "2",
      "name": "Admin"
    }
  ];

  currentRole: Roles = {};

  items!: MenuItem[];

  constructor(private router: Router,
    private route: ActivatedRoute,
    private message: MessageService,
    private settingS: SettingService,
    private formBuilder: FormBuilder,
    private authS: AuthService, private breadcrumbS: BreadCrumbService) { }

  ngOnInit(): void {

    this.loadUser();
  }

  loadOtherInfo() {
    this.id = this.route.snapshot.paramMap.get('id');

    if (this.id === null) {
      this.breadcrumbS.breadCrumb([{ label: 'Roles', routerLink: ['/setting/roles'] }, { label: 'Create' }]);
    } else {
      this.breadcrumbS.breadCrumb([{ label: 'Roles', routerLink: ['/setting/roles'] }, { label: 'Edit' }]);
    }

    this.route.url.subscribe(segments => {
      let lastSegment = segments[segments.length - 1];
      if (lastSegment && lastSegment.path == 'create') {
        this.createNew = true;
      }
      else if (lastSegment && lastSegment.path == this.id) {
        this.createNew = true;
      }
      else {
        this.availableRole();
      }
    });

    this.initForm();
    this.getRoles();
  }

  initForm() {
    this.roleForm = new FormGroup({
      name: new FormControl('', Validators.required),
      roleType: new FormControl('', Validators.required),
      description: new FormControl(''),
      privilege: new FormControl('')
    });
  }

  availableRole() {
    this.submitted = true;
    this.settingS.getAllRoles(this.currentUser).then((res: any) => {
      this.submitted = false;
      var count = res.legnth;
      //count=0
      if (count > 0) {
        this.router.navigate(['/setting/roles']);
      }
      else {
        this.createNew = false;
      }
    }).catch(
      (err) => {
        console.log(err);
        this.submitted = false;
        this.message.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error While Fetching All The Roles',
          life: 3000,
        });
      }
    )
  }

  selectPrivilege() { }

  getRoles() {
    if (this.id) {
      this.submitted = true;
      this.settingS.getAllRolesById(this.id).then((role: Roles) => {
        this.currentRole = role;
        this.roleForm.patchValue(role);
        this.submitted = false;
      }).catch((err) => {
        console.log(err);
        this.submitted = false;
        this.message.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error While Fetching this Roles',
          life: 3000,
        });
      })
    }

  }

  onSubmitRole() {
    var roleFormVal = this.roleForm.value;
    roleFormVal.id = this.id;

    if (roleFormVal.id) {
      this.submitted = true;
      this.settingS.updateRole(roleFormVal).then((res: any) => {
        this.roleForm.patchValue = { ...res };
        this.submitted = false;
        this.message.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Role updated',
          life: 3000,
        });
        setTimeout(() => {
          this.router.navigate(['/setting/roles']);
        }, 2000);
      }).catch(
        (err) => {
          console.log(err);
          this.submitted = false;
          this.message.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error while updating the role',
            life: 3000,
          });
        })
    } else {

      roleFormVal.user = this.currentUser;

      this.settingS.createRole(roleFormVal).then(
        (res) => {
          console.log(res);
          this.message.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Role Added Successfully',
            life: 3000,
          });
          setTimeout(() => {
            this.router.navigate(['/setting/roles']);
          }, 2000);
        }
      ).catch(
        (err) => {
          console.log(err);
          this.message.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error while saving the role',
            life: 3000,
          });
        }
      )
    }
  }

  createRole() {
    this.router.navigate(['/setting/role/create']);
  }

  onCancel() {
    this.router.navigate(['setting/roles']);
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

}
