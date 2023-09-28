import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { StoreTable } from './store-table';

@Injectable({
    providedIn: 'root'
})
export class StoreTableService {

    apiurl: string = environment.apiurl;

    constructor(private http: HttpClient) { }

    async getStoreTables(storeId: string, pageNo: number, pageSize: number, sortField: any, sortDir: any, filter: string) {
        var url = this.apiurl + '/storeTable/getByStore/' + encodeURIComponent(storeId) + '?pageNo=' + pageNo + '&pageSize=' + pageSize + '&sortField=' + sortField + '&sortDir=' + sortDir + filter;
        const storetables = await lastValueFrom(this.http.get<any>(url));
        return storetables;
    }


    async createStoreTable(storetable: StoreTable) {
        var url = this.apiurl + '/storeTable/create'
        const state = await lastValueFrom(this.http.post<any>(url, storetable));
        return state;
    }

    async updateStoreTable(storetable: StoreTable) {
        var url = this.apiurl + '/storeTable/update/' + encodeURIComponent(storetable.id!);
        const state = await lastValueFrom(this.http.put<any>(url, storetable));
        return state;
    }

    async deleteStoreTable(storetable: StoreTable) {
        var url = this.apiurl + '/storeTable/delete/' + encodeURIComponent(storetable.id!);
        const state = await lastValueFrom(this.http.delete<any>(url));
        return state;
    }
}
