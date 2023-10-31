import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  creatBtn : boolean = false;
  roles : any[] = [];
  constructor() { }

  ngOnInit(): void {
  }

  selectVendor()
  {
    
  }
}
