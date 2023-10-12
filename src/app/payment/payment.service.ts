import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  apiurl: string = environment.apiurl;
  apiurlNew:string = environment.apiurlNew ;

  constructor(private http: HttpClient) { }

  async makePaymentPI(data: any) {
    var url = this.apiurlNew + 'payments/'+encodeURIComponent(data.invoiceId)+'?vendorId='
    +encodeURIComponent(data.vendorId)+'&amount='+data.amount+'&paymentType='+data.paymentType
    +'&paymentRequest='+data.paymentRequest;
    // const payment = await lastValueFrom(this.http.post<any>(url,data));
    // return payment;
    this.http.post<any>(url,data).subscribe((res)=>{
      return res;
    }) ;
  }

  async makePaymentSI(data: any) {
    var url = this.apiurlNew + 'salesInvoicePayments/'+encodeURIComponent(data.invoiceId)+'?customerId='
    +encodeURIComponent(data.customerId)+'&amount='+data.amount+'&paymentType='+data.paymentType;
    const payment = await lastValueFrom(this.http.post<any>(url,data));
    return payment;
  }

  async getPI(purchaseInvoiceId: any) {
    var url = this.apiurlNew + 'api/PurchaseInvoice/'+encodeURIComponent(purchaseInvoiceId);
    const PI = await lastValueFrom(this.http.get<any>(url));
    return PI;
  }
}
