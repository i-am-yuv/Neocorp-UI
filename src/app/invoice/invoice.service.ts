import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  apiurl: string = environment.apiurl;
  apiurlNew:string = environment.apiurlNew ;

  constructor(private http: HttpClient) { }

  async createSalesOrder(so: any) {
    var url = this.apiurlNew + 'api/salesOrder'
    const _salesOrder = await lastValueFrom(this.http.post<any>(url, so));
    return _salesOrder;
  }

  async updateSalesOrder(so: any ) {
    var url = this.apiurlNew + 'api/salesOrder';
    const _updatedSalesOrder = await lastValueFrom(this.http.put<any>(url, so));
    return _updatedSalesOrder;
  }


  async createCreditNote(so: any) {
    var url = this.apiurlNew + 'creditNote'
    const _creditNote = await lastValueFrom(this.http.post<any>(url, so));
    return _creditNote;
  }

  async createCashMemo(cashMemo: any) {
    var url = this.apiurlNew + 'cashMemo'
    const _cashMemo = await lastValueFrom(this.http.post<any>(url, cashMemo));
    return _cashMemo;
  }

  async createSI(si: any) {
    var url = this.apiurlNew + 'api/salesInvoice'
    const _SI = await lastValueFrom(this.http.post<any>(url, si));
    return _SI;
  }

  async updateCreditNote(so: any ) {
    var url = this.apiurlNew + 'creditNote';
    const _updatedCreditNote = await lastValueFrom(this.http.put<any>(url, so));
    return _updatedCreditNote;
  }

  async updateCashMemo(cashMemo: any ) {
    var url = this.apiurlNew + 'cashMemo';
    const _updatedCreditNote = await lastValueFrom(this.http.put<any>(url, cashMemo));
    return _updatedCreditNote;
  }

  async updateSI(si: any ) {
    var url = this.apiurlNew + 'api/salesInvoice';
    const _updatedSI = await lastValueFrom(this.http.put<any>(url, si));
    return _updatedSI;
  }

  async updateVI(si: any ) {
    var url = this.apiurlNew + 'api/vendorInvoice';
    const _updatedVI = await lastValueFrom(this.http.put<any>(url, si));
    return _updatedVI;
  }

  async createVI(si: any ) {
    var url = this.apiurlNew + 'api/vendorInvoice';
    const saved= await lastValueFrom(this.http.post<any>(url, si));
    return saved;
  }

  async getCurrentSo(id: string) {
    var url = this.apiurlNew + 'api/salesOrder/'+encodeURIComponent(id);
    const currSo = await lastValueFrom(this.http.get<any>(url));
    return currSo;
  }

  async getAllSo() {
    var url = this.apiurlNew + 'api/salesOrder';
    const allSo = await lastValueFrom(this.http.get<any>(url));
    return allSo;
  }

  async getAllVendorInvoices() {
    var url = this.apiurlNew + 'api/vendorInvoice';
    const all = await lastValueFrom(this.http.get<any>(url));
    return all;
  }

  async getLineitemsBySo(so:any) {
    var url = this.apiurlNew + 'api/salesOrderLine/bySalesOrder/'+encodeURIComponent(so.id!);
    const allLineItems = await lastValueFrom(this.http.get<any>(url));
    return allLineItems;
  }

  async createSoLineItem(data : any) {
    var url = this.apiurlNew + 'api/salesOrderLine'
    const savedLineItem = await lastValueFrom(this.http.post<any>(url , data));
    return savedLineItem;
  }

  async updateSoLineItem(data : any) {
    var url = this.apiurlNew + 'api/salesOrderLine'
    const updatedSoLineItem = await lastValueFrom(this.http.put<any>(url , data));
    return updatedSoLineItem;
  }

  async deletedSoLineItem(id : any) {
    var url = this.apiurlNew + 'api/salesOrderLine/'+encodeURIComponent(id);
    const deletedSoLineItem = await lastValueFrom(this.http.delete<any>(url ));
    return deletedSoLineItem;
  }

  async getCurrentCn(id: string) {
    var url = this.apiurlNew + 'creditNote/'+encodeURIComponent(id);
    const currCn = await lastValueFrom(this.http.get<any>(url));
    return currCn;
  }

  async getAllCn() {
    var url = this.apiurlNew + 'creditNote';
    const AllCn = await lastValueFrom(this.http.get<any>(url));
    return AllCn;
  }

  async getCurrentCashMemo(id: string) {
    var url = this.apiurlNew + 'cashMemo/'+encodeURIComponent(id);
    const currCashmemo = await lastValueFrom(this.http.get<any>(url));
    return currCashmemo;
  }

  async getCurrentSI(id: string) {
    var url = this.apiurlNew + 'api/salesInvoice/'+encodeURIComponent(id);
    const currSI = await lastValueFrom(this.http.get<any>(url));
    return currSI;
  }

  async getCurrentVI(id: string) {
    var url = this.apiurlNew + 'api/vendorInvoice/'+encodeURIComponent(id);
    const currVI = await lastValueFrom(this.http.get<any>(url));
    return currVI;
  }

  async getAllCashMemo() {
    var url = this.apiurlNew + 'cashMemo';
    const allCM = await lastValueFrom(this.http.get<any>(url));
    return allCM;
  }

  async getAllSI() {
    var url = this.apiurlNew + 'api/salesInvoice';
    const allSI = await lastValueFrom(this.http.get<any>(url));
    return allSI;
  }

  async getAllVI() {
    var url = this.apiurlNew + 'api/vendorInvoice';
    const allVI = await lastValueFrom(this.http.get<any>(url));
    return allVI;
  }

  async getLineitemsByCn(rn:any) {
    var url = this.apiurlNew + 'api/creditNoteLine/byCreditNote/'+encodeURIComponent(rn.id);
    const currCnLineItems = await lastValueFrom(this.http.get<any>(url));
    return currCnLineItems;
  }

  async getLineitemsByCashmemo(cashMemo:any) {
    var url = this.apiurlNew + 'api/cashMemoLine/byCashMemo/'+encodeURIComponent(cashMemo.id);
    const currCashMemoLineItems = await lastValueFrom(this.http.get<any>(url));
    return currCashMemoLineItems;
  }

  // ////////////////////////////////////////
  // async deleteCashMemoLineItem(id: any){
  //   var url = this.apiurlNew + 'api/cashMemoLine/byCashMemo/' + encodeURIComponent(id);
  //   const deleteCashMemoLineItem = await lastValueFrom(this.http.delete<any>(url));
  //   return deleteCashMemoLineItem;
  // }
  // //////////////////////////////////////////////////////////////////////////////

  async getLineitemsBySI(si:any) {
    var url = this.apiurlNew + 'salesInvoiceLine/bySalesInvoiceLine/'+encodeURIComponent(si.id);
    const currSILineItems = await lastValueFrom(this.http.get<any>(url));
    return currSILineItems;
  }

  async getLineitemsByVI(si:any) {
    var url = this.apiurlNew + 'api/vendorInvoiceLine/byVendorInvoice/'+encodeURIComponent(si.id);
    const currVILineItems = await lastValueFrom(this.http.get<any>(url));
    return currVILineItems;
  }

  async getRemainingAmount(pInvoice: any) {
    var url = this.apiurlNew + 'salesInvoicePayments/'+ encodeURIComponent(pInvoice.id)+"/remaining";
    const remainingAmount = await lastValueFrom(this.http.get<any>(url));
    return remainingAmount;
  }

  async getRemainingAmountReceipt(CN: any) {
    var url = this.apiurlNew + 'creditNotePayments/'+ encodeURIComponent(CN.id)+"/remaining";
    const remainingAmount = await lastValueFrom(this.http.get<any>(url));
    return remainingAmount;
  }


}
