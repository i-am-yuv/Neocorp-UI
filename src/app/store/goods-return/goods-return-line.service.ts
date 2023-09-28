import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { GoodsReturnLine } from './goods-return-line';

@Injectable({
  providedIn: 'root'
})
export class GoodsReturnLineService {
  async getDistributorCatalogByDistributor(id: any) {
    var url = this.apiurl + '/distributorCatalog/getbydistributor/' + encodeURIComponent(id);
    const product = await lastValueFrom(this.http.get<any>(url));
    return product.content;
  }

  async getPoLines(orderId: any) {
    var url = this.apiurl + '/purchase-order-line/getByPurchaseOrder/' + encodeURIComponent(orderId);
    const pols = await lastValueFrom(this.http.get<any>(url));
    return pols;
  }

  apiurl: string = environment.apiurl;


  constructor(private http: HttpClient) { }

  async getStoreCatalogByStore(storeId: string) {
    var url = this.apiurl + '/storeCatalog/getbystore/' + encodeURIComponent(storeId);
    const product = await lastValueFrom(this.http.get<any>(url));
    return product.content;
  }

  async getByGoodsReturn(id: string) {
    var url = this.apiurl + '/goods-return-line/getByGoodsReturn/' + encodeURIComponent(id!);
    const grs = await lastValueFrom(this.http.get<any>(url));
    return grs.content;
  }

  async deleteGoodsReturnLine(id: string) {
    var url = this.apiurl + '/goods-return-line/delete/' + encodeURIComponent(id);
    const stores = await lastValueFrom(this.http.delete<any>(url));
    return stores.content;
  }

  async createGoodsReturnLine(goodsReturnLine: GoodsReturnLine) {
    var url = this.apiurl + '/goods-return-line/create'
    const pol = await lastValueFrom(this.http.post<any>(url, goodsReturnLine));
    return pol;
  }

  async updateGoodsReturnLine(goodsReturnLine: GoodsReturnLine) {
    var url = this.apiurl + '/goods-return-line/update/' + encodeURIComponent(goodsReturnLine.id!);
    const pol = await lastValueFrom(this.http.put<any>(url, goodsReturnLine));
    return pol;
  }


}
