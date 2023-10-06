import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BillsService {

  apiurl: string = environment.apiurl;
  apiurlNew:string = environment.apiurlNew ;

  constructor(private http: HttpClient) { }

  async createPurchaseorder(po: any) {
    var url = this.apiurlNew + 'api/PurchaseOrder/purchaseOrder'
    const _purchaseOrder = await lastValueFrom(this.http.post<any>(url, po));
    return _purchaseOrder;
  }

  async createReceiptNote(rn: any) {
    var url = this.apiurlNew + 'api/ReceiptNote/receiptNote'
    const _receiptNote = await lastValueFrom(this.http.post<any>(url, rn));
    return _receiptNote;
  }

  async createDebitNote(rn: any) {
    var url = this.apiurlNew + 'api/debitNote'
    const _debitNote = await lastValueFrom(this.http.post<any>(url, rn));
    return _debitNote;
  }

  async updatePurchaseorder(po: any ) {
    var url = this.apiurlNew + 'api/PurchaseOrder';
    const _updatedPurchaseOrder = await lastValueFrom(this.http.put<any>(url, po));
    return _updatedPurchaseOrder;
  }

  async updateReceiptNote(rn: any ) {
    var url = this.apiurlNew + 'api/ReceiptNote';
    const _updatedReceiptNote = await lastValueFrom(this.http.put<any>(url, rn));
    return _updatedReceiptNote;
  }

  async updateDebitNote(rn: any ) {
    var url = this.apiurlNew + 'api/debitNote';
    const _updatedDebitNote = await lastValueFrom(this.http.put<any>(url, rn));
    return _updatedDebitNote;
  }

  async getPurchaseorderById(poId: any) {
    var url = this.apiurlNew + 'api/PurchaseOrder/purchaseOrder/'+ encodeURIComponent(poId);
    const _purchaseOrder = await lastValueFrom(this.http.get<any>(url));
    return _purchaseOrder;
  }

  async createPoLineItem(lineItem: any) {
    var url = this.apiurlNew + 'lineItem'
    const _lineItemSaved = await lastValueFrom(this.http.post<any>(url, lineItem));
    return _lineItemSaved;
  }

  async findAllLineItemByPo(poId: any) {
    var url = this.apiurlNew + 'lineItem'
    const _allLineItems = await lastValueFrom(this.http.get<any>(poId));
    return _allLineItems;
  }

  async deleteLineItem(lineItemId: any) {
    var url = this.apiurlNew + 'purchaseOrderLine/'+encodeURIComponent(lineItemId);
    const deletedLineItem = await lastValueFrom(this.http.delete<any>(url));
    return deletedLineItem;
  }

  async getCurrentPo(id: string) {
    var url = this.apiurlNew + 'api/PurchaseOrder/'+encodeURIComponent(id);
    const currPo = await lastValueFrom(this.http.get<any>(url));
    return currPo;
  }

  async getCurrentRn(id: string) {
    var url = this.apiurlNew + 'api/ReceiptNote/'+encodeURIComponent(id);
    const currRn = await lastValueFrom(this.http.get<any>(url));
    return currRn;
  }

  async getAllRn() {
    var url = this.apiurlNew + 'api/ReceiptNote';
    const allRn = await lastValueFrom(this.http.get<any>(url));
    return allRn;
  }


  async getCurrentDn(id: string) {
    var url = this.apiurlNew + '/api/debitNote/'+encodeURIComponent(id);
    const currDn = await lastValueFrom(this.http.get<any>(url));
    return currDn;
  }

  async getAllDn() {
    var url = this.apiurlNew + 'api/debitNote';
    const allDn = await lastValueFrom(this.http.get<any>(url));
    return allDn;
  }
  
  async getLineitemsByPo(po:any) {
    var url = this.apiurlNew + 'purchaseOrderLine/byPurchaseOrder/'+encodeURIComponent(po.id);
    const currLineItems = await lastValueFrom(this.http.get<any>(url));
    return currLineItems;
  }

  async getLineitemsByRn(rn:any) {
    var url = this.apiurlNew + 'receiptNoteLine/byReceiptNoteLine/'+encodeURIComponent(rn.id);
    const currRnLineItems = await lastValueFrom(this.http.get<any>(url));
    return currRnLineItems;
  }

  async getLineitemsByDn(rn:any) {
    var url = this.apiurlNew + 'api/debitNoteLine/byDebitNote/'+encodeURIComponent(rn.id);
    const currDnLineItems = await lastValueFrom(this.http.get<any>(url));
    return currDnLineItems;
  }

  async getAllPo() {
    var url = this.apiurlNew + 'api/PurchaseOrder' ;
    const allPos = await lastValueFrom(this.http.get<any>(url));
    return allPos;
  }

  
  async getRemainingAmount(dn : any) {
    var url = this.apiurlNew + 'debitNotePayments/'+encodeURIComponent(dn.id)+'/remaining' ;
    const amount = await lastValueFrom(this.http.get<any>(url));
    return amount;
  }

  async getRemainingAmountReceipt(rn : any) {
    var url = this.apiurlNew + 'receiptNotePayments/'+encodeURIComponent(rn.id)+'/remaining' ;
    const amount = await lastValueFrom(this.http.get<any>(url));
    return amount;
  }

}
