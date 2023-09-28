import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Order } from '../sales-order/order';
import { PurchaseOrderLine } from './purchase-order-line';

@Injectable({
  providedIn: 'root',
})
export class PurchaseOrderLineService {
  apiurl: string = environment.apiurl;

  constructor(private http: HttpClient) {}

  async getByPurchaseOrder(order: any) {
    // var orderId : any= order.id;

    var url =
      this.apiurl +
      '/purchase-order-line/getByPurchaseOrder/' +
      encodeURIComponent(order.id);
    const pols = await lastValueFrom(this.http.get<any>(url));
    return pols;
  }


  async getByProducts(order: any) {
    // var orderId : any= order.id;

    var url =
      this.apiurl +
      '/purchase-order-line/getByPurchaseOrder/' +
      encodeURIComponent(order.id);
    const pols = await lastValueFrom(this.http.get<any>(url));
    return pols;
  }


  async deletePurchaseOrderLine(id: string) {
    var url =
      this.apiurl + '/purchase-order-line/delete/' + encodeURIComponent(id);
    const stores = await lastValueFrom(this.http.delete<any>(url));
    return stores.content;
  }

  async createPurchaseOrderLine(purchaseOrderLine: PurchaseOrderLine) {
    alert(JSON.stringify(purchaseOrderLine));
    var url = this.apiurl + '/purchase-order-line/create';
    const pol = await lastValueFrom(
      this.http.post<any>(url, purchaseOrderLine)
    );
    return pol;
  }

  async updatePurchaseOrderLine(purchaseOrderLine: PurchaseOrderLine) {
    var url =
      this.apiurl +
      '/purchase-order-line/update/' +
      encodeURIComponent(purchaseOrderLine.id!);
    const pol = await lastValueFrom(this.http.put<any>(url, purchaseOrderLine));
    return pol;
  }
}
