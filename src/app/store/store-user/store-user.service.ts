import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class StoreUserService {
  users: string[] = [];

  apiurl: string = environment.apiurl;

  constructor(private http: HttpClient, private authService: AuthService) {}

  async getAllDetails(storeId: any) {
    var url =
      this.apiurl +
      '/dashboard/store-walkthrough/' +
      encodeURIComponent(storeId);
    const data = await lastValueFrom(this.http.get<any>(url));
    return data;
  }

  async getCurrentStoreUser() {
    var currentUserId = this.authService.getUserId();
    var url =
      this.apiurl +
      '/store-user/getbyuser/' +
      encodeURIComponent(currentUserId);
    const user = await lastValueFrom(this.http.get<any>(url));
    return user;
  }

  async getCurrentStore() {
    var currentUserId = this.authService.getUserId();
    var url =
      this.apiurl +
      '/store-user/getbyuser/' +
      encodeURIComponent(currentUserId);
    const user = await lastValueFrom(this.http.get<any>(url));

    return user;
  }

  async getStoreUserByUser(currentUserId: string) {
    var url =
      this.apiurl +
      '/store-user/getbyuser/' +
      encodeURIComponent(currentUserId);
    const user = await lastValueFrom(this.http.get<any>(url));
    return user;
  }

  async getStoreUsersByStore(
    storeId: any,
    pageNo: number,
    pageSize: number,
    sortField: any,
    sortDir: any,
    filter: string
  ) {
    var url =
      this.apiurl +
      '/store-user/getByStore/' +
      encodeURIComponent(storeId) +
      '?pageNo=' +
      pageNo +
      '&pageSize=' +
      pageSize +
      '&sortField=' +
      sortField +
      '&sortDir=' +
      sortDir +
      filter;
    const users = await lastValueFrom(this.http.get<any>(url));
    return users;
  }
  // async getStoreUsersByStorePagination(currentUserId: string,pageNo : any, pageSize : any) {
  //   var url =
  //     this.apiurl + '/store-user/getbyuser/' + encodeURIComponent(currentUserId) + '&pageNo=' + pageNo + '&pageSize=' + pageSize;
  //   const users = await lastValueFrom(this.http.get<any>(url));
  //   return users.content;
  // }

  async getStore(userId: string) {
    var url =
      this.apiurl + '/store-user/getbyuser/' + encodeURIComponent(userId);
    const user = await lastValueFrom(this.http.get<any>(url));
    return user.store;
  }

  async getRolesByType(roleType: string) {
    var url =
      this.apiurl + '/roles/getAllByType/' + encodeURIComponent(roleType);
    const user = await lastValueFrom(this.http.get<any>(url));
    return user.content;
  }

  async getCompanies() {
    var url = this.apiurl + '/company/all';
    const user = await lastValueFrom(this.http.get<any>(url));
    return user.content;
  }

  async getUsers(company: any) {
    var url =
      this.apiurl +
      '/store-user/allByCompany/' +
      encodeURIComponent(company.id);
    const users = await lastValueFrom(this.http.get<any>(url));
    return users.content;
  }

  async createStoreUser(user: any) {
    var url = this.apiurl + '/store-user/create';
    const _user = await lastValueFrom(this.http.post<any>(url, user));
    return _user;
  }

  async updateStoreUser(user: any) {
    var url =
      this.apiurl + '/store-user/update/' + encodeURIComponent(user.id!);
    const _user = await lastValueFrom(this.http.put<any>(url, user));
    return _user;
  }

  async deleteStoreUser(user: any) {
    var url =
      this.apiurl + '/store-user/delete/' + encodeURIComponent(user.id!);
    const _user = await lastValueFrom(this.http.delete<any>(url));
    return _user;
  }

  async searchOrder(storeId: string, query: any, status: any) {
    var url =
      this.apiurl +
      '/order/all?filter=store.id~' +
      encodeURIComponent("'%" + storeId + "%'") +
      encodeURIComponent(
        " and ( docstatus~'%" + status + "%' and documentno~'%" + query + "%')"
      );
    const orders = await lastValueFrom(this.http.get<any>(url));
    return orders;
  }

  // async pagination(params: any) {
  //   var url = this.apiurl + '/store-user/all??pageSize=' + params.rows + '&pageNo=' + (params.first / 10);
  //   if (params.globalFilter) {
  //     url += '&filter=firstName~' + encodeURIComponent("'%" + params.globalFilter + "%'")  + encodeURIComponent(" or lastName~'%" + params.globalFilter + "%'");
  // }
  //   const orders = await lastValueFrom(this.http.get<any>(url));
  //   return orders;
  // }

  async getStoresPagination(
    pageNo: number,
    pageSize: number,
    sortField: any,
    sortDir: any,
    search: string
  ) {
    var url =
      this.apiurl +
      '/store-user/all?pageNo=' +
      pageNo +
      '&pageSize=' +
      pageSize +
      '&sortField=' +
      sortField +
      '&sortDir=' +
      sortDir +
      '&search=' +
      search;
    const stores = await lastValueFrom(this.http.get<any>(url));
    return stores;
  }
}
