import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DutchModule } from '../dutch/dutch.module';


import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { VerifyOtpComponent } from './verify-otp/verify-otp.component';
import { EkycComponent } from './ekyc/ekyc.component';
import { MenubarModule } from 'primeng/menubar';


@NgModule({
  declarations: [
    LoginComponent,
    SignupComponent,
    ForgotPasswordComponent,
    VerifyEmailComponent,
    ResetPasswordComponent,
    VerifyOtpComponent,
    EkycComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    DutchModule,
    MenubarModule
  ]
})
export class AuthModule { }
