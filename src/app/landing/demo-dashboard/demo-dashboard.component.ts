import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-demo-dashboard',
  templateUrl: './demo-dashboard.component.html',
  styleUrls: ['./demo-dashboard.component.scss']
})
export class DemoDashboardComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

   allDemoPay: any[] = [
    {
      grossTotal: '10000',
      duedate: '03-11-2023',
      status : 'Partially paid',
      vendor: {
        firstName: 'Praksh',
        lastName: 'Kumar',
      },
    },
    {
      grossTotal: '20000',
      duedate: '05-11-2023',
      status : '5 Days Overdue',
      vendor: {
        firstName: 'Jay',
        lastName: 'Roy',
      },
    },
    {
      grossTotal: '20000',
      duedate: '10-11-2023',
      status : '3 Days Overdue',
      vendor: {
        firstName: 'Dev',
        lastName: 'Kumar',
      },
    },
  ];
  
}
