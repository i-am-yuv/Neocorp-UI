import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Customer } from 'src/app/settings/customers/customer';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class StoreCustomersService {
  users: string[] = [];

  apiurl: string = environment.apiurl;

  constructor(private http: HttpClient, private authService: AuthService) {}

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
    return user.store;
  }

  async getStoreUserByUser(currentUserId: string) {
    var url =
      this.apiurl +
      '/store-user/getbyuser/' +
      encodeURIComponent(currentUserId);
    const user = await lastValueFrom(this.http.get<any>(url));
    return user;
  }
  async createStoreCustomer(storeCustomer: string) {}
  async updateStoreCustomer(storeCustomer: string) {}
  async getStoreUsersByStore(store: any) {
    var url =
      this.apiurl + '/store-user/getByStore/' + encodeURIComponent(store.id);
    const users = await lastValueFrom(this.http.get<any>(url));
    return users.content;
  }

  async getStore(userId: string) {
    var url =
      this.apiurl + '/store-user/getbyuser/' + encodeURIComponent(userId);
    const user = await lastValueFrom(this.http.get<any>(url));
    return user.store;
  }

  async getCustomersByCompanyID(
    companyID: string,
    pageNo: number,
    pageSize: number,
    sortField: any,
    sortDir: any,
    filter: string
  ) {
    // var url =
    //   this.apiurl + '/customer/allByCompany/' + encodeURIComponent(companyID) + '&pageNo=' + pageNo + '&pageSize=' + pageSize
    // const customer = await lastValueFrom(this.http.get<any>(url));
    // return customer;

    var url =
      this.apiurl +
      '/customer/allByCompany/' +
      encodeURIComponent(companyID) +
      '?pageNo=' +
      pageNo +
      '&pageSize=' +
      pageSize +
      '&sortField=' +
      sortField +
      '&sortDir=' +
      sortDir +
      filter;
    // if (params.globalFilter) {
    //     url += '&filter=companyName~' + encodeURIComponent("'%" + params.globalFilter + "%'") + encodeURIComponent(" or companyLocation~'%" + params.globalFilter + "%'");
    // }
    const res = await lastValueFrom(this.http.get<any>(url));
    return res;
  }

  async createCustomer(customer: Customer) {
    var url = this.apiurl + '/customer/create';

    const _customer = await lastValueFrom(this.http.post<any>(url, customer));
    return _customer;
  }

  async updateCustomer(customer: any) {
    var url =
      this.apiurl + '/customer/update/' + encodeURIComponent(customer.id!);
    const _customer = await lastValueFrom(this.http.put<any>(url, customer));
    return _customer;
  }

  async deleteCustomer(customer: any) {
    var url =
      this.apiurl + '/customer/delete/' + encodeURIComponent(customer.id!);
    const _customer = await lastValueFrom(this.http.delete<any>(url));
    return _customer;
  }

  async getCompanyById(companyId: any) {
    var url = this.apiurl + '/company/get/' + encodeURIComponent(companyId);
    const _company = await lastValueFrom(this.http.get<any>(url));
    return _company;
  }

  // async pagination(params: any) {
  //   var url = this.apiurl + '/store-user/all??pageSize=' + params.rows + '&pageNo=' + (params.first / 10);
  //   if (params.globalFilter) {
  //     url += '&filter=firstName~' + encodeURIComponent("'%" + params.globalFilter + "%'")  + encodeURIComponent(" or lastName~'%" + params.globalFilter + "%'");
  // }
  //   const orders = await lastValueFrom(this.http.get<any>(url));
  //   return orders;
  // }
  async getPagination(
    pageNo: number,
    pageSize: number,
    sortField: any,
    sortDir: any,
    search: string
  ) {
    var url =
      this.apiurl +
      '/customer/all?pageNo=' +
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
