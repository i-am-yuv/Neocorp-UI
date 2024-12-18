import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { lastValueFrom } from 'rxjs';
import { Workflow } from './setting-models';

@Injectable({
  providedIn: 'root'
})
export class SettingService {


  apiurl: string = environment.apiurl;
  apiurlNew: string = environment.apiurlNew;

  constructor(private http: HttpClient) { }

  async createRole(product: any) {
    var url = this.apiurlNew + 'api/roles'
    const role = await lastValueFrom(this.http.post<any>(url, product));
    return role;
  }

  async getAllRoles(user : any) {
    var url = this.apiurlNew + 'api/roles/role/'+ encodeURIComponent(user.id);
    const allrole = await lastValueFrom(this.http.get<any>(url));
    return allrole;
  }

  async getRoleById(roleId : any) {
    var url = this.apiurlNew + 'api/roles/'+ encodeURIComponent(roleId);
    const role = await lastValueFrom(this.http.get<any>(url));
    return role;
  }

  async updateRole(role: any) {
    var url = this.apiurlNew + 'api/roles'
    const updateRole = await lastValueFrom(this.http.put<any>(url, role));
    return updateRole;
  }

  async getAllRolesById(id: any) {
    var url = this.apiurlNew + 'api/roles/' + encodeURIComponent(id);
    const getAllRolesById = await lastValueFrom(this.http.get<any>(url));
    return getAllRolesById;
  }

  async createDelegationRole(deleRole: any) {
    var url = this.apiurlNew + 'delegationRole'
    const delegationRole = await lastValueFrom(this.http.post<any>(url, deleRole));
    return delegationRole;
  }
  async updateDelegationRole(deleRole: any) {
    var url = this.apiurlNew + 'delegationRole';
    const updatedelegationRole = await lastValueFrom(this.http.put<any>(url, deleRole));
    return updatedelegationRole;
  }

  async getDelegationRoleById(id: any) {
    var url = this.apiurlNew + 'delegationRole/' + encodeURIComponent(id);
    const delegationRoleById = await lastValueFrom(this.http.get<any>(url));
    return delegationRoleById;
  }

  async getAlldelegationRole(user : any) {
    var url = this.apiurlNew + 'delegationRole/delegationRole/'+ encodeURIComponent(user.id);
    const delegationRole = await lastValueFrom(this.http.get<any>(url));
    return delegationRole;
  }

  async createWorkflow(workflow: Workflow) {
    var url = this.apiurlNew + 'workflow'
    const createWorkflow = await lastValueFrom(this.http.post<any>(url, workflow));
    return createWorkflow;
  }

  async getAllWorkflow(user : any) {
    var url = this.apiurlNew + 'workflow/workflow/'+ encodeURIComponent(user.id);
    const getAllWorkflow = await lastValueFrom(this.http.get<any>(url));
    return getAllWorkflow;
  }

  async updateWorkflow(workflow: any) {
    var url = this.apiurlNew + 'workflow';
    const updateWorkflow = await lastValueFrom(this.http.put<any>(url, workflow));
    return updateWorkflow;
  }

  async getWorkflowById(id: any) {
    var url = this.apiurlNew + 'workflow/' + encodeURIComponent(id);
    const getWorkflowById = await lastValueFrom(this.http.get<any>(url));
    return getWorkflowById;
  }

}
