import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { SettingService } from '../setting.service';
import { Workflow } from '../setting-models';
import { BreadCrumbService } from 'src/app/shared/navbar/bread-crumb.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-workflow-dashboard',
  templateUrl: './workflow-dashboard.component.html',
  styleUrls: ['./workflow-dashboard.component.scss']
})
export class WorkflowDashboardComponent implements OnInit {

  submitted: boolean = false;
  items!: MenuItem[];
  allWorkflows: any[] = [];
  activeWorkflow: Workflow = {};
  totalRecords: number = 0;

  constructor(private router: Router,
    private authS : AuthService, private settingS: SettingService, private message: MessageService, private breadcrumbS: BreadCrumbService) { }

  ngOnInit(): void {
    this.breadcrumbS.breadCrumb([{ label: 'Workflow' }, { label: 'Dashboard' }]);

    this.loadUser();
  }

  loadOtherInfo()
  {
    this.loadAllWorkflows();
  }

  loadAllWorkflows() {
    this.submitted = true;
    this.settingS.getAllWorkflow(this.currentUser).then((res: any) => {
      this.allWorkflows = res;
      if (this.allWorkflows.length > 0) {
        this.changeWorkflow(this.allWorkflows[0]);
      } else {
        this.activeWorkflow = {};
      }
      this.totalRecords = res.length;
      this.submitted = false;
    })
      .catch((err) => {
        console.log(err);
        this.submitted = false;
      })
  }

  changeWorkflow(workflow: Workflow) {
    this.activeWorkflow = workflow;
  }

  onEditWorkflow(id: string) {
    this.router.navigate(['setting/workflow/edit/' + id]);
  }

  createWorkflow() {
    this.router.navigate(['/setting/workflow/create']);
  }

  searchWorkFlow : any ;
  searchWorkFlows(a:any)
  {
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
