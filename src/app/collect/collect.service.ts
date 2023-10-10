import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CollectService {

  apiurl: string = environment.apiurl;
  apiurlNew:string = environment.apiurlNew ;

  constructor(private http: HttpClient) { }

  async createPurchaseInvoice(poInvoice: any) {
    var url = this.apiurlNew + 'api/PurchaseInvoice/purchaseInvoice'
    const _purchaseInvoice = await lastValueFrom(this.http.post<any>(url,poInvoice));
    return _purchaseInvoice;
  }

  async allPurchaseInvoice() {
    var url = this.apiurlNew + 'api/PurchaseInvoice'
    const _purchaseInvoices = await lastValueFrom(this.http.get<any>(url));
    return _purchaseInvoices;
  }

  async updatePurchaseInvoice(poInvoice: any) {
    var url = this.apiurlNew + 'api/PurchaseInvoice'
    const _purchaseInvoiceUpdated = await lastValueFrom(this.http.put<any>(url,poInvoice));
    return _purchaseInvoiceUpdated;
  }

  async getPurchaseInvoiceById(pInvoiceId: any) {
    var url = this.apiurlNew + 'api/PurchaseInvoice/'+ encodeURIComponent(pInvoiceId);
    const _purchaseInvoice = await lastValueFrom(this.http.get<any>(url));
    return _purchaseInvoice;
  }

  async createInvoiceLineItem(invoiceLineItem : any) {
    var url = this.apiurlNew + 'purchaseInvoiceLine'
    const savedInvoiceLineItem = await lastValueFrom(this.http.post<any>(url , invoiceLineItem));
    return savedInvoiceLineItem;
  }

  async updateInvoiceLineItem(invoiceLineItem : any) {
    var url = this.apiurlNew + 'purchaseInvoiceLine' ;
    const updatedLineItem = await lastValueFrom(this.http.put<any>(url , invoiceLineItem));
    return updatedLineItem;
  }

  async getPurchaseLineItemsByInvoice(pInvoice: any) {
    var url = this.apiurlNew + 'purchaseInvoiceLine/byPurchaseInvoice/'+ encodeURIComponent(pInvoice.id);
    const _allLineItems = await lastValueFrom(this.http.get<any>(url));
    return _allLineItems;
  }

  async getRemainingAmount(pInvoice: any) {
    var url = this.apiurlNew + 'payments/'+ encodeURIComponent(pInvoice.id)+"/remaining";
    const remainingAmount = await lastValueFrom(this.http.get<any>(url));
    return remainingAmount;
  }
  

  async allSalesOrdersById(customer: any) {
    var url = this.apiurlNew + 'api/salesOrder/customer/'+ encodeURIComponent(customer.id);
    const allSOByCustomerId = await lastValueFrom(this.http.get<any>(url));
    return allSOByCustomerId;
  }

  // async allPurchaseInvoicesById(customer: any) {
  //   var url = this.apiurlNew + 'api/PurchaseInvoice/customer/'+ encodeURIComponent(customer.id);
  //   const allPIByCustomerId = await lastValueFrom(this.http.get<any>(url));
  //   return allPIByCustomerId;
  // }

  async allSalesInvoicesById(customer: any) {
    var url = this.apiurlNew + 'api/salesInvoice/customer/'+ encodeURIComponent(customer.id);
    const allSIByCustomerId = await lastValueFrom(this.http.get<any>(url));
    return allSIByCustomerId;
  }

}
