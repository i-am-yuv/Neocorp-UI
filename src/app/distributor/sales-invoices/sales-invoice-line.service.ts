import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SalesInvoiceLine } from './sales-invoice-line';

@Injectable({
  providedIn: 'root'
})
export class SalesInvoiceLineService {

  apiurl: string = environment.apiurl;


  constructor(private http: HttpClient) { } 

  async getDistributorCatalogByDistributor(distributorId: string) {
    var url = this.apiurl + '/distributorCatalog/getbydistributor/' + encodeURIComponent(distributorId);
    const product = await lastValueFrom(this.http.get<any>(url));
    return product.content;
  }

  async searchPurchaseOrder(invoiceId: any, query: any, status: any) {
    var url = this.apiurl + '/purchase-invoice-line/all?filter=purchaseInvoice.id~' + encodeURIComponent(invoiceId) + encodeURIComponent(" and ( status~'%" + status + "%' and invoiceNo~'%" + query + "%')");
    const orders = await lastValueFrom(this.http.get<any>(url));
    return orders;
  }

  async getBySalesInvoice(id: any) {
    var url = this.apiurl + '/purchase-invoice-line/getBySalesInvoice/' + encodeURIComponent(id);
    const grs = await lastValueFrom(this.http.get<any>(url));
    return grs;
  }
 
  async deleteSalesInvoiceLine(id: string) {
    var url = this.apiurl + '/purchase-invoice-line/delete/' + encodeURIComponent(id);
    const stores = await lastValueFrom(this.http.delete<any>(url));
    return stores.content;
  }

  async createSalesInvoiceLine(salesInvoiceLine: SalesInvoiceLine) {
    var url = this.apiurl + '/purchase-invoice-line/create'
    const pol = await lastValueFrom(this.http.post<any>(url, salesInvoiceLine));
    return pol;
  }

  async updateSalesInvoiceLine(salesInvoiceLine: SalesInvoiceLine) {
    var url = this.apiurl + '/purchase-invoice-line/update/' + encodeURIComponent(salesInvoiceLine.id!);
    const pol = await lastValueFrom(this.http.put<any>(url, salesInvoiceLine));
    return pol;
  }
}
