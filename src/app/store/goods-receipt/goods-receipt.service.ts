import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GoodsReceiptService {


  apiurl: string = environment.apiurl;


  constructor(private http: HttpClient) { }

  async getStore(userId: string) {
    var url = this.apiurl + '/store-user/getbyuser/' + encodeURIComponent(userId);
    const storeUser = await lastValueFrom(this.http.get<any>(url));
    return storeUser.store;
  }

  async getOrders(storeId: any, status: string) {
    var url = this.apiurl + '/purchase-order/getAllByStore/' + encodeURIComponent(storeId) + '/' + encodeURIComponent(status) + '?pageSize=1000';
    const pos = await lastValueFrom(this.http.get<any>(url));
    return pos.content;
  }

  async getGoodsReceipt(id: string) {
    var url = this.apiurl + '/goods-receipt/get/' + encodeURIComponent(id);
    const product = await lastValueFrom(this.http.get<any>(url));
    return product;
  }

  async getGoodsReceiptByStore(storeId: string,pageNo: number,
    pageSize: number,
    sortField : any,
    sortDir : any,
    filter: string) {
    var url = this.apiurl + '/goods-receipt/getByStore/' + encodeURIComponent(storeId) +'?pageNo='+ pageNo + '&pageSize=' + pageSize + '&sortField=' + sortField + '&sortDir=' + sortDir + filter ;
    const product = await lastValueFrom(this.http.get<any>(url));
    return product;
  }

  async createGoodsReceipt(goodsReceipt: any) {
    var url = this.apiurl + '/goods-receipt/create'
    const _goodsReceipt = await lastValueFrom(this.http.post<any>(url, goodsReceipt));
    return _goodsReceipt;
  }

  async updateGoodsReceipt(goodsReceipt: any) {
    var url = this.apiurl + '/goods-receipt/update/' + encodeURIComponent(goodsReceipt.id!);
    const _goodsReceipt = await lastValueFrom(this.http.put<any>(url, goodsReceipt));
    return _goodsReceipt;
  }

  async deleteGoodsReceipt(goodsReceipt: any) {
    var url = this.apiurl + '/goods-receipt/delete/' + encodeURIComponent(goodsReceipt.id!);
    const _goodsReceipt = await lastValueFrom(this.http.delete<any>(url));
    return _goodsReceipt;
  }


  async processGoodsReceipt(id: any) {
    var url = this.apiurl + '/goods-receipt/processGoodsReceipt/' + encodeURIComponent(id);
    const _goodsReceipt = await lastValueFrom(this.http.get<any>(url));
    return _goodsReceipt;
  }

  // async pagination(receiptId:any,params: any) {
  //   var url = this.apiurl + '/goods-receipt/getByStore?id='+ encodeURIComponent(receiptId);+'?pageSize=' + params.rows + '&pageNo=' + (params.first / 10);
  //   if (params.globalFilter) {
  //     url += '&filter=name~' + encodeURIComponent("'%" + params.globalFilter + "%'")  + encodeURIComponent(" or storeCatalog.product.name~'%" + params.globalFilter + "%'");
  // }
  //   const orders = await lastValueFrom(this.http.get<any>(url));
  //   return orders;
  // }
  async getPagination(
    storeId : string,
    pageNo: number,
    pageSize: number,
    sortField : any,
    sortDir : any,
    search: string,
    ) {
    var url = this.apiurl + '/goods-receipt/getByStore/' + encodeURIComponent(storeId) +'?pageNo='+ pageNo + '&pageSize=' + pageSize + '&sortField=' + sortField + '&sortDir=' + sortDir +'&search=' + search ;
    const stores = await lastValueFrom(this.http.get<any>(url));
    return stores;
  }
}
