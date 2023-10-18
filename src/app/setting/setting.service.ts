import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { lastValueFrom } from 'rxjs';
import { Roles, Workflow } from './roles/roles';

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
  async updateDelegationRole(product: any ) {
    var url = this.apiurlNew + 'delegationRole';
    const updatedelegationRole = await lastValueFrom(this.http.put<any>(url, product));
    return updatedelegationRole;
  }

  async getDelegationRoleById(id: any) {
    var url = this.apiurlNew + 'delegationRole/' + encodeURIComponent(id);
    const productById = await lastValueFrom(this.http.get<any>(url));
    return productById;
  }
  

  async getAlldelegationRole() {
    var url = this.apiurlNew + 'delegationRole'
    const delegationRole = await lastValueFrom(this.http.get<any>(url));
    return delegationRole;
  }

  async getAllRoles() {
    var url = this.apiurlNew + 'api/roles'
    const allrole = await lastValueFrom(this.http.get<any>(url));
    return allrole;
  }

  async createWorkflow(product: Workflow) {
    var url = this.apiurlNew + 'workflow'
    const workflow = await lastValueFrom(this.http.post<any>(url, product));
    return workflow;
  }


//   createWorkflow(role: Roles) {
//     var url = this.apiurlNew + 'workflow'
//     return this.http.post<any>(url, role)
//         .toPromise()
//         // .then(res => <Role>res.data)
//         .then(data => { return data; });
// }
}
