import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { SettingService } from '../setting.service';

@Component({
  selector: 'app-delegation-role',
  templateUrl: './delegation-role.component.html',
  styleUrls: ['./delegation-role.component.scss']
})
export class DelegationRoleComponent implements OnInit {
  id: string | null = '';

  delroleForm !: FormGroup ;

  roles : any[] = [] ;
  submitted!: boolean;

  constructor(private router: Router,
    private message: MessageService,
    private service : SettingService,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    this.laodRoles();
    this.initForm();
    // this.getDelegationRole();
  }

  initForm()
  {
    this.delroleForm = new FormGroup({
      delegationName : new FormControl('', Validators.required), 
      delegationDescription : new FormControl('' , Validators.required),
      delegationAmount : new FormControl('' , Validators.required),
      role: this.fb.group({
        id: this.fb.nonNullable.control('', {
          validators: Validators.required,
        })
      })
    });  
  }




  laodRoles()
  {
    this.service.getAllRoles().then(
      (res)=>{
         console.log(res);
         this.roles = res.content;
        //  this.message.add({
        //   severity: 'success',
        //   summary: 'Role Saved',
        //   detail: 'Role Added Successfully',
        //   life: 3000,
        // });
      }
    ).catch(
      (err)=>{
        console.log(err);
        this.message.add({
          severity: 'error',
          summary: ' All Role Error',
          detail: 'Error while fetching All role',
          life: 3000,
        });
      }
    )
  }
  selectVendor(){}

  // onSubmitDelegationRole()
  // {
  //   alert(JSON.stringify(this.delroleForm.value) ) ;
    
  //     this.service.createDelegationRole(this.delroleForm.value).then(
  //       (res)=>{
  //          console.log(res);
  //          this.message.add({
  //           severity: 'success',
  //           summary: 'Delegation Role Saved',
  //           detail: 'Delegation Role Added Successfully',
  //           life: 3000,
  //         });
  //       }
  //     ).catch(
  //       (err)=>{
  //         console.log(err);
  //         this.message.add({
  //           severity: 'error',
  //           summary: 'Delegation Role Error',
  //           detail: 'Please check the server',
  //           life: 3000,
  //         });
  //       }
  //     )
  // }








  onSubmitDelegationRole() {

    // this.delroleForm.value.delegationName = null;
    // this.delroleForm.value.delegationDescription = null;
    // this.delroleForm.value.delegationAmount = null;
    // this.delroleForm.value.role = null;

    var productFormVal = this.delroleForm.value;
    productFormVal.id = this.id;
    alert(JSON.stringify(productFormVal));

    if (productFormVal.id) {
      this.submitted = true;
      this.service.updateDelegationRole(productFormVal)
        .then((res: any) => {
          console.log(res);
          this.delroleForm.patchValue = { ...res };
          this.submitted = false;
          this.message.add({
            severity: 'success',
            summary: 'Delegation Role Updated',
            detail: 'Delegation Role updated',
            life: 3000,
          });
          this.router.navigate(['/setting/delegationRoless']);
        })
        .catch(
          (err) => {
            console.log(err);
            this.submitted = false;
            this.message.add({
              severity: 'error',
              summary: 'Delegation Role updated Error',
              detail: 'Some Server Error',
              life: 3000,
            });
          })
    } 
    else {
      console.log(this.delroleForm);
      this.service.createDelegationRole(this.delroleForm.value).then(
        (res)=>{
           console.log(res);
           this.message.add({
            severity: 'success',
            summary: 'Delegation Role Saved',
            detail: 'Delegation Role Added Successfully',
            life: 3000,
          });
        }
      ).catch(
        (err)=>{
          console.log(err);
          this.message.add({
            severity: 'error',
            summary: 'Delegation Role Error',
            detail: 'Please check the server',
            life: 3000,
          });
        }
      )

    }
  }







  onCancel(){
    this.router.navigate(['/setting/delegationRoless']);
  }

}
