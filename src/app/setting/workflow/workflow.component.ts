import { Component, OnInit } from '@angular/core';
import { SettingService } from '../setting.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-workflow',
  templateUrl: './workflow.component.html',
  styleUrls: ['./workflow.component.scss']
})
export class WorkflowComponent implements OnInit {

  roleForm !: FormGroup ;

  constructor(private router: Router,
    private message: MessageService,
    private service : SettingService,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    this.initForm();
    this.laodRoles();
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

  privileges: any = [
    {
      "id": "1",
      "name": "ITEM"
    },
    {
      "id": "2",
      "name": "SERVICE"
    }
  ];

roles:any[]=[];

selectVendor(){}


  initForm()
  {
    this.roleForm = new FormGroup({
      // makerRole : new FormControl('', Validators.required), 
      // checkerRole : new FormControl('' , Validators.required),
      increase : new FormControl(''),
      sanctioner : new FormControl(''),
      ratificationer : new FormControl(''),
      description:new FormControl(''),
     
      makerRole: this.fb.group({
        id: this.fb.nonNullable.control('', {
          validators: Validators.required,
        })
      }),

      checkerRole: this.fb.group({
        id: this.fb.nonNullable.control('', {
          validators: Validators.required,
        })
      })
    });   
  }


  onSubmitRole() {
    alert(JSON.stringify(this.roleForm.value) ) ;
    
      this.service.createWorkflow(this.roleForm.value).then(
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
