import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { GoodsShipmentLine } from './goods-shipment-line';

@Injectable({
  providedIn: 'root'
})
export class GoodsShipmentLineService {

  async getPoLines(orderId: any) {
    var url = this.apiurl + '/purchase-order-line/getByPurchaseOrder/' + encodeURIComponent(orderId);
    const pols = await lastValueFrom(this.http.get<any>(url));
    return pols;
  }

  apiurl: string = environment.apiurl;


  constructor(private http: HttpClient) { }

  async getDistributorCatalogByDistributor(distributorId: string) {
    var url = this.apiurl + '/distributorCatalog/getbydistributor/' + encodeURIComponent(distributorId);
    const product = await lastValueFrom(this.http.get<any>(url));
    return product.content;
  }

  async getByGoodsShipment(id: string) {
    var url = this.apiurl + '/goods-shipment-lines/getByGoodsShipment/' + encodeURIComponent(id!);
    const grs = await lastValueFrom(this.http.get<any>(url));
    return grs.content;
  }

  async deleteGoodsShipmentLine(id: string) {
    var url = this.apiurl + '/goods-shipment-lines/delete/' + encodeURIComponent(id);
    const stores = await lastValueFrom(this.http.delete<any>(url));
    return stores.content;
  }

  async createGoodsShipmentLine(goodsShipmentLine: GoodsShipmentLine) {
    var url = this.apiurl + '/goods-shipment-lines/create'
    const pol = await lastValueFrom(this.http.post<any>(url, goodsShipmentLine));
    return pol;
  }

  async updateGoodsShipmentLine(goodsShipmentLine: GoodsShipmentLine) {
    var url = this.apiurl + '/goods-shipment-lines/update/' + encodeURIComponent(goodsShipmentLine.id!);
    const pol = await lastValueFrom(this.http.put<any>(url, goodsShipmentLine));
    return pol;
  }


}
