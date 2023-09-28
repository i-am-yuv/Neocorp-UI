import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GoodsReturnService {

  apiurl: string = environment.apiurl;


  constructor(private http: HttpClient) { }

  async getStore(userId: string) {
    var url = this.apiurl + '/store-user/getbyuser/' + encodeURIComponent(userId);
    const storeUser = await lastValueFrom(this.http.get<any>(url));
    return storeUser.store;
  }

  async getDistributor(userId: string) {
    var url = this.apiurl + '/distributor-user/getByUser/' + encodeURIComponent(userId);
    const storeUser = await lastValueFrom(this.http.get<any>(url));
    return storeUser.distributor;
  }

  async getOrders(storeId: any, status: string) {
    var url = this.apiurl + '/purchase-order/getAllByStore/' + encodeURIComponent(storeId) + '/' + encodeURIComponent(status) + '?pageSize=1000';
    const pos = await lastValueFrom(this.http.get<any>(url));
    return pos.content;
  }

  async getGoodsReturn(id: any) {
    var url = this.apiurl + '/goods-return/get/' + encodeURIComponent(id);
    const product = await lastValueFrom(this.http.get<any>(url));
    return product;
  }

  async getGoodsReturnByStore(storeId: string,  pageNo: number,
    pageSize: number,
    sortField : any,
    sortDir : any,
    filter: string) {
    var url = this.apiurl + '/goods-return/getByStore/' + encodeURIComponent(storeId) + '?pageNo='+ pageNo + '&pageSize=' + pageSize + '&sortField=' + sortField + '&sortDir=' + sortDir + filter ;
    const product = await lastValueFrom(this.http.get<any>(url));
    return product;
  }

  async getGoodsReturnByDistributor(distributorId: string,pageNo: number,
		pageSize: number,
		sortField : any,
		sortDir : any,
		filter: string) {
    var url = this.apiurl + '/goods-return/getByDistributor/' + encodeURIComponent(distributorId) + '?pageNo='+ pageNo + '&pageSize=' + pageSize + '&sortField=' + sortField + '&sortDir=' + sortDir + filter ;
    const product = await lastValueFrom(this.http.get<any>(url));
    return product;
  }

  async createGoodsReturn(goodsReturn: any) {
    var url = this.apiurl + '/goods-return/create'
    const _goodsReturn = await lastValueFrom(this.http.post<any>(url, goodsReturn));
    return _goodsReturn;
  }

  async updateGoodsReturn(goodsReturn: any) {
    var url = this.apiurl + '/goods-return/update/' + encodeURIComponent(goodsReturn.id!);
    const _goodsReturn = await lastValueFrom(this.http.put<any>(url, goodsReturn));
    return _goodsReturn;
  }

  async deleteGoodsReturn(goodsReturn: any) {
    var url = this.apiurl + '/goods-return/delete/' + encodeURIComponent(goodsReturn.id!);
    const _goodsReturn = await lastValueFrom(this.http.delete<any>(url));
    return _goodsReturn;
  }


  async processStoreGoodsReturn(id: any) {
    var url = this.apiurl + '/goods-return/processStoreGoodsReturn/' + encodeURIComponent(id);
    const _goodsReturn = await lastValueFrom(this.http.get<any>(url));
    return _goodsReturn;
  }

  async processDistributorGoodsReturn(id: any) {
    var url = this.apiurl + '/goods-return/processDistributorGoodsReturn/' + encodeURIComponent(id);
    const _goodsReturn = await lastValueFrom(this.http.get<any>(url));
    return _goodsReturn;
  }

  // async pagination(params: any) {
  //   var url = this.apiurl + '/goods-return/all??pageSize=' + params.rows + '&pageNo=' + (params.first / 10);
  //   if (params.globalFilter) {
  //     url += '&filter=documentno~' + encodeURIComponent("'%" + params.globalFilter + "%'")  + encodeURIComponent(" or purchaseOrder.status~'%" + params.globalFilter + "%'");
  // }
  //   const orders = await lastValueFrom(this.http.get<any>(url));
  //   return orders;
  // }

  async getPagination(
    pageNo: number,
    pageSize: number,
    sortField : any,
    sortDir : any,
    search: string,
    ) {
    var url = this.apiurl + '/goods-return/all?pageNo='+ pageNo + '&pageSize=' + pageSize + '&sortField=' + sortField + '&sortDir=' + sortDir +'&search=' + search ;
    const stores = await lastValueFrom(this.http.get<any>(url));
    return stores;
  }
}
