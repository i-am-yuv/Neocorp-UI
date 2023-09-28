import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { SettingService } from '../setting.service';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent implements OnInit {

  roleForm !: FormGroup ;

  constructor(private router: Router,
    private message: MessageService,
    private service : SettingService) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm()
  {
    this.roleForm = new FormGroup({
      name : new FormControl('', Validators.required), 
      roleType : new FormControl('' , Validators.required),
      description : new FormControl('' , Validators.required)
    });   
  }


  onSubmitRole() {
    alert(JSON.stringify(this.roleForm.value) ) ;
    
      this.service.createRole(this.roleForm.value).then(
        (res)=>{
           console.log(res);
           this.message.add({
            severity: 'success',
            summary: 'Role Saved',
            detail: 'Role Added Successfully',
            life: 3000,
          });
        }
      ).catch(
        (err)=>{
          console.log(err);
          this.message.add({
            severity: 'error',
            summary: 'Role Error',
            detail: 'Please check the server',
            life: 3000,
          });
        }
      )
  }

}
