import { Injectable } from '@angular/core';
import { Roles } from './roles';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RolesServiceService {

  roles: string[] = [];
  apiurl: string = environment.apiurl;
  apiurlNew:string = environment.apiurlNew ;


  constructor(private http: HttpClient) { }

  async getRole(roleId: any) {
      var url = this.apiurlNew + '/roles/get/' + roleId;
      const res = await lastValueFrom(this.http.get<any>(url));
      return res;
  }
  // getRoles(pageNo: number,
  //     pageSize: number,
  //     sortField : any,
  //     sortDir : any,
  //     filter: string) {
  //     var url = this.apiurl + '/roles/all?pageNo='+ pageNo + '&pageSize=' + pageSize + '&sortField=' + sortField + '&sortDir=' + sortDir + filter ;
  //     return this.http.get<any>(url)
  //         .toPromise()
  //         .then(data => { return data; });
  // }

  async getRoles() {
    var url = this.apiurlNew + 'api/roles'
    const allrole = await lastValueFrom(this.http.get<any>(url));
    return allrole;
  }

  createRole(role: Roles) {
      var url = this.apiurlNew + 'api/roles'
      return this.http.post<any>(url, role)
          .toPromise()
          // .then(res => <Role>res.data)
          .then(data => { return data; });
  }
  

  updateRole(role: Roles) {
      var url = this.apiurlNew + 'api/roles'
      return this.http.put<any>(url, role)
          .toPromise()
          // .then(res => <Role>res.data)
          .then(data => { return data; });
  }

  deleteRole(role: Roles) {
      var url = this.apiurlNew + 'api/roles' 
      return this.http.delete<any>(url)
          .toPromise()
          // .then(res => <Role>res.data)
          .then(data => { return data; });
  }
  

}