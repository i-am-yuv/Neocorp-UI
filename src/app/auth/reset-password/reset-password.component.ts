import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
  AbstractControlOptions,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ConfirmedValidator } from 'src/app/dutch/directives/confirmed-validator';
import { LoginService } from '../login/login.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  pwdForm: FormGroup = new FormGroup({});
  submitted: boolean = false;
  resetPwd: boolean = false;
  invalidLink: boolean = false;
  failed: boolean = false;
  token: string | null = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private loginService: LoginService,
    private message: MessageService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token');
    if (!this.token) {
      this.invalidLink = true;
    }
    this.pwdForm = this.fb.group(
      {
        token: this.token,
        confirmPassword: this.fb.nonNullable.control('', {
          validators: [Validators.required],
        }),
        newPassword: this.fb.nonNullable.control('', {
          validators: [Validators.required],
        }),
      },
      {
        validator: ConfirmedValidator('newPassword', 'confirmPassword'),
      } as AbstractControlOptions
    );
  }
  onSubmit() {
    this.loginService
      .savePassword(this.pwdForm.value)
      .then((res: any) => {
        this.resetPwd = true;
      })
      .catch((err: any) => {
        this.invalidLink = true;
      });
  }
}
