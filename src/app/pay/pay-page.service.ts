import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, last, lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PayPageService {

  apiurl: string = environment.apiurl;
  apiurlNew: string = environment.apiurlNew;

  constructor(private http: HttpClient) { }

  async createCustomer(customer: any) {
    var url = this.apiurlNew + 'customer'
    const _customer = await lastValueFrom(this.http.post<any>(url, customer));
    return _customer;
  }

  async updateCustomer(customer: any) {
    var url = this.apiurlNew + 'customer';
    const updateCustomer = await lastValueFrom(this.http.put<any>(url, customer));
    return updateCustomer;
  }

  async createVendor(vendor: any) {
    var url = this.apiurlNew + 'api/vendor/signup'
    this.http.post<any>(url, vendor).subscribe(
      (res) => {
        return res;
      }, (err) => {
        return err;
      }
    )
  }

  async getVendor(vendorId: any) {
    var url = this.apiurlNew + 'api/vendor/' + encodeURIComponent(vendorId);
    const currentVendor = await lastValueFrom(this.http.get<any>(url));
    return currentVendor;
  }

  async getVendorById(id: any) {
    var url = this.apiurlNew + 'api/vendor/' + encodeURIComponent(id);
    const currentVendor = await lastValueFrom(this.http.get<any>(url));
    return currentVendor;
  }

  async getAddressByVendorId(id: any) {
    var url = this.apiurlNew + 'api/vendor/' + encodeURIComponent(id) + '/address';
    const currentAdd = await lastValueFrom(this.http.get<any>(url));
    return currentAdd;
  }

  async getAccountByVendorId(id: any) {
    var url = this.apiurlNew + 'api/vendor/' + encodeURIComponent(id) + '/accountDetails';
    const currentAcc = await lastValueFrom(this.http.get<any>(url));
    return currentAcc;
  }

  async updateVendor(vendor: any) {
    var url = this.apiurlNew + 'api/vendor';
    const currentVendor = await lastValueFrom(this.http.put<any>(url, vendor));
    return currentVendor;
  }

  async searchVendor(query: any) {
    // var url = this.apiurl + 'api/PurchaseOrder??filter=vendor.id~' + encodeURIComponent("'%" + vendorId + "%'") + encodeURIComponent(" and  status~'%" + status + "%' and orderNumber~'%" + query + "%'");

    var url = this.apiurlNew + 'api/vendor?filter=firstName~' + encodeURIComponent("'%" + query + "%'") + encodeURIComponent(" or  lastName~'%" + query + "%' or mobileNumber~'%" + query + "%' or email~'%" + query + "%'");

    const filteredVendors = await lastValueFrom(this.http.get<any>(url));
    return filteredVendors;
  }

  async searchCustomer(query: any) {
    // var url = this.apiurl + 'api/PurchaseOrder??filter=vendor.id~' + encodeURIComponent("'%" + vendorId + "%'") + encodeURIComponent(" and  status~'%" + status + "%' and orderNumber~'%" + query + "%'");

    var url = this.apiurlNew + 'customer?filter=displayName~' + encodeURIComponent("'%" + query + "%'") + encodeURIComponent(" or  contactName~'%" + query + "%' or mobileNumber~'%" + query + "%' or email~'%" + query + "%'");

    const filteredCustomers = await lastValueFrom(this.http.get<any>(url));
    return filteredCustomers;
  }

  async searchPI(query: any) {
    // var url = this.apiurl + 'api/PurchaseOrder??filter=vendor.id~' + encodeURIComponent("'%" + vendorId + "%'") + encodeURIComponent(" and  status~'%" + status + "%' and orderNumber~'%" + query + "%'");

    var url = this.apiurlNew + 'api/PurchaseInvoice?filter=invoiceNo~' + encodeURIComponent("'%" + query + "%'") + encodeURIComponent(" or  vendor.firstName~'%" + query + "%' or vendor.lastName~'%" + query + "%' or remainingAmount~'%" + query + "%'or vendor.mobileNumber~'%" + query + "%'");
    const filteredPIs = await lastValueFrom(this.http.get<any>(url));
    return filteredPIs;
  }

  async searchRR(query: any) {
    // var url = this.apiurl + 'api/PurchaseOrder??filter=vendor.id~' + encodeURIComponent("'%" + vendorId + "%'") + encodeURIComponent(" and  status~'%" + status + "%' and orderNumber~'%" + query + "%'");
    var url = this.apiurlNew + 'api/returnRefund?filter=documentNo~' + encodeURIComponent("'%" + query + "%'") + encodeURIComponent(" or  salesOrder.customer.displayName~'%" + query + "%' or grossTotal~'%" + query + "%'");
    const filteredDNs = await lastValueFrom(this.http.get<any>(url));
    return filteredDNs;
  }

  async createAddress(address: any) {
    var url = this.apiurlNew + 'address'
    const _address = await lastValueFrom(this.http.post<any>(url, address));
    return _address;
  }

  async updateVendorAddress(vendor: any) {
    var url = this.apiurlNew + 'address';
    const currentVendorAddress = await lastValueFrom(this.http.put<any>(url, vendor));
    return currentVendorAddress;
  }

  async updateCustomerAddress(vendor: any) {
    var url = this.apiurlNew + 'address';
    const currentVendorAddress = await lastValueFrom(this.http.put<any>(url, vendor));
    return currentVendorAddress;
  }

  async createAccountDetails(accountDetails: any) {
    var url = this.apiurlNew + 'accountDetails'
    const accountD = await lastValueFrom(this.http.post<any>(url, accountDetails));
    return accountD;
  }

  async getAccountById(id: any) {
    var url = this.apiurlNew + 'accountDetails/' + encodeURIComponent(id);
    const accountById = await lastValueFrom(this.http.get<any>(url));
    return accountById;
  }

  async updateVendorAccount(data: any) {
    var url = this.apiurlNew + 'accountDetails'
    const accountUpdate = await lastValueFrom(this.http.put<any>(url, data));
    return accountUpdate;
  }

  async updateCustomerAccount(data: any) {
    var url = this.apiurlNew + 'accountDetails'
    const accountUpdate = await lastValueFrom(this.http.put<any>(url, data));
    return accountUpdate;
  }

  async saveAccount(data: any) {
    var url = this.apiurlNew + 'creditAccountDetails'
    const account = await lastValueFrom(this.http.post<any>(url, data));
    return account;
  }

  async getAllCreditAccount(user: any) {
    var url = this.apiurlNew + 'creditAccountDetails/creditAccountDetails/' + encodeURIComponent(user.id);
    const allCreaditAccounts = await lastValueFrom(this.http.get<any>(url));
    return allCreaditAccounts;
  }

  async updateCreditAccount(data: any) {
    var url = this.apiurlNew + 'creditAccountDetails';
    const updateCreaditAccount = await lastValueFrom(this.http.put<any>(url, data));
    return updateCreaditAccount;
  }

  async getCreditAccountById(id: any) {
    var url = this.apiurlNew + 'creditAccountDetails/' + encodeURIComponent(id);
    const creditAccountById = await lastValueFrom(this.http.get<any>(url));
    return creditAccountById;
  }

  async deleteCreditAccount(id: any) {
    var url = this.apiurlNew + 'creditAccountDetails/' + encodeURIComponent(id);
    const deleteCreditAccount = await lastValueFrom(this.http.delete<any>(url));
    return deleteCreditAccount;
  }

  async saveDebitAccount(data: any) {
    var url = this.apiurlNew + 'debitAccountDetails'
    const account = await lastValueFrom(this.http.post<any>(url, data));
    return account;
  }

  async getAllDebitAccount(user: any) {
    var url = this.apiurlNew + 'debitAccountDetails/debitAccountDetails/' + encodeURIComponent(user.id);
    const allDebitAccounts = await lastValueFrom(this.http.get<any>(url));
    return allDebitAccounts;
  }

  async updateDebitAccount(data: any) {
    var url = this.apiurlNew + 'debitAccountDetails'
    const updateDebitAccounts = await lastValueFrom(this.http.put<any>(url, data));
    return updateDebitAccounts;
  }

  async getDebitAccountById(id: any) {
    var url = this.apiurlNew + 'debitAccountDetails/' + encodeURIComponent(id);
    const debitAccountById = await lastValueFrom(this.http.get<any>(url));
    return debitAccountById;
  }

  async deleteDebitAccount(id: any) {
    var url = this.apiurlNew + 'debitAccountDetails/' + encodeURIComponent(id);
    const deleteDebitAccount = await lastValueFrom(this.http.delete<any>(url));
    return deleteDebitAccount;
  }

  async allVendor(user: any) {
    var url = this.apiurlNew + 'api/vendor/vendor/' + encodeURIComponent(user.id);
    const allVendor = await lastValueFrom(this.http.get<any>(url));
    return allVendor;
  }

  async allState() {
    var url = this.apiurlNew + 'api/state'
    const allState = await lastValueFrom(this.http.get<any>(url));
    return allState;
  }

  async allCustomer(user: any) {
    var url = this.apiurlNew + 'customer/customer/' + encodeURIComponent(user.id);
    const allCustomer = await lastValueFrom(this.http.get<any>(url));
    return allCustomer;
  }

  async getCustomerById(id: any) {
    var url = this.apiurlNew + 'customer/' + encodeURIComponent(id);
    const currentVendor = await lastValueFrom(this.http.get<any>(url));
    return currentVendor;
  }

  async getCustomerAddressById(id: any) {
    var url = this.apiurlNew + 'customer/' + encodeURIComponent(id) + '/address';
    const currentVendor = await lastValueFrom(this.http.get<any>(url));
    return currentVendor;
  }

  async getCustomerAccountById(id: any) {
    var url = this.apiurlNew + 'customer/' + encodeURIComponent(id) + '/accountDetails';
    const currentVendor = await lastValueFrom(this.http.get<any>(url));
    return currentVendor;
  }

  async allProduct(user: any) {
    var url = this.apiurlNew + 'api/product/product/' + encodeURIComponent(user.id);
    const allProduct = await lastValueFrom(this.http.get<any>(url));
    return allProduct;
  }

  async getCurrentproduct(productId: any) {
    var url = this.apiurlNew + 'api/product/' + encodeURIComponent(productId.id);
    const currentProduct = await lastValueFrom(this.http.get<any>(url));
    return currentProduct;
  }

  async allSO(user: any) {
    var url = this.apiurlNew + 'api/salesOrder/salesOrder/' + encodeURIComponent(user.id);
    const allSO = await lastValueFrom(this.http.get<any>(url));
    return allSO;
  }

  async createReturnRefund(data: any) {
    var url = this.apiurlNew + 'api/returnRefund/returnRefund'
    const createRR = await lastValueFrom(this.http.post<any>(url, data));
    return createRR;
  }

  async updateReturnRefund(data: any) {
    var url = this.apiurlNew + 'api/returnRefund'
    const updatedRR = await lastValueFrom(this.http.put<any>(url, data));
    return updatedRR;
  }


  async createLineItem(data: any) {
    var url = this.apiurlNew + 'purchaseOrderLine'
    const savedLineItem = await lastValueFrom(this.http.post<any>(url, data));
    return savedLineItem;
  }

  async updateLineItem(data: any) {
    var url = this.apiurlNew + 'purchaseOrderLine'
    const updatedLineItem = await lastValueFrom(this.http.put<any>(url, data));
    return updatedLineItem;
  }

  async deleteLineItem(data: any) {
    var url = this.apiurlNew + 'purchaseOrderLine'
    const deletedItem = await lastValueFrom(this.http.delete<any>(url, data));
    return deletedItem;
  }

  async createReceiptNoteLineItem(data: any) {
    var url = this.apiurlNew + 'receiptNoteLine'
    const savedRnLineItem = await lastValueFrom(this.http.post<any>(url, data));
    return savedRnLineItem;
  }

  async updateReceiptNoteLineItem(data: any) {
    var url = this.apiurlNew + 'receiptNoteLine'
    const updatedRnLineItem = await lastValueFrom(this.http.put<any>(url, data));
    return updatedRnLineItem;
  }

  async deleteReceiptNoteLineItem(id: any) {
    var url = this.apiurlNew + 'receiptNoteLine/' + encodeURIComponent(id);
    const deleteReceiptNoteLineItem = await lastValueFrom(this.http.delete<any>(url));
    return deleteReceiptNoteLineItem;
  }

  async createCreditNoteLineItem(data: any) {
    var url = this.apiurlNew + 'api/creditNoteLine'
    const savedCnLineItem = await lastValueFrom(this.http.post<any>(url, data));
    return savedCnLineItem;
  }

  async updateCreditNoteLineItem(data: any) {
    var url = this.apiurlNew + 'api/creditNoteLine'
    const updatedCnLineItem = await lastValueFrom(this.http.put<any>(url, data));
    return updatedCnLineItem;
  }

  async deleteCreditNoteLineItem(id: any) {
    var url = this.apiurlNew + 'api/creditNoteLine/' + encodeURIComponent(id);
    const deletedCnLineItem = await lastValueFrom(this.http.delete<any>(url));
    return deletedCnLineItem;
  }

  async createDebitNoteLineItem(data: any) {
    var url = this.apiurlNew + 'api/debitNoteLine'
    const savedDnLineItem = await lastValueFrom(this.http.post<any>(url, data));
    return savedDnLineItem;
  }

  async updateDebitNoteLineItem(data: any) {
    var url = this.apiurlNew + 'api/debitNoteLine'
    const updatedDnLineItem = await lastValueFrom(this.http.put<any>(url, data));
    return updatedDnLineItem;
  }

  async deleteDebitNoteLineItem(id: any) {
    var url = this.apiurlNew + 'api/debitNoteLine/' + encodeURIComponent(id);
    const deletedDnLineItem = await lastValueFrom(this.http.delete<any>(url));
    return deletedDnLineItem;
  }

  async createCashMemoLineItem(data: any) {
    var url = this.apiurlNew + 'api/cashMemoLine'
    const savedCashMemoLineItem = await lastValueFrom(this.http.post<any>(url, data));
    return savedCashMemoLineItem;
  }

  async updateCashMemoLineItem(data: any) {
    var url = this.apiurlNew + 'api/cashMemoLine'
    const updatedCashMemoLineItem = await lastValueFrom(this.http.put<any>(url, data));
    return updatedCashMemoLineItem;
  }

  async deleteCashMemoLineItem(id: any) {
    var url = this.apiurlNew + 'api/cashMemoLine/' + encodeURIComponent(id);
    const deleteCashMemoLineItem = await lastValueFrom(this.http.delete<any>(url));
    return deleteCashMemoLineItem;
  }

  async createSILineItem(data: any) {
    var url = this.apiurlNew + 'salesInvoiceLine'
    const saved = await lastValueFrom(this.http.post<any>(url, data));
    return saved;
  }

  async updateSILineItem(data: any) {
    var url = this.apiurlNew + 'salesInvoiceLine'
    const updated = await lastValueFrom(this.http.put<any>(url, data));
    return updated;
  }

  async deleteSILineItem(id: any) {
    var url = this.apiurlNew + 'salesInvoiceLine/' + encodeURIComponent(id);
    const deleted = await lastValueFrom(this.http.delete<any>(url));
    return deleted;
  }

  async createVILineItem(data: any) {
    var url = this.apiurlNew + 'api/vendorInvoiceLine'
    const saved = await lastValueFrom(this.http.post<any>(url, data));
    return saved;
  }

  async updateVILineItem(data: any) {
    var url = this.apiurlNew + 'api/vendorInvoiceLine'
    const updated = await lastValueFrom(this.http.put<any>(url, data));
    return updated;
  }

  async deleteVILineItem(lineItem: any) {
    var url = this.apiurlNew + 'api/vendorInvoiceLine/' + encodeURIComponent(lineItem);
    const deleteVILI = await lastValueFrom(this.http.delete<any>(url));
    return deleteVILI;
  }

  async createReturnRefundLineItem(data: any) {
    var url = this.apiurlNew + 'returnRefundLine'
    const savedrrLine = await lastValueFrom(this.http.post<any>(url, data));
    return savedrrLine;
  }

  async updateReturnRefundLineItem(data: any) {
    var url = this.apiurlNew + 'returnRefundLine'
    const updatedRRLine = await lastValueFrom(this.http.put<any>(url, data));
    return updatedRRLine;
  }

  async deleteReturnRefundLineItem(id: any) {
    var url = this.apiurlNew + 'returnRefundLine/' + encodeURIComponent(id);
    const deleteRRLineItem = await lastValueFrom(this.http.delete<any>(url));
    return deleteRRLineItem;
  }

  async getAllLineItemsByPo(id: any) {
    var url = this.apiurlNew + 'purchaseOrderLine/byPurchaseOrder/' + encodeURIComponent(id);
    const allLineItems = await lastValueFrom(this.http.get<any>(url));
    return allLineItems;
  }

  async getCurrentReturnRefund(id: string) {
    var url = this.apiurlNew + 'api/returnRefund/' + encodeURIComponent(id);
    const currRR = await lastValueFrom(this.http.get<any>(url));
    return currRR;
  }

  async getAllRR(user: any) {
    var url = this.apiurlNew + 'api/returnRefund/returnRefund/' + encodeURIComponent(user.id);
    const allRR = await lastValueFrom(this.http.get<any>(url));
    return allRR;
  }

  async getLineitemsByRR(rr: any) {
    var url = this.apiurlNew + 'returnRefundLine/byReceiptNoteLine/' + encodeURIComponent(rr.id);
    const currRRLineItems = await lastValueFrom(this.http.get<any>(url));
    return currRRLineItems;
  }

  async getPurchageOrderById(vendor: any) {
    var url = this.apiurlNew + 'api/PurchaseOrder/vendor/' + encodeURIComponent(vendor.id);
    const POByVendor = await lastValueFrom(this.http.get<any>(url));
    return POByVendor;
  }

  async getPurchaseInvoiceById(vendor: any) {
    var url = this.apiurlNew + 'api/PurchaseInvoice/vendor/' + encodeURIComponent(vendor.id);
    const PIByVendor = await lastValueFrom(this.http.get<any>(url));
    return PIByVendor;
  }

  async getPurchageOrderByPOId(id: any) {
    var url = this.apiurlNew + 'api/PurchaseOrder/' + encodeURIComponent(id);
    const po = await lastValueFrom(this.http.get<any>(url));
    return po;
  }

  async getRemainingAmountByPurchaseInvoice(pi: any) {
    var url = this.apiurlNew + 'payments/' + encodeURIComponent(pi.id) + '/remaining';
    const remainingAmount = await lastValueFrom(this.http.get<any>(url));
    return remainingAmount;
  }


  fileUploadForPurchaseOrder(poId: any, file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    var url = this.apiurlNew + 'api/PurchaseOrder/uploadFile/' + encodeURIComponent(poId);
    formData.append('file', file);
    //console.log(JSON.stringify(formData));
    const req = new HttpRequest('POST', `${url}`, formData, {
      reportProgress: true,
      responseType: 'json',
    });
    return this.http.request(req);
  }

  fileUploadForPurchaseInvoice(purchaseInvoiceId: any, file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    var url = this.apiurlNew + 'api/PurchaseInvoice/uploadFile/' + encodeURIComponent(purchaseInvoiceId);
    formData.append('file', file);
    //console.log(JSON.stringify(formData));
    const req = new HttpRequest('POST', `${url}`, formData, {
      reportProgress: true,
      responseType: 'json',
    });
    return this.http.request(req);
  }

  fileUploadForSalesOrder(salesOrderId: any, file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    var url = this.apiurlNew + 'api/salesOrder/uploadFile/' + encodeURIComponent(salesOrderId);
    formData.append('file', file);
    //console.log(JSON.stringify(formData));
    const req = new HttpRequest('POST', `${url}`, formData, {
      reportProgress: true,
      responseType: 'json',
    });
    return this.http.request(req);
  }

  fileUploadForReceiptNote(rnId: any, file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    var url = this.apiurlNew + 'api/ReceiptNote/uploadFile/' + encodeURIComponent(rnId);
    formData.append('file', file);
    //console.log(JSON.stringify(formData));
    const req = new HttpRequest('POST', `${url}`, formData, {
      reportProgress: true,
      responseType: 'json',
    });
    return this.http.request(req);
  }

  fileUploadForCreditNote(cnId: any, file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    var url = this.apiurlNew + 'creditNote/uploadFile/' + encodeURIComponent(cnId);
    formData.append('file', file);
    //console.log(JSON.stringify(formData));
    const req = new HttpRequest('POST', `${url}`, formData, {
      reportProgress: true,
      responseType: 'json',
    });
    return this.http.request(req);
  }

  fileUploadForDebitNote(dnId: any, file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    var url = this.apiurlNew + 'api/debitNote/uploadFile/' + encodeURIComponent(dnId);
    formData.append('file', file);
    //console.log(JSON.stringify(formData));
    const req = new HttpRequest('POST', `${url}`, formData, {
      reportProgress: true,
      responseType: 'json',
    });
    return this.http.request(req);
  }

  fileUploadForCashMemo(cashMemoId: any, file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    var url = this.apiurlNew + 'cashMemo/uploadFile/' + encodeURIComponent(cashMemoId);
    formData.append('file', file);
    //console.log(JSON.stringify(formData));
    const req = new HttpRequest('POST', `${url}`, formData, {
      reportProgress: true,
      responseType: 'json',
    });
    return this.http.request(req);
  }

}
