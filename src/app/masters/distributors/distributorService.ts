import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

import { Distributor } from './distributor';

@Injectable({ providedIn: 'root' })
export class DistributorService {

    distributors: string[] = [];

    apiurl: string = environment.apiurl;

    constructor(private http: HttpClient) { }

    // async getStates() {
    //     var url = this.apiurl + '/state/all'
    //     const states = await lastValueFrom(this.http.get<any>(url));
    //     return states.content;
    // }
    getStates(pageNo: number,
        pageSize: number,
        sortField: any,
        sortDir: any,
        search: string) {
        var url = this.apiurl + '/state/all?pageNo=' + pageNo + '&pageSize=' + pageSize + '&sortField=' + sortField + '&sortDir=' + sortDir + '&search=' + search;
        return this.http.get<any>(url)
            .toPromise()
            .then(data => { return data.content; });
    }
    async getWarehousesByCompany(companyId: string | undefined) {
        var url = this.apiurl + '/warehouse/allByCompany/' + companyId;
        const warehouses = await lastValueFrom(this.http.get<any>(url));
        return warehouses.content;
    }

    async getByUserId(userId: string) {
        var url = this.apiurl + '/distributor/getByUser/' + encodeURIComponent(userId!);
        const distributor = await lastValueFrom(this.http.get<any>(url));
        return distributor;
    }

    async getUsers() {
        var url = this.apiurl + '/user/all'
        const distributor = await lastValueFrom(this.http.get<any>(url));
        return distributor.content;
    }

    async getCompanies() {
        var url = this.apiurl + '/company/all'
        const distributor = await lastValueFrom(this.http.get<any>(url));
        return distributor.content;
    }

    async getDistributors(pageNo: number,
        pageSize: number,
        sortField: any,
        sortDir: any,
        filter: string) {
        var url = this.apiurl + '/distributor/all?pageNo=' + pageNo + '&pageSize=' + pageSize + '&sortField=' + sortField + filter;
        const distributor = await lastValueFrom(this.http.get<any>(url));
        return distributor;
    }

    async getDistibutorsByCompany(companyId: any, pageNo: number,
        pageSize: number,
        sortField: any,
        sortDir: any,
        filter: string) {
        var url = this.apiurl + '/distributor/getByCompany/' + encodeURIComponent(companyId) + '?pageNo=' + pageNo + '&pageSize=' + pageSize + '&sortField=' + sortField + '&sortDir=' + sortDir + filter;
        const stores = await lastValueFrom(this.http.get<any>(url));
        return stores;
    }


    async getDistributorsByCompany(company: any) {
        var url = this.apiurl + '/distributor/getByCompany/' + encodeURIComponent(company.id);
        const distributor = await lastValueFrom(this.http.get<any>(url));
        return distributor.content;
    }

    async createDistributor(distributor: Distributor) {
        var url = this.apiurl + '/distributor/create'
        const _distributor = await lastValueFrom(this.http.post<any>(url, distributor));
        return _distributor;
    }

    async updateDistributor(distributor: Distributor) {
        var url = this.apiurl + '/distributor/update/' + encodeURIComponent(distributor.id!);
        const _distributor = await lastValueFrom(this.http.put<any>(url, distributor));
        return _distributor;
    }

    async deleteDistributor(distributor: Distributor) {
        var url = this.apiurl + '/distributor/delete/' + encodeURIComponent(distributor.id!);
        const _distributor = await lastValueFrom(this.http.delete<any>(url));
        return _distributor;
    }
}