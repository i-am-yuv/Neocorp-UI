import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { LoginService } from '../login/login.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  pwdForm!: FormGroup<any>;
  submitted: boolean = false;
  resetMailSent: boolean = false;

  constructor(
    private router: Router,
    private loginService: LoginService,
    private message: MessageService
  ) {}

  ngOnInit(): void {
    this.pwdForm = new FormGroup({
      username: new FormControl('', Validators.required),
    });
  }
  onSubmit() {
    this.loginService
      .resetPassword(this.pwdForm.value.username)
      .then((res: any) => {
        this.resetMailSent = true;
      });
  }
}
