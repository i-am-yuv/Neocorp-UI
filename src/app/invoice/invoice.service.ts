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

  async getAllCashMemo() {
    var url = this.apiurlNew + 'cashMemo';
    const allCM = await lastValueFrom(this.http.get<any>(url));
    return allCM;
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

}
