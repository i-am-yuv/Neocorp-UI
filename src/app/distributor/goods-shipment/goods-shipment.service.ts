import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GoodsShipmentService {
  apiurl: string = environment.apiurl;
  typeOfReport: any;
  downloadExcel(typeofReport: any, storeId: any, fromDate: any, toDate: any) {
    this.getTypeOfReport(typeofReport);
    // var url =
    //   this.apiurl +
    //   '/invoice/download/'+typeofReport+'?storeId=' + encodeURIComponent(storeId) + '&fromDate=' + fromDate +  '&toDate=' +toDate ;
    // return this.http.get(url, {
    //   responseType: 'blob',
    // });
    var url =
      this.apiurl +
      '/invoice/download/' +
      typeofReport +
      '?fromDate=' +
      fromDate +
      '&toDate=' +
      toDate +
      '&storeId=' +
      encodeURIComponent(storeId);
    return this.http.get(url, {
      responseType: 'blob',
    });
  }

  constructor(private http: HttpClient) {}

  async getDistributor(userId: string) {
    var url =
      this.apiurl + '/distributor-user/getByUser/' + encodeURIComponent(userId);
    const distributorUser = await lastValueFrom(this.http.get<any>(url));
    return distributorUser.distributor;
  }

  async getOrders(distributorId: any, status: string) {
    var url =
      this.apiurl +
      '/purchase-order/getAllByDistributor/' +
      encodeURIComponent(distributorId) +
      '/' +
      encodeURIComponent(status) +
      '?pageSize=1000';
    const pos = await lastValueFrom(this.http.get<any>(url));
    return pos.content;
  }

  async getWarehouses(distributorId: any) {
    var url =
      this.apiurl +
      '/warehouse/allByDistributor/' +
      encodeURIComponent(distributorId) +
      '?pageSize=1000';
    const pos = await lastValueFrom(this.http.get<any>(url));
    return pos.content;
  }

  async getGoodsShipment(id: string) {
    var url = this.apiurl + '/goods-shipment/get/' + encodeURIComponent(id);
    const product = await lastValueFrom(this.http.get<any>(url));
    return product;
  }

  async getGoodsShipmentByDistributor(
    distributorId: string,
    pageNo: number,
    pageSize: number,
    sortField: any,
    sortDir: any,
    filter: string
  ) {
    var url =
      this.apiurl +
      '/goods-shipment/getByDistributor/' +
      encodeURIComponent(distributorId) +
      '?pageNo=' +
      pageNo +
      '&pageSize=' +
      pageSize +
      '&sortField=' +
      sortField +
      '&sortDir=' +
      sortDir +
      filter;
    const product = await lastValueFrom(this.http.get<any>(url));
    return product;
  }

  async createGoodsShipment(goodsShipment: any) {
    var url = this.apiurl + '/goods-shipment/create';
    const _goodsShipment = await lastValueFrom(
      this.http.post<any>(url, goodsShipment)
    );
    return _goodsShipment;
  }

  async updateGoodsShipment(goodsShipment: any) {
    var url =
      this.apiurl +
      '/goods-shipment/update/' +
      encodeURIComponent(goodsShipment.id!);
    const _goodsShipment = await lastValueFrom(
      this.http.put<any>(url, goodsShipment)
    );
    return _goodsShipment;
  }

  async deleteGoodsShipment(goodsShipment: any) {
    var url =
      this.apiurl +
      '/goods-shipment/delete/' +
      encodeURIComponent(goodsShipment.id!);
    const _goodsShipment = await lastValueFrom(this.http.delete<any>(url));
    return _goodsShipment;
  }

  async processGoodsShipment(id: any) {
    var url =
      this.apiurl +
      '/goods-shipment/processGoodsShipment/' +
      encodeURIComponent(id);
    const _goodsShipment = await lastValueFrom(this.http.get<any>(url));
    return _goodsShipment;
  }

  async createInvoice(id: any) {
    var url =
      this.apiurl + '/goods-shipment/createInvoice/' + encodeURIComponent(id);
    const _goodsShipment = await lastValueFrom(this.http.get<any>(url));
    return _goodsShipment;
  }

  getPdf(
    token: any,
    typeOfReport: any,
    fromDate: String,
    toDate: String,
    storeId: any
  ) {
    var url =
      this.apiurl +
      '/pdf/Downloadpdf/?token=' +
      token +
      '&fromDate=' +
      fromDate +
      '&toDate=' +
      toDate +
      '&typeOfRequest=' +
      typeOfReport +
      '&storeId=' +
      encodeURIComponent(storeId);
    return this.http.get(url, { responseType: 'blob' });
  }
  getTypeOfReport(typeReport: any) {
    if (typeReport == 'DC') this.typeOfReport = 'dc';
  }
}
