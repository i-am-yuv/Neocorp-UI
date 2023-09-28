import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

import { Role } from './role';

@Injectable({ providedIn: 'root' })
export class RoleService {


    roles: string[] = [];
    apiurl: string = environment.apiurl;

    constructor(private http: HttpClient) { }

    async getRole(roleId: any) {
        var url = this.apiurl + '/roles/get/' + roleId;
        const res = await lastValueFrom(this.http.get<any>(url));
        return res;
    }
    getRoles(pageNo: number,
        pageSize: number,
        sortField : any,
        sortDir : any,
        filter: string) {
        var url = this.apiurl + '/roles/all?pageNo='+ pageNo + '&pageSize=' + pageSize + '&sortField=' + sortField + '&sortDir=' + sortDir + filter ;
        return this.http.get<any>(url)
            .toPromise()
            .then(data => { return data; });
    }

    createRole(role: Role) {
        var url = this.apiurl + '/roles/create'
        return this.http.post<any>(url, role)
            .toPromise()
            // .then(res => <Role>res.data)
            .then(data => { return data; });
    }

    updateRole(role: Role) {
        var url = this.apiurl + '/roles/update/' + encodeURIComponent(role.id!);
        return this.http.put<any>(url, role)
            .toPromise()
            // .then(res => <Role>res.data)
            .then(data => { return data; });
    }

    deleteRole(role: Role) {
        var url = this.apiurl + '/roles/delete/' + encodeURIComponent(role.id!);
        return this.http.delete<any>(url)
            .toPromise()
            // .then(res => <Role>res.data)
            .then(data => { return data; });
    }

}