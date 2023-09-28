import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { Distributor } from 'src/app/masters/distributors/distributor';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SalesRequestService {

  apiurl: string = environment.apiurl;

  constructor(private http: HttpClient) { }

  async getStores(companyId: string) {
    var url = this.apiurl + '/store/allByCompany/' + encodeURIComponent(companyId);
    const stores = await lastValueFrom(this.http.get<any>(url));
    return stores.content;
  }

  async getStore(userId: string) {
    var url = this.apiurl + '/store-user/getbyuser/' + encodeURIComponent(userId);
    const storeUser = await lastValueFrom(this.http.get<any>(url));
    return storeUser.store;
  }

  async getDistributorsByStore(storeId: string) {
    var url = this.apiurl + '/distributor/getByStore/' + encodeURIComponent(storeId);
    const distributors = await lastValueFrom(this.http.get<any>(url));
    return distributors;
  }

  async getByStore(storeId: any, status: string) {
    var url = this.apiurl + '/purchase-order/getAllByStore/' + encodeURIComponent(storeId) + '/' + encodeURIComponent(status);
    const pos = await lastValueFrom(this.http.get<any>(url));
    return pos;
  }

  async createPurchaseOrder(poFormVal: any) {
    var url = this.apiurl + '/purchase-order/create';
    const po = await lastValueFrom(this.http.post<any>(url, poFormVal));
    return po;
  }

  async getOrder(id: string) {
    var url = this.apiurl + '/purchase-order/get/' + encodeURIComponent(id);
    const po = await lastValueFrom(this.http.get<any>(url));
    return po;
  }

  async getDistributorsProducts(selectedDistributor: Distributor) {
    var url = this.apiurl + '/distributorCatalog/getbydistributor/' + encodeURIComponent(selectedDistributor.id!) + '?pageSize=1000';
    const distributorCatalogs = await lastValueFrom(this.http.get<any>(url));
    return distributorCatalogs.content;
  }
  async searchOrder(distributorId: any, query: any, status: String) {
    var url = this.apiurl + '/purchase-order/all?filter=id~' + encodeURIComponent("'%" + distributorId + "%'") + encodeURIComponent(" and  status~'%" + status + "%' and documentnumber~'%" + query + "%' ");
    const orders = await lastValueFrom(this.http.get<any>(url));
    return orders;
  }

}
