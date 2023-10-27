import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { SettingService } from '../setting.service';
import { Workflow } from '../setting-models';

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

  constructor(private router: Router, private settingS: SettingService, private message: MessageService) { }

  ngOnInit(): void {
    this.items = [{ label: 'Settings' }, { label: 'Workflow' }, { label: 'Dashboard' }];

    this.loadAllWorkflows();
  }

  loadAllWorkflows() {
    this.submitted = true;
    this.settingS.getAllWorkflow().then((res: any) => {
      this.allWorkflows = res.content;
      this.totalRecords = res.totalElements;
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

}