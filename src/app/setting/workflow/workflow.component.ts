import { Component, OnInit } from '@angular/core';
import { SettingService } from '../setting.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { Roles, Workflow } from '../setting-models';
import { Role } from 'src/app/settings/roles/role';

@Component({
  selector: 'app-workflow',
  templateUrl: './workflow.component.html',
  styleUrls: ['./workflow.component.scss']
})
export class WorkflowComponent implements OnInit {

  id: string | null = '';
  createNew: boolean = false;
  submitted: boolean = false;
  workflowForm !: FormGroup;
  makerRole: Roles = {};
  checkerRole: Roles = {};
  allRoles: any[] = [];

  currentWorkflow: Workflow = {}

  selectedOption1: boolean = false;
  selectedOption2: boolean = false;
  selectedOption3: boolean = false;

  items!: MenuItem[];

  constructor(private router: Router, private route: ActivatedRoute, private message: MessageService, private settingS: SettingService, private fb: FormBuilder) { }

  ngOnInit(): void {
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
        this.availableWorkflow();
      }
    });

    this.items = [{ label: 'Settings' }, { label: 'Workflow', routerLink: ['/setting/workflows'] }, { label: 'Create' }];

    this.initForm();
    this.getAllRoles();
    this.getWorkflows();
  }

  initForm() {
    this.workflowForm = new FormGroup({
      makerRole: this.fb.group({
        id: new FormControl(''),
      }),
      checkerRole: this.fb.group({
        id: new FormControl(''),
      }),
      description: new FormControl('', Validators.required),
      increase: new FormControl(false),
      sanctioner: new FormControl(false),
      ratificationer: new FormControl(false),
    });
  }

  availableWorkflow() {
    this.submitted = true;
    this.settingS.getAllWorkflow().then((res: any) => {
      this.submitted = false;
      var count = res.totalElements;

      if (count > 0) {
        this.router.navigate(['/setting/workflows']);
      }
      else {
        this.createNew = false;
      }
    })
      .catch((err) => {
        console.log(err);
        this.submitted = false;
      })
  }


  getAllRoles() {
    this.submitted = true;
    this.settingS.getAllRoles().then((res: any) => {
      this.allRoles = res.content;
      this.submitted = false;
    })
      .catch((err) => {
        console.log(err);
        this.submitted = false;
      })
  }

  getWorkflows() {
    if (this.id) {
      this.submitted = true;
      this.settingS.getWorkflowById(this.id).then((workflow: Workflow) => {
        this.currentWorkflow = workflow;
        this.workflowForm.patchValue(workflow);
        this.submitted = false;
      })
        .catch((err) => {
          console.log(err);
          this.submitted = false;
        })
    }
  }

  submitWorkflow() {
    var workflowFormVal = this.workflowForm.value;
    workflowFormVal.id = this.id;
    alert(JSON.stringify(workflowFormVal));

    if (workflowFormVal.id) {
      this.submitted = false;
      this.settingS.updateWorkflow(workflowFormVal).then((res: any) => {
        this.workflowForm.patchValue = { ...res };
        this.submitted = false;
        this.message.add({
          severity: 'success',
          summary: 'Workflow Updated',
          detail: 'Workflow updated',
          life: 3000,
        });
        setTimeout(() => {
          this.router.navigate(['/setting/workflows']);
        }, 2000);
      });
    } else {
      this.settingS.createWorkflow(this.workflowForm.value).then((res) => {
        console.log(res);
        this.message.add({
          severity: 'success',
          summary: 'Workflow Saved',
          detail: 'Workflow Saved',
          life: 3000,
        });
        setTimeout(() => {
          this.router.navigate(['/setting/workflows']);
        }, 2000);
      })
        .catch(
          (err) => {
            console.log(err);
            this.message.add({
              severity: 'error',
              summary: 'Workflow Error',
              detail: 'Please check the server',
              life: 3000,
            });

          });
    }

  }
  firstOption : string = 'increase' ;
  secondOption : string = 'sanctioner' ;
  thirdOption : string = 'ratificationer' ;
  deSelectButton( name : any) {
    if( name == 'increase')
    {
       this.selectedOption1 = !this.selectedOption1;
       alert( this.selectedOption1 );
    }else if( name == 'sanctioner')
    {
       this.selectedOption2 = !this.selectedOption2;
       alert( this.selectedOption2 );
    }
    else if( name  == 'ratificationer' )
    {
      this.selectedOption3 =  !this.selectedOption3;
      alert( this.selectedOption3 );
    }
    // if (this.selectedOption1 === true) {
    //   this.selectedOption1 = false;
    // } else {
    //   this.selectedOption1 = true;
    // }

    // if (this.selectedOption2 === true) {
    //   this.selectedOption2 = false;
    // } else {
    //   this.selectedOption2 = true;
    // }

    // if (this.selectedOption3 === true) {
    //   this.selectedOption3 = false;
    // } else {
    //   this.selectedOption3 = true;
    // }
  }

  createWorkflow() {
    this.router.navigate(['/setting/workflow/create']);
  }

  onCancel() {
    this.router.navigate(['/setting/workflows']);
  }

}
