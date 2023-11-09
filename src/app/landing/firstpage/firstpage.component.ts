import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AuthService } from 'src/app/auth/auth.service';
import { PayPageService } from 'src/app/pay/pay-page.service';
import { BreadCrumbService } from 'src/app/shared/navbar/bread-crumb.service';

@Component({
  selector: 'app-firstpage',
  templateUrl: './firstpage.component.html',
  styleUrls: ['./firstpage.component.scss']
})
export class FirstpageComponent implements OnInit {

  openAccountSlideBar : boolean = false;

  formGroup!: FormGroup;
  submitted: boolean = false;
  constructor(private router: Router,
    private route: ActivatedRoute,
    private message: MessageService,
    private usedService: PayPageService,
    private authS: AuthService, private breadcrumbS: BreadCrumbService
  ) { }

  ngOnInit(): void {
  }

  showAccountSlidebar()
  {
    this.openAccountSlideBar = !this.openAccountSlideBar ;
  }
}
