import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-quick-pay',
  templateUrl: './quick-pay.component.html',
  styleUrls: ['./quick-pay.component.scss']
})
export class QuickPayComponent implements OnInit {

  rejectedData: any[] = [];
  cols: any[] = [];

  constructor() { }

  ngOnInit(): void {
    this.cols = [{
      field: 'beneficiary',
      header: 'Beneficiary',
    }]
  }

}
