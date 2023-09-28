import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

import { Country } from './country';

@Injectable({ providedIn: 'root' })
export class CountryService {

    apiurl: string = environment.apiurl;

    constructor(private http: HttpClient) { }

    getCountries(pageNo: number,
        pageSize: number,
        sortField : any,
        sortDir : any,
        filter: string) {
        var url = this.apiurl + '/country/all?pageNo='+ pageNo + '&pageSize=' + pageSize + '&sortField=' + sortField + '&sortDir=' + sortDir + filter ;
        return this.http.get<any>(url)
            .toPromise()
            .then(data => { return data; });
    }

    createCountry(country: Country) {
        var url = this.apiurl + '/country/create'
        return this.http.post<any>(url, country)
            .toPromise()
            // .then(res => <Country>res.data)
            .then(data => { return data; });
    }

    updateCountry(country: Country) {
        var url = this.apiurl + '/country/update/' + encodeURIComponent(country.id!);
        return this.http.put<any>(url, country)
            .toPromise()
            // .then(res => <Country>res.data)
            .then(data => { return data; });
    }

    deleteCountry(country: Country) {
        var url = this.apiurl + '/country/delete/' + encodeURIComponent(country.id!);
        return this.http.delete<any>(url)
            .toPromise()
            // .then(res => <Country>res.data)
            .then(data => { return data; });
    }

}