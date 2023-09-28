import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-firstpage',
  templateUrl: './firstpage.component.html',
  styleUrls: ['./firstpage.component.scss']
})
export class FirstpageComponent implements OnInit {

  isSidebarVisible : boolean =  true;
  
  constructor() { }

  ngOnInit(): void {
  }

}
