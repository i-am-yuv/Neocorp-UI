import { Injectable } from '@angular/core';
import { Privilege } from './privilege';
import { lastValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PrivilegeService {

  apiurl: string = environment.apiurl;
  apiurlNew:string = environment.apiurlNew ;

  constructor(private http: HttpClient) { }

  async getPrivileges(pageNo: number,
    pageSize: number,
    sortField : any,
    sortDir : any,
    filter: string) {
    var url = this.apiurl + '/privilege/all?pageNo='+ pageNo + '&pageSize=' + pageSize + '&sortField=' + sortField + '&sortDir=' + sortDir + filter ;
    const res = await lastValueFrom(this.http.get<any>(url));
    return res;
  }

  async createPrivilege(privilege: Privilege) {
    var url = this.apiurlNew + '/privilege/create'
    const res = await lastValueFrom(this.http.post<any>(url, privilege));
    return res;
  }

  async updatePrivilege(privilege: Privilege) {
    var url = this.apiurlNew + '/privilege/update/' + encodeURIComponent(privilege.id!);
    const res = await lastValueFrom(this.http.put<any>(url, privilege));
    return res;
  }

  async deletePrivilege(privilege: Privilege) {
    var url = this.apiurlNew + '/privilege/delete/' + encodeURIComponent(privilege.id!);
    const res = await lastValueFrom(this.http.delete<any>(url));
    return res;
  }

  async getByRole(roleid: any) {
    var url = this.apiurlNew + '/privilege/getByRole/' + roleid;
    const res = await lastValueFrom(this.http.get<any>(url));
    return res;
  }

 

  async addToRole(roleid: any, privilegeid: any) {
    var url = this.apiurlNew + '/privilege/addToRole/' + roleid + '/' + privilegeid;
    const res = await lastValueFrom(this.http.get<any>(url));
    return res;
  }

  async unlinkRole(roleid: any, privilegeid: any) {
    var url = this.apiurlNew + '/privilege/unlinkRole/' + roleid + '/' + privilegeid;
    const res = await lastValueFrom(this.http.get<any>(url));
    return res;
  }

}
