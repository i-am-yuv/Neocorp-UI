import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { StoreUser } from './store-user';

@Injectable({
  providedIn: 'root'
})
export class StoreUsersService {

  storeUsers: string[] = [];

  apiurl: string = environment.apiurl;

  constructor(private http: HttpClient) { }

  async getStoresByCompany(companyId: string | undefined) {
    var url = this.apiurl + '/store/allByCompany/' + companyId;
    const stores = await lastValueFrom(this.http.get<any>(url));
    return stores.content;
  }

  async getUsers() {
    var url = this.apiurl + '/user/all?pageSize=1000'
    const storeUser = await lastValueFrom(this.http.get<any>(url));
    return storeUser.content;
  }

  async getStoresPagination(
    pageNo: number,
    pageSize: number,
    sortField : any,
    sortDir : any
    ) {
    var url = this.apiurl + '/user/all' +'?pageNo='+ pageNo + '&pageSize=' + pageSize + '&sortField=' + sortField + '&sortDir=' + sortDir;
    const stores = await lastValueFrom(this.http.get<any>(url));
    return stores;
  }


  async getCompanies() {
    var url = this.apiurl + '/company/all'
    const storeUser = await lastValueFrom(this.http.get<any>(url));
    return storeUser.content;
  }

  async getStoreUsers(pageNo: number,
    pageSize: number,
    sortField : any,
    sortDir : any,
    search: string
   ) {
    var url = this.apiurl + '/store-user/all?pageNo='+ pageNo + '&pageSize=' + pageSize + '&sortField=' + sortField + '&sortDir=' + sortDir +'&search=' + search ;
    const storeUser = await lastValueFrom(this.http.get<any>(url));
    return storeUser;
  }
 
  async createStoreUser(storeUser: StoreUser) {
    var url = this.apiurl + '/store-user/create'
    const _storeUser = await lastValueFrom(this.http.post<any>(url, storeUser));
    return _storeUser;
  }

  async updateStoreUser(storeUser: StoreUser) {
    var url = this.apiurl + '/store-user/update/' + encodeURIComponent(storeUser.id!);
    const _storeUser = await lastValueFrom(this.http.put<any>(url, storeUser));
    return _storeUser;
  }

  async deleteStoreUser(storeUser: StoreUser) {
    var url = this.apiurl + '/store-user/delete/' + encodeURIComponent(storeUser.id!);
    const _storeUser = await lastValueFrom(this.http.delete<any>(url));
    return _storeUser;
  }
}
