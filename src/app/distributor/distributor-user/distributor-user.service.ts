import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DistributorUserService {
  apiurl: string = environment.apiurl;

  constructor(private http: HttpClient, private authService: AuthService) {}

  async getDistributor() {
    var currentUserId = this.authService.getUserId();
    var url =
      this.apiurl +
      '/distributor-user/getByUser/' +
      encodeURIComponent(currentUserId);
    const user = await lastValueFrom(this.http.get<any>(url));
    return user.distributor;
  }

  async getCurrentDistributor() {
    var currentUserId = this.authService.getUserId();
    var url =
      this.apiurl +
      '/distributor-user/getByUser/' +
      encodeURIComponent(currentUserId);
    const user = await lastValueFrom(this.http.get<any>(url));
    return user;
  }

  async getDistributorUser(userId: string) {
    var url =
      this.apiurl + '/distributor-user/getByUser/' + encodeURIComponent(userId);
    const distributor = await lastValueFrom(this.http.get<any>(url));
    return distributor;
  }

  async getUsers(
    distributor: any,
    pageNo: number,
    pageSize: number,
    sortField: any,
    sortDir: any,
    filter: string
  ) {
    var url =
      this.apiurl +
      '/distributor-user/getByDistributor/' +
      encodeURIComponent(distributor.id!) +
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

  async getRolesByType(roleType: string) {
    var url =
      this.apiurl + '/roles/getAllByType/' + encodeURIComponent(roleType);
    const user = await lastValueFrom(this.http.get<any>(url));
    return user.content;
  }

  async createUser(user: any) {
    var url = this.apiurl + '/distributor-user/create';
    const _user = await lastValueFrom(this.http.post<any>(url, user));
    return _user;
  }

  async updateUser(user: any) {
    var url =
      this.apiurl + '/distributor-user/update/' + encodeURIComponent(user.id!);
    const _user = await lastValueFrom(this.http.put<any>(url, user));
    return _user;
  }

  async deleteUser(user: any) {
    var url =
      this.apiurl + '/distributor-user/delete/' + encodeURIComponent(user.id!);
    const _user = await lastValueFrom(this.http.delete<any>(url));
    return _user;
  }

  async getWalkThroughDetails(id: any) {
    var url =
      this.apiurl +
      '/dashboard/distributor-walkthrough/' +
      encodeURIComponent(id);
    const data = await lastValueFrom(this.http.get<any>(url));
    return data;
  }

  async searchOrder(distributorId: any, query: any, status: any) {
    var url =
      this.apiurl +
      '/distributor/all?filter=id~' +
      encodeURIComponent("'%" + distributorId + "%'") +
      encodeURIComponent(
        " and ( docstatus~'%" + status + "%' and documentno~'%" + query + "%')"
      );
    const orders = await lastValueFrom(this.http.get<any>(url));
    return orders;
  }
  async searchPurchaseOrder(distributorId: any, query: any, status: any) {
    var url =
      this.apiurl +
      '/purchase-order/all?filter=id~' +
      encodeURIComponent("'%" + distributorId + "%'") +
      encodeURIComponent(
        " and ( status~'%" + status + "%' and documentnumber~'%" + query + "%')"
      );
    const orders = await lastValueFrom(this.http.get<any>(url));
    return orders;
  }
  async getPagination(
    pageNo: number,
    pageSize: number,
    sortField: any,
    sortDir: any,
    search: string
  ) {
    var url =
      this.apiurl +
      '/distributor/all?pageNo=' +
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
