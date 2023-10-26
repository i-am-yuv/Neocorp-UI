import { Component, OnInit, ViewChild } from '@angular/core';
import { Roles } from './roles';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { RolesServiceService } from './roles-service.service';
import { ConfirmationService, LazyLoadEvent, MenuItem, MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { Table } from 'primeng/table';
import { FilterBuilder } from 'src/app/utils/FilterBuilder';
import { Privilege } from '../privilege/privilege';
import { PrivilegeService } from '../privilege/privilege.service';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {

  allRoles: any[] = [];
  activeProductCategory: Roles = {};

  totalRecords: number = 0;

  id: string | null = '';

  createNew: boolean = false;

  chooseRoleId: any;
  currentRole: Roles = {};





  roleDialog!: boolean;

  roles!: Roles[];

  privilege!: Privilege[]

  role!: Roles;

  roleTypes: string[] = ['ACCOUNTANT', 'ADMIN'];
  roleForm!: FormGroup;
  selectedRoles!: any;

  submitted!: boolean;
  home!: MenuItem;
  items: MenuItem[] = [];
  sortField: string = '';
  search: string = '';
  pageNo: number = 0;
  pageSize: number = 10;
  sortDir: string = 'DESC';

  @ViewChild('dt') dt: Table | undefined;
  // totalRecords: any;

  constructor(
    private router: Router,
    private rolesService: RolesServiceService,
    private privilageService: PrivilegeService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) { }



  ngOnInit() {
    this.openNew();
    this.loadPrivileges();




    this.items = [{ label: 'Roles' }];
    this.home = { icon: 'pi pi-home', routerLink: '/dashboard' };



    this.id = this.route.snapshot.paramMap.get('id');

    this.route.url.subscribe(segments => {
      let lastSegment = segments[segments.length - 1];
      if (lastSegment && lastSegment.path == 'create') {
        this.createNew = true;
      }
      else if (lastSegment && lastSegment.path == this.id) {
        this.createNew = true;
      }
      else {
        // this.availableRole();
      }
    });

  }

  initForm(){
    this.roleForm = this.fb.group({
      id: [],
      name: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20),]],
      roleId: [],
      roleType: new FormControl('', Validators.required),
      description: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
      privilege: this.fb.group({
        id: this.fb.nonNullable.control('',
          // {
          //   validators: Validators.required,
          // }
        )
      })
    });
  }



  loadPrivileges() {
    // this.privService.getPrivileges().then(
    //   (res)=>{
    //      console.log(res);
    //      this.roles = res.content;
    //     //  this.message.add({
    //     //   severity: 'success',
    //     //   summary: 'Role Saved',
    //     //   detail: 'Role Added Successfully',
    //     //   life: 3000,
    //     // });
    //   }
    // ).catch(
    //   (err)=>{
    //     console.log(err);
    //     this.messageService.add({
    //       severity: 'error',
    //       summary: ' All Role Error',
    //       detail: 'Error while fetching All role',
    //       life: 3000,
    //     });
    //   }
    // )
  }


  onSubmitRole() {

    // this.delroleForm.value.delegationName = null;
    // this.delroleForm.value.delegationDescription = null;
    // this.delroleForm.value.delegationAmount = null;
    // this.delroleForm.value.role = null;

    var productFormVal = this.roleForm.value;
    productFormVal.id = this.id;
    alert(JSON.stringify(productFormVal));

    if (productFormVal.id) {
      this.submitted = true;
      this.rolesService.updateRole(productFormVal)
        .then((res: any) => {
          console.log(res);
          this.roleForm.patchValue = { ...res };
          this.submitted = false;
          this.messageService.add({
            severity: 'success',
            summary: ' Role Updated',
            detail: ' Role updated',
            life: 3000,
          });
          setTimeout(() => {
            this.router.navigate(['/setting/Roles/create']);
          }, 2000);

        })
        .catch(
          (err) => {
            console.log(err);
            this.submitted = false;
            this.messageService.add({
              severity: 'error',
              summary: ' Role updated Error',
              detail: 'Some Server Error',
              life: 3000,
            });
          })
    }
    else {
      console.log(this.roleForm);
      this.rolesService.createRole(this.roleForm.value).then(
        (res) => {
          console.log(res);
          this.messageService.add({
            severity: 'success',
            summary: ' Role Saved',
            detail: ' Role Saved Successfully',
            life: 3000,
          });
          setTimeout(() => {
            this.router.navigate(['/setting/Roles/create']);
          }, 2000);
        }
      ).catch(
        (err) => {
          console.log(err);
          this.messageService.add({
            severity: 'error',
            summary: ' Role Error',
            detail: 'Please check the server',
            life: 3000,
          });
        }
      )

    }
  }



  availableRole() {
    this.submitted = true;
    this.rolesService.getRoles().then(
      (res) => {
        this.submitted = false;
        var count = res.totalElements;
        //count=0
        if (count > 0) {
          this.router.navigate(['/setting/roles']);
        }
        else {
          this.createNew = false;
        }
      }
    ).catch(
      (err) => {
        console.log(err);
        this.submitted = false;
      }
    )

  }



  getAllRoles() {
    this.submitted = true;
    this.rolesService.getRoles()
      .then((res: any) => {
        this.allRoles = res.content;
        this.totalRecords = res.totalElements;
        this.submitted = false;
      })
      .catch((err) => {
        console.log(err);
        this.submitted = false;
      })
  }


  changeProductCategory(delegationRole: Roles) {
    this.activeProductCategory = delegationRole;
  }


  onEditDelegationRole(id: string) {
    this.router.navigate(['setting/Roles/edit/' + id]);
  }












  editPrivileges(role: any) {
    this.router.navigate(['/setting/roles-privilege/' + role.id]);
  }

  openNew() {
    this.role = {};
    this.submitted = false;
    this.roleDialog = true;
  }


  deleteSelectedRoles() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected Roles?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.roles = this.roles.filter(
          (val) => !this.selectedRoles.includes(val)
        );
        this.selectedRoles = null;
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Roles Deleted',
          life: 3000,
        });
      },
    });
  }

  editRole(role: Roles) {
    this.role = { ...role };
    this.roleDialog = true;
  }

  deleteRole(role: Roles) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + role.name + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.rolesService.deleteRole(role).then((data) => {
          this.roles = this.roles.filter((val) => val.id !== role.id);
          this.role = {};
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Role Deleted',
            life: 3000,
          });
        });
      },
    });
  }





  saveRole() {
    this.submitted = true;

    if (this.role.name?.trim()) {
      if (this.role.id) {
        this.rolesService.updateRole(this.role).then((res: any) => {
          // this.roles.push(res);
          this.roles[this.findIndexById(res.id)] = res;
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Role Updated',
            life: 3000,
          });
        });
      } else {
        this.rolesService.createRole(this.role).then((res: any) => {
          this.roles.push(res);
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Role Created',
            life: 3000,
          });
        });
      }

      this.roles = [...this.roles];
      this.roleDialog = false;
      this.role = {};
    }
  }

  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.roles.length; i++) {
      if (this.roles[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  }

  // applyFilterGlobal($event: any, stringVal: any) {
  //
  //   this.dt?.filterGlobal(
  //     ($event.target as HTMLInputElement).value,
  //     'contains'
  //   );
  // }



  createRole() {
    //this.createNew = true;
    this.router.navigate(['/setting/role/create']);
  }



  onCancel() {
    this.router.navigate(['/setting/roles']);
  }
}

