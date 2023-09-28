import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
//import * as jwt from 'node_modules/jsonwebtoken';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  apiurl: string = environment.apiurl;
  apiurlNew: string = environment.apiurlNew;

  constructor(private http: HttpClient ) {}

  async doLogin(credentials: any) {
    var url = this.apiurl + '/auth/authenticate';
    const login = await lastValueFrom(this.http.post<any>(url, credentials));
    return login;
  }

  async signup(data: any) {
    var url = this.apiurl + '/auth/signup';
    const login = await lastValueFrom(this.http.post<any>(url, data));
    return login;
  }

  async verifyAadhar(data: any) {
    var url = this.apiurlNew + 'api/aadhaar/initiate?aadhaarNumber='+data;
    const aadharVerified = await lastValueFrom(this.http.post<any>(url,data));
    return aadharVerified;
  }

  async verifyAadharOTP(data: any) {
    var url = this.apiurlNew + 'api/aadhaar/verify?ref_id='+data.refId+'&otp='+data.otp;
    const aadharVerifiedOTP = await lastValueFrom(this.http.post<any>(url, data));
    return aadharVerifiedOTP;
  }

  async verifyPan(data: any) {
    var url = this.apiurlNew + 'api/panVerification/verify-pan-and-get-details?pan='+data;
    return this.http.get<any>(url)
            .toPromise()
            .then(data => { 
              return data; });
   // const panVerified = await lastValueFrom(this.http.get<any>(url) );
    //return panVerified;
  }

  // async signupwithEmailOrPhone(data: any, flag: boolean) {
  //   if (flag) {
  //     var url = this.apiurl + '/auth/signupByMobile';
  //   } else {
  //     //var url = this.apiurl + '/auth/signup';
  //     var url = this.apiurl + '/auth/signupByMobile';
  //   }
  //   const login = await lastValueFrom(this.http.post<any>(url, data));
  //   return login;
  // }
  async verifyOtp(data: any) {
    var url = this.apiurl + '/auth/verifyotp';
    const verifyOtpResponse = await lastValueFrom(
      this.http.post<any>(url, data)
    );
    return verifyOtpResponse;
  }

  async sendOtp(data: any) {
    var url = this.apiurl + '/auth/sendotp';

    const sendOtpResponse = await lastValueFrom(this.http.post<any>(url, data));
    return sendOtpResponse;
  }
  async resendOtp(data: any) {
    var url = this.apiurl + '/auth/resendotp/' + data;

    const sendOtpResponse = await lastValueFrom(this.http.get<any>(url));
    return sendOtpResponse;
  }
  async resetPassword(username: string) {
    var url =
      this.apiurl +
      '/auth/resetPassword?username=' +
      encodeURIComponent(username);
    const reset = await lastValueFrom(this.http.get<any>(url));
    return reset;
  }

  async savePassword(data: any) {
    var url = this.apiurl + '/auth/savePassword';
    const login = await lastValueFrom(this.http.post<any>(url, data));
    return login;
  }

  // decodeJwtToken(token: string): any {
  //   try {
  //     const decodedToken = this.jwt.decode(token);
  //     return decodedToken;
  //   } catch (error) {
  //     console.error('Error decoding JWT token:', error);
  //     return null; // Handle the error as needed
  //   }
  // }

}
