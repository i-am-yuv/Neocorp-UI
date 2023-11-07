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

  async deleteReceiptNote(id: any){
    var url = this.apiurlNew + 'api/ReceiptNote/' + encodeURIComponent(id);
    const deleteReceiptNote = await lastValueFrom(this.http.delete<any>(url));
    return deleteReceiptNote;
  }

  async updateDebitNote(rn: any ) {
    var url = this.apiurlNew + 'api/debitNote';
    const _updatedDebitNote = await lastValueFrom(this.http.put<any>(url, rn));
    return _updatedDebitNote;
  }

  async createGoodsShipment(rn: any) {
    var url = this.apiurlNew + 'goodsShipment'
    const saved = await lastValueFrom(this.http.post<any>(url, rn));
    return saved;
  }

  async updateGoodsShipment(gs: any ) {
    var url = this.apiurlNew + 'goodsShipment';
    const _updatedGS = await lastValueFrom(this.http.put<any>(url, gs));
    return _updatedGS;
  }

  async createGoodsShipmentLine(gs: any ) {
    var url = this.apiurlNew + 'goodsShipmentLine';
    const saved = await lastValueFrom(this.http.post<any>(url, gs));
    return saved;
  }

  async updateGoodsShipmentLine(gs: any ) {
    var url = this.apiurlNew + 'goodsShipmentLine';
    const updated = await lastValueFrom(this.http.put<any>(url, gs));
    return updated;
  }

  async getLineItemsByGoodsShipmentId(gs: any) {
    var url = this.apiurlNew + 'goodsShipmentLine/byGoodsShipment/'+ encodeURIComponent(gs.id);
    const result = await lastValueFrom(this.http.get<any>(url));
    return result;
  }

  async getLineItemsByGoodsReceiptId(gr: any) {
    var url = this.apiurlNew + 'goodsReceiptLine/byGoodsReceipt/'+ encodeURIComponent(gr.id);
    const result = await lastValueFrom(this.http.get<any>(url));
    return result;
  }

  async createGoodsReceipt(rn: any) {
    var url = this.apiurlNew + 'goodsReceipt'
    const saved = await lastValueFrom(this.http.post<any>(url, rn));
    return saved;
  }

  async updateGoodsReceipt(gs: any ) {
    var url = this.apiurlNew + 'goodsReceipt';
    const _updatedGS = await lastValueFrom(this.http.put<any>(url, gs));
    return _updatedGS;
  }

  async createGoodsReceiptLine(gs: any ) {
    var url = this.apiurlNew + 'goodsReceiptLine';
    const saved = await lastValueFrom(this.http.post<any>(url, gs));
    return saved;
  }

  async updateGoodsReceiptLine(gs: any ) {
    var url = this.apiurlNew + 'goodsReceiptLine';
    const updated = await lastValueFrom(this.http.put<any>(url, gs));
    return updated;
  }


  async getPurchaseorderById(poId: any) {
    var url = this.apiurlNew + 'api/PurchaseOrder/purchaseOrder/'+ encodeURIComponent(poId);
    const _purchaseOrder = await lastValueFrom(this.http.get<any>(url));
    return _purchaseOrder;
  }

  async searchPurchaseOrder( query: any) {
   // var url = this.apiurl + 'api/PurchaseOrder??filter=vendor.id~' + encodeURIComponent("'%" + vendorId + "%'") + encodeURIComponent(" and  status~'%" + status + "%' and orderNumber~'%" + query + "%'");
    
   var url = this.apiurlNew + 'api/PurchaseOrder?filter=orderNumber~' + encodeURIComponent("'%" + query + "%'") + encodeURIComponent(" or  vendor.firstName~'%" + query + "%' or vendor.lastName~'%" + query + "%' or grossTotal~'%" + query + "%'");

    const filteredPos = await lastValueFrom(this.http.get<any>(url));
    return filteredPos;
  }

  async searchDN( query: any) {
    // var url = this.apiurl + 'api/PurchaseOrder??filter=vendor.id~' + encodeURIComponent("'%" + vendorId + "%'") + encodeURIComponent(" and  status~'%" + status + "%' and orderNumber~'%" + query + "%'");
    var url = this.apiurlNew + 'api/debitNote?filter=debitNoteNumber~' + encodeURIComponent("'%" + query + "%'") + encodeURIComponent(" or  vendor.firstName~'%" + query + "%' or vendor.lastName~'%" + query + "%' or grossTotal~'%" + query + "%'or status~'%" + query + "%'");
     const filteredDNs = await lastValueFrom(this.http.get<any>(url));
     return filteredDNs;
   }

   async searchRN( query: any) {
    // var url = this.apiurl + 'api/PurchaseOrder??filter=vendor.id~' + encodeURIComponent("'%" + vendorId + "%'") + encodeURIComponent(" and  status~'%" + status + "%' and orderNumber~'%" + query + "%'");
    var url = this.apiurlNew + 'api/ReceiptNote?filter=receiptNoteNumber~' + encodeURIComponent("'%" + query + "%'") + encodeURIComponent(" or  customer.displayName~'%" + query + "%' or  customer.contactName~'%" + query + "%' or grossTotal~'%" + query +"%'or status~'%" + query + "%'or vendor.firstName~'%" + query + "%'or vendor.lastName~'%" + query + "%'");
     const filteredDNs = await lastValueFrom(this.http.get<any>(url));
     return filteredDNs;
   }

   async searchGS( query: any) {
    // var url = this.apiurl + 'api/PurchaseOrder??filter=vendor.id~' + encodeURIComponent("'%" + vendorId + "%'") + encodeURIComponent(" and  status~'%" + status + "%' and orderNumber~'%" + query + "%'");
    var url = this.apiurlNew + 'goodsShipment?filter=documentno~' + encodeURIComponent("'%" + query + "%'") + encodeURIComponent(" or  customer.displayName~'%" + query + "%' or  customer.contactName~'%" + query + "%' or salesOrder.documentno~'%" + query +"%'or status~'%" + query + "%'or vendor.firstName~'%" + query + "%'or vendor.lastName~'%" + query + "%'or vendor.mobileNumber~'%" + query + "%'or customer.mobileNumber~'%" + query + "%'" );
     const filteredGSs = await lastValueFrom(this.http.get<any>(url));
     return filteredGSs;
   }

   async searchGR( query: any) {
    // var url = this.apiurl + 'api/PurchaseOrder??filter=vendor.id~' + encodeURIComponent("'%" + vendorId + "%'") + encodeURIComponent(" and  status~'%" + status + "%' and orderNumber~'%" + query + "%'");
    var url = this.apiurlNew + 'goodsReceipt?filter=documentno~' + encodeURIComponent("'%" + query + "%'") + encodeURIComponent(" or salesOrder.documentno~'%" + query +"%'or status~'%" + query + "%'or vendor.firstName~'%" + query + "%'or vendor.lastName~'%" + query + "%'or vendor.mobileNumber~'%" + query + "%'" );
     const filteredGRs = await lastValueFrom(this.http.get<any>(url));
     return filteredGRs;
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

  async getAllRn(user : any) {
    var url = this.apiurlNew + 'api/ReceiptNote/receiptNote/'+encodeURIComponent(user.id);
    const allRn = await lastValueFrom(this.http.get<any>(url));
    return allRn;
  }

  async getAllGS(user : any) {
    var url = this.apiurlNew + 'goodsShipment/goodsShipment/'+encodeURIComponent(user.id);
    const allGS = await lastValueFrom(this.http.get<any>(url));
    return allGS;
  }

  async getCurrentGs(id: string) {
    var url = this.apiurlNew + 'goodsShipment/'+encodeURIComponent(id);
    const currGs = await lastValueFrom(this.http.get<any>(url));
    return currGs;
  }

  async getAllGR(user : any) {
    var url = this.apiurlNew + 'goodsReceipt/goodsReceipt/'+encodeURIComponent(user.id);
    const allGR = await lastValueFrom(this.http.get<any>(url));
    return allGR;
  }

  async getCurrentGr(id: string) {
    var url = this.apiurlNew + 'goodsReceipt/'+encodeURIComponent(id);
    const currGR = await lastValueFrom(this.http.get<any>(url));
    return currGR;
  }

  async getCurrentDn(id: string) {
    var url = this.apiurlNew + '/api/debitNote/'+encodeURIComponent(id);
    const currDn = await lastValueFrom(this.http.get<any>(url));
    return currDn;
  }

  async getAllDn(user : any) {
    var url = this.apiurlNew + 'api/debitNote/debitNote/'+encodeURIComponent(user.id);;
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

  async getAllPo(user : any) {
    var url = this.apiurlNew + 'api/PurchaseOrder/purchaseOrder/'+encodeURIComponent(user.id); ;
    const allPos = await lastValueFrom(this.http.get<any>(url));
    return allPos;
  }

  async getAllProductCategory() {
    var url = this.apiurlNew + 'api/productCategory' ;
    const allPCs = await lastValueFrom(this.http.get<any>(url));
    return allPCs;
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

  async getBranchByUserId(userId : any) {
    var url = this.apiurlNew + 'branch/user/'+encodeURIComponent(userId) ;
    const branch = await lastValueFrom(this.http.get<any>(url));
    return branch;
  }

}
