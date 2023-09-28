import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { Distributor } from 'src/app/masters/distributors/distributor';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PurchaseOrderService {
  apiurl: string = environment.apiurl;
  typeOfRequest: any;

  constructor(private http: HttpClient) {}

  async getStores(companyId: string) {
    var url =
      this.apiurl + '/store/allByCompany/' + encodeURIComponent(companyId);
    const stores = await lastValueFrom(this.http.get<any>(url));
    return stores.content;
  }

  async getStore(userId: string) {
    var url =
      this.apiurl + '/store-user/getbyuser/' + encodeURIComponent(userId);
    const storeUser = await lastValueFrom(this.http.get<any>(url));
    return storeUser.store;
  }

  async getDistributorsByStore(storeId: string) {
    var url =
      this.apiurl + '/distributor/getByStore/' + encodeURIComponent(storeId);
    const distributors = await lastValueFrom(this.http.get<any>(url));
    return distributors;
  }

  async getByDistributor(distributorId: any, status: string) {
    var url =
      this.apiurl +
      '/purchase-order/getAllByDistributor/' +
      encodeURIComponent(distributorId) +
      '/' +
      encodeURIComponent(status);
    const pos = await lastValueFrom(this.http.get<any>(url));
    return pos;
  }

  async getByStore(storeId: any, status: string) {
    var url =
      this.apiurl +
      '/purchase-order/getAllByStore/' +
      encodeURIComponent(storeId) +
      '/' +
      encodeURIComponent(status);
    const pos = await lastValueFrom(this.http.get<any>(url));
    return pos;
  }

  async createPurchaseOrder(poFormVal: any) {
    var url = this.apiurl + '/purchase-order/create';
    const po = await lastValueFrom(this.http.post<any>(url, poFormVal));
    return po;
  }

  async updatePurchaseOrder(poFormVal: any) {
    var url = this.apiurl + '/purchase-order/update/' + poFormVal.id;
    const po = await lastValueFrom(this.http.put<any>(url, poFormVal));
    return po;
  }

  async getOrder(id: string) {
    var url = this.apiurl + '/purchase-order/get/' + encodeURIComponent(id);
    const po = await lastValueFrom(this.http.get<any>(url));
    return po;
  }

  async getDistributorsProducts(selectedDistributor: Distributor) {
    var url =
      this.apiurl +
      '/distributorCatalog/getbydistributor/' +
      encodeURIComponent(selectedDistributor.id!) +
      '?pageSize=1000';
    const distributorCatalogs = await lastValueFrom(this.http.get<any>(url));
    return distributorCatalogs.content;
  }

  async processOrder(status: string, id: any) {
    var url =
      this.apiurl + '/purchase-order/' + status + '/' + encodeURIComponent(id);
    const po = await lastValueFrom(this.http.get<any>(url));
    return po;
  }

  async createGoodsReceipt(id: string) {
    var url =
      this.apiurl +
      '/purchase-order/createGoodsReceipt/' +
      encodeURIComponent(id);
    const gr = await lastValueFrom(this.http.get<any>(url));
    return gr;
  }

  async createGoodsShipment(id: string) {
    var url =
      this.apiurl +
      '/purchase-order/createGoodsShipment/' +
      encodeURIComponent(id);
    const gs = await lastValueFrom(this.http.get<any>(url));
    return gs;
  }

  async getPaymentUrl(
    tranid: any,
    distributorId: any,
    storeName: string,
    amount: number | undefined
  ) {
    var url =
      this.apiurl +
      '/setting/getUpiUrl?tn=Order Payment&amount=' +
      amount +
      '&pn=' +
      storeName +
      '&distributorId=' +
      distributorId +
      '&tranid=' +
      tranid;
    const res = await lastValueFrom(
      this.http.get(url, { responseType: 'text' })
    );
    return res;
  }

  // async searchOrder(storeId: string, query: any, status: any) {
  //   var url = this.apiurl + '/purchase-order/all?filter=store.id~' + encodeURIComponent("'%" + storeId + "%'") + encodeURIComponent(" and ( docstatus~'%" + status + "%' and documentno~'%" + query + "%')");
  //   const orders = await lastValueFrom(this.http.get<any>(url));
  //   return orders;
  // }

  async emailDetails(typeOfRequest: any, storeId : any, email : any){
    var url = this.apiurl + '/pdf/sendEmail/' +typeOfRequest +'&storeId='+ encodeURIComponent(storeId) + '&emailAddress=' + email ;
    const emailDtls = await lastValueFrom(this.http.get<any>(url));
    return emailDtls;
}
getTypeOfEmail(typeOfEmail: any) {
  if (typeOfEmail == 'activeStatus') this.typeOfRequest = 'status';
}

async searchOrder(storeId: any, query: any, status: any) {
  var url = this.apiurl + '/purchase-order/all?filter=store.id~' + encodeURIComponent("'%" + storeId + "%'") + encodeURIComponent(" and  status~'%" + status + "%' and documentnumber~'%" + query + "%'");
  const orders = await lastValueFrom(this.http.get<any>(url));
  return orders;
}
}
