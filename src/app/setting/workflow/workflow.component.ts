import { Component, OnInit } from '@angular/core';
import { SettingService } from '../setting.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { Roles, Workflow } from '../setting-models';
import { Role } from 'src/app/settings/roles/role';
import { AuthService } from 'src/app/auth/auth.service';
import { BreadCrumbService } from 'src/app/shared/navbar/bread-crumb.service';

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

  constructor(private router: Router, private route: ActivatedRoute, private message: MessageService, private settingS: SettingService, private fb: FormBuilder
    ,private authS : AuthService, private breadcrumbS: BreadCrumbService) { }

  ngOnInit(): void {
     
    this.breadcrumbS.breadCrumb([{ label: 'Workflow', routerLink: ['/setting/workflows'] }]);

    this.initForm();
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
        this.availableWorkflow();
      }
    });

    this.getAllRoles();
    this.getWorkflows();
  }

  initForm() {
    this.workflowForm = new FormGroup({
      id: new FormControl(''),
      makerRole: this.fb.group({
        id: new FormControl(''),
      }),
      checkerRole: this.fb.group({
        id: new FormControl(''),
      }),
      description: new FormControl('', Validators.required),
      increase: new FormControl(''),
      sanctioner: new FormControl(''),
      ratificationer: new FormControl(''),
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
    this.settingS.getAllRoles(this.currentUser).then((res: any) => {
      this.allRoles = res;
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
    //alert(JSON.stringify(workflowFormVal));

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
      workflowFormVal.user = this.currentUser ;
      this.settingS.createWorkflow(workflowFormVal).then((res) => {
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

  createWorkflow() {
    this.router.navigate(['/setting/workflow/create']);
  }

  onCancel() {
    this.router.navigate(['/setting/workflows']);
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
