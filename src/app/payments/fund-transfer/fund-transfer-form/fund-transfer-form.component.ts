import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-fund-transfer-form',
  templateUrl: './fund-transfer-form.component.html',
  styleUrls: ['./fund-transfer-form.component.scss']
})
export class FundTransferFormComponent implements OnInit {

  beneficiaries: any[] = [];
  mode: string = '';

  constructor() { }

  ngOnInit(): void {
  }

}
