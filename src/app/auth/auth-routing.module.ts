import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LoginComponent } from './login/login.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { SignupComponent } from './signup/signup.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { VerifyOtpComponent } from './verify-otp/verify-otp.component';
import { EkycComponent } from './ekyc/ekyc.component';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
  },
  {
    path: 'signup/:type',
    component: SignupComponent,
  },
  {
    path: 'eKyc',
    component: EkycComponent,
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
  },
  {
    path: 'verifyemail',
    component: VerifyEmailComponent,
  },
  {
    path: 'verifyotp',
    component: VerifyOtpComponent,
  },
  {
    path: 'verifyotp/:type',
    component: VerifyOtpComponent,
  },
  {
    path: 'resetpassword',
    component: ResetPasswordComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
