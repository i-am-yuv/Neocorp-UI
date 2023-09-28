import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SalesInvoiceService {

  apiurl: string = environment.apiurl;


  constructor(private http: HttpClient) { }

  async getByDistributor(distributorId: any, status: string) {
    var url = this.apiurl + '/purchase-invoice/getAllByDistributor/' + encodeURIComponent(distributorId) + '/' + encodeURIComponent(status);
    const sis = await lastValueFrom(this.http.get<any>(url));
    return sis;
  }



  async getWarehouses(distributorId: any) {
    var url = this.apiurl + '/warehouse/allByDistributor/' + encodeURIComponent(distributorId) + '?pageSize=1000';
    const pos = await lastValueFrom(this.http.get<any>(url));
    return pos.content;
  }


  async getSalesInvoice(id: string) {
    var url = this.apiurl + '/purchase-invoice/get/' + encodeURIComponent(id);
    const product = await lastValueFrom(this.http.get<any>(url));
    return product;
  }

  async getSalesInvoiceByDistributor(distributorId: string) {
    var url = this.apiurl + '/purchase-invoice/getByDistributor/' + encodeURIComponent(distributorId);
    const product = await lastValueFrom(this.http.get<any>(url));
    return product.content;
  }

  async createSalesInvoice(goodsShipment: any) {
    var url = this.apiurl + '/purchase-invoice/create'
    const _goodsShipment = await lastValueFrom(this.http.post<any>(url, goodsShipment));
    return _goodsShipment;
  }

  async updateSalesInvoice(goodsShipment: any) {
    var url = this.apiurl + '/purchase-invoice/update/' + encodeURIComponent(goodsShipment.id!);
    const _goodsShipment = await lastValueFrom(this.http.put<any>(url, goodsShipment));
    return _goodsShipment;
  }

  async deleteSalesInvoice(goodsShipment: any) {
    var url = this.apiurl + '/purchase-invoice/delete/' + encodeURIComponent(goodsShipment.id!);
    const _goodsShipment = await lastValueFrom(this.http.delete<any>(url));
    return _goodsShipment;
  }
}
