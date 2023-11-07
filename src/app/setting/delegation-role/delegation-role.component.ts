import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { SettingService } from '../setting.service';
import { DelegationRole } from '../privilege/privilege';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-delegation-role',
  templateUrl: './delegation-role.component.html',
  styleUrls: ['./delegation-role.component.scss']
})
export class DelegationRoleComponent implements OnInit {
  id: string | null = '';

  createNew: boolean = false;

  chooseRoleId: any;
  currentDelegationRole: DelegationRole = {};

  delroleForm !: FormGroup ;

  roles : any[] = [] ;
  submitted!: boolean;

  items!: MenuItem[];

  constructor(private router: Router,
    private route: ActivatedRoute,
    private message: MessageService,
    private service : SettingService,
    private fb: FormBuilder ,
    private authS  : AuthService) { }

  ngOnInit(): void {
      this.loadUser();
  }

  loadOtherInfo()
  {
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
        this.availableDelegationRole();
      }
    });

    this.items = [{label: 'Settings'}, {label: 'Delegation Role', routerLink: ['/setting/delegationRoles']}, {label: 'Create'}];
    
    this.initForm();
    this.laodRoles();
    this.getDelegationRole();
  }

  availableDelegationRole(){
      this.submitted = true;
      this.service.getAlldelegationRole(this.currentUser).then(
        (res) => {
          this.submitted = false;
          var count = res.length;
          //count=0
          if (count > 0) {
            this.router.navigate(['/setting/delegationRoles']);
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

  initForm()
  {
    this.delroleForm = new FormGroup({
      delegationName : new FormControl('', Validators.required), 
      delegationDescription : new FormControl(''),
      delegationAmount : new FormControl('' , Validators.required),
      role: this.fb.group({
        id: this.fb.nonNullable.control('', {
          validators: Validators.required,
        })
      })
    });  
  }


  getDelegationRole() {
    if (this.id) {
      this.submitted = true;
      this.service.getDelegationRoleById(this.id)
        .then((delRole: DelegationRole) => {
          console.log(delRole);
          this.currentDelegationRole = delRole;
          this.delroleForm.patchValue(delRole);
          this.submitted = false;
        })
        .catch((err) => {
          console.log(err);
          this.submitted = false;
        })
    }
  }
  

  laodRoles()
  {
    this.service.getAllRoles( this.currentUser).then(
      (res)=>{
         console.log(res);
         this.roles = res;
      }
    ).catch(
      (err)=>{
        console.log(err);
        this.message.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error while fetching All role',
          life: 3000,
        });
      }
    )
  }
  selectVendor(){}

  onSubmitDelegationRole() {

    var delroleFormVal = this.delroleForm.value;
    delroleFormVal.id = this.id;
   
    if (delroleFormVal.id) {
      this.submitted = true;
      this.service.updateDelegationRole(delroleFormVal)
        .then((res: any) => {
          console.log(res);
          this.delroleForm.patchValue = { ...res };
          this.submitted = false;
          this.message.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Delegation Role updated',
            life: 3000,
          });
          setTimeout(() => {
            this.router.navigate(['/setting/delegationRoles']);
          }, 2000);
          
        })
        .catch(
          (err) => {
            console.log(err);
            this.submitted = false;
            this.message.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error While updating delegation role',
              life: 3000,
            });
          })
    } 
    else {
      
      delroleFormVal.user  = this.currentUser ;
      this.service.createDelegationRole(this.delroleForm.value).then(
        (res)=>{
           console.log(res);
           this.message.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Delegation Role Saved Successfully',
            life: 3000,
          });
          setTimeout(() => {
            this.router.navigate(['/setting/delegationRoles']);
          }, 2000);
        }
      ).catch(
        (err)=>{
          console.log(err);
          this.message.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error while saving the delegation role',
            life: 3000,
          });
        }
      )

    }
  }



  createDelRole() {
    //this.createNew = true;
    this.router.navigate(['/setting/delegationRole/create']);
  }



  onCancel(){
    this.router.navigate(['/setting/delegationRoles']);
  }

  
  currentCompany : any = {} ;
  currentUser : any = {} ;
  loadUser() {
    this.submitted = true;
    this.authS.getUser().then((res: any) => {
      this.currentCompany = res.comapny;
      this.currentUser  = res ;
      this.submitted = false;

      this.loadOtherInfo();
      
    })
      .catch((err) => {
        console.log(err);
        this.submitted = false;
      });
  }


}
