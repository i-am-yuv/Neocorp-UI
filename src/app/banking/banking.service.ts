import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BankingService {

  apiurl: string = environment.apiurl;
  apiurlNew: string = environment.apiurlNew;

  constructor(private http: HttpClient) { }

  async getAllBeneficairy() {
    var url = this.apiurlNew + 'beneficiary';
    const allBeneficairy = await lastValueFrom(this.http.get<any>(url));
    return allBeneficairy;
  }

  async getAllDebitAccount() {
    var url = this.apiurlNew + 'debitAccountDetails';
    const allDebitAccounts = await lastValueFrom(this.http.get<any>(url));
    return allDebitAccounts;
  }

  async createBeneficiary(data: any) {
    var url = this.apiurlNew + 'beneficiary'
    const savedData = await lastValueFrom(this.http.post<any>(url, data));
    return savedData;
  }

  async createDebitAccount(data: any) {
    var url = this.apiurlNew + 'debitAccountDetails'
    const savedData = await lastValueFrom(this.http.post<any>(url, data));
    return savedData;
  }

  async makePayment(invoiceId : any, vendorId : any,  paymentRequest : any) {
    var url = this.apiurlNew + 'payments/'+ encodeURIComponent(invoiceId)+'?vendorId='+vendorId;
    // const payment = await lastValueFrom(this.http.post<any>(url, paymentRequest));
    // return payment;

    this.http.post<any>(url,paymentRequest).subscribe((res)=>{
      return res;
    }) ;
  }

  // async makePaymentPI(data: any) {

  //   // var url = this.apiurlNew + 'payments/'+encodeURIComponent(data.invoiceId)+'?vendorId='
  //   // +encodeURIComponent(data.vendorId)+'&amount='+data.amount+'&paymentType='+data.paymentType
  //   // +'&beneficiary='+data.beneficiary+'&accountDetails='+data.accountDetails+
  //   // '&upiId='+data.upiId ;
  //   // // const payment = await lastValueFrom(this.http.post<any>(url,data));
  //   // // return payment;
  //   // this.http.post<any>(url,data).subscribe((res)=>{
  //   //   return res;
  //   // }) ;

  //   const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  //   var params = new HttpParams().set('amount', data.amount)
  //     .set('vendorId', data.vendorId)
  //     .set('paymentType', data.paymentType)
  //     .set('beneficiary',  JSON.stringify(data.beneficiary))
  //     .set('accountDetails',  JSON.stringify(data.accountDetails))
  //     .set('upiId', data.upiId);

  //   //const pp=  await lastValueFrom( this.http.post('/payments/'+encodeURIComponent(data.invoiceId), params, { headers }));
  //   // this.http.get('/payments/' + encodeURIComponent(data.invoiceId), { params }).subscribe(response => {
  //   //   console.log(response);
  //   // });

  //   const savedData = await lastValueFrom( this.http.post('/payments/' + encodeURIComponent(data.invoiceId), {}, { headers, params }));
  //  //   = await lastValueFrom(this.http.post<any>(url, data));
  //   return savedData;
  // }

  async getPI(purchaseInvoiceId: any) {
    var url = this.apiurlNew + 'api/PurchaseInvoice/' + encodeURIComponent(purchaseInvoiceId);
    const PI = await lastValueFrom(this.http.get<any>(url));
    return PI;
  }

  async getCurrBeneficiary(data: any) {
    var url = this.apiurlNew + 'beneficiary/' + encodeURIComponent(data);
    const getdata = await lastValueFrom(this.http.get<any>(url, data));
    return getdata;
  }

  async updateBeneficiary(data: any) {
    var url = this.apiurlNew + 'beneficiary'
    const updatedData = await lastValueFrom(this.http.put<any>(url, data));
    return updatedData;
  }
  
  async getAllCompletedPI() {
    var url = this.apiurlNew + 'api/PurchaseInvoice/completed' ;
    const allCompletedPI = await lastValueFrom(this.http.get<any>(url));
    return allCompletedPI;
  }

  async getAllPI() {
    var url = this.apiurlNew + 'api/PurchaseInvoice' ;
    const allPI = await lastValueFrom(this.http.get<any>(url));
    return allPI;
  }

}
