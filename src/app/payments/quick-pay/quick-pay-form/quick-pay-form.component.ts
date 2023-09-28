import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-quick-pay-form',
  templateUrl: './quick-pay-form.component.html',
  styleUrls: ['./quick-pay-form.component.scss']
})
export class QuickPayFormComponent implements OnInit {

  mode: string = 'upi';

  accounts: any[] = [];

  constructor() { }

  ngOnInit(): void {
  }

}
