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

  async deleteInvoiceLineItem(id : any) {
    var url = this.apiurlNew + 'purchaseInvoiceLine/'+ encodeURIComponent(id);
    const deletedLineItem = await lastValueFrom(this.http.delete<any>(url));
    return deletedLineItem;
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

  async getRemainingAmountBySalesInvoice(sInvoice: any) {
    var url = this.apiurlNew + 'salesInvoicePayments/'+ encodeURIComponent(sInvoice.id)+"/remaining";
    const remainingAmountOfSI = await lastValueFrom(this.http.get<any>(url));
    return remainingAmountOfSI;
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


  async getAllCustomers() {
    var url = this.apiurlNew + 'customer' ;
    const Customers = await lastValueFrom(this.http.get<any>(url));
    return Customers;
  }

  async togglePartialPaymentStatus( id : any , status : boolean ) {
    var url = this.apiurlNew + 'api/PurchaseInvoice/enable-partial-payments/'+id+'?enabled='+status ;
    const result = await lastValueFrom(this.http.put<any>(url , id) ) ;
    return result;
  }

}
