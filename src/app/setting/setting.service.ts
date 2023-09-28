import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingService {

  apiurl: string = environment.apiurl;
  apiurlNew:string = environment.apiurlNew ;

  constructor(private http: HttpClient) { }

  async createRole(product: any) {
    var url = this.apiurlNew + 'api/roles'
    const role = await lastValueFrom(this.http.post<any>(url, product));
    return role;
  }

  async createDelegationRole(product: any) {
    var url = this.apiurlNew + 'delegationRole'
    const delegationRole = await lastValueFrom(this.http.post<any>(url, product));
    return delegationRole;
  }

  async getAllRoles() {
    var url = this.apiurlNew + 'api/roles'
    const allrole = await lastValueFrom(this.http.get<any>(url));
    return allrole;
  }

}
