import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

import { Company } from './company';

@Injectable({ providedIn: 'root' })
export class CompanyService {

    apiurl: string = environment.apiurl;

    constructor(private http: HttpClient) { }

    // async getCompanies(params: any) {
    //     var url = this.apiurl + '/company/all?pageSize=' + params.rows + '&pageNo=' + (params.first / 10);
    //     if (params.globalFilter) {
    //         url += '&filter=companyName~' + encodeURIComponent("'%" + params.globalFilter + "%'") + encodeURIComponent(" or companyLocation~'%" + params.globalFilter + "%'");
    //     }
    //     const res = await lastValueFrom(this.http.get<any>(url));
    //     return res;
    // }
    async getCompanies(pageNo: number, pageSize: number,
        sortField : any,
        sortDir : any,
        filter: string) {
        var url = this.apiurl + '/company/all?pageNo='+ pageNo + '&pageSize=' + pageSize + '&sortField=' + sortField + '&sortDir=' + sortDir + filter ;
        const res = await lastValueFrom(this.http.get<any>(url));
        return res;
    }
 
    createCompany(company: Company) {
        var url = this.apiurl + '/company/create'
        return this.http.post<any>(url, company)
            .toPromise()
            // .then(res => <Company>res.data)
            .then(data => { return data; });
    }

    updateCompany(company: Company) {
        var url = this.apiurl + '/company/update/' + encodeURIComponent(company.id!);
        return this.http.put<any>(url, company)
            .toPromise()
            // .then(res => <Company>res.data)
            .then(data => { return data; });
    }

    deleteCompany(company: Company) {
        var url = this.apiurl + '/company/delete/' + encodeURIComponent(company.id!);
        return this.http.delete<any>(url)
            .toPromise()
            // .then(res => <Company>res.data)
            .then(data => { return data; });
    }

}