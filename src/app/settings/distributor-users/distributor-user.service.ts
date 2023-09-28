import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { environment } from 'src/environments/environment';

import { DistributorUser } from './distributor-user';

@Injectable({ providedIn: 'root' })
export class DistributorUserService {

    distributors: string[] = [];

    apiurl: string = environment.apiurl;

    constructor(private http: HttpClient, private authService: AuthService) { }

    async getRolesByType(roleType: string) {
        var url = this.apiurl + '/roles/getAllByType/' + encodeURIComponent(roleType)
        const user = await lastValueFrom(this.http.get<any>(url));
        return user.content;
    }

    async getCurrentDistributorUser() {
        var currentUserId = this.authService.getUserId();
        var url = this.apiurl + '/distributor-user/getByUser/' + encodeURIComponent(currentUserId)
        const user = await lastValueFrom(this.http.get<any>(url));
        return user;
    }

    async getDistributorsByCompany(id: any) {
        var url = this.apiurl + '/distributor/getByCompany/' + encodeURIComponent(id!);
        const distributors = await lastValueFrom(this.http.get<any>(url));
        return distributors.content;
    }

    async getByUserId(userId: string) {
        var url = this.apiurl + '/distributor-user/getByUser/' + encodeURIComponent(userId!);
        const distributor = await lastValueFrom(this.http.get<any>(url));
        return distributor;
    }

    async getUsers() {
        var url = this.apiurl + '/user/all'
        const users = await lastValueFrom(this.http.get<any>(url));
        return users.content;
    }

    async getCompanies() {
        var url = this.apiurl + '/company/all'
        const distributor = await lastValueFrom(this.http.get<any>(url));
        return distributor.content;
    }

    async getDistributorUsers( pageNo: number,
        pageSize: number,
        sortField : any,
        sortDir : any,
        filter: string) {
        var url = this.apiurl + '/distributor-user/all?pageNo='+ pageNo + '&pageSize=' + pageSize + '&sortField=' + sortField + '&sortDir=' + sortDir + filter ;
        const distributor = await lastValueFrom(this.http.get<any>(url));
        return distributor;
    }



    async createDistributorUser(distributor: DistributorUser) {
        var url = this.apiurl + '/distributor-user/create'
        const _distributor = await lastValueFrom(this.http.post<any>(url, distributor));
        return _distributor;
    }

    async updateDistributorUser(distributor: DistributorUser) {
        var url = this.apiurl + '/distributor-user/update/' + encodeURIComponent(distributor.id!);
        const _distributor = await lastValueFrom(this.http.put<any>(url, distributor));
        return _distributor;
    }

    async deleteDistributorUser(distributor: DistributorUser) {
        var url = this.apiurl + '/distributor-user/delete/' + encodeURIComponent(distributor.id!);
        const _distributor = await lastValueFrom(this.http.delete<any>(url));
        return _distributor;
    }

}