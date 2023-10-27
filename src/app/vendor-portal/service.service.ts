import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {


  apiurl: string = environment.apiurl;
  apiurlNew:string = environment.apiurlNew ;


  constructor(private http: HttpClient) { }

  async getAllPIByVendor(vendorId : any) {
    var url = this.apiurlNew + 'api/PurchaseInvoice/vendor/'+encodeURIComponent(vendorId);
    const allPIByVendor = await lastValueFrom(this.http.get<any>(url));
    return allPIByVendor;
  }
  
  async getAllDebitNotesByVendor(vendorId : any) {
    var url = this.apiurlNew + 'api/debitNote/vendor/'+encodeURIComponent(vendorId);
    const allDNByVendor = await lastValueFrom(this.http.get<any>(url));
    return allDNByVendor;
  }

  async getAllReceiptNotesByVendor(vendorId : any) {
    var url = this.apiurlNew + 'api/ReceiptNote/vendor/'+encodeURIComponent(vendorId)+'?vendorId='+encodeURIComponent(vendorId);
    const allRNByVendor = await lastValueFrom(this.http.get<any>(url));
    return allRNByVendor;
  }

  async getAllCashMemoByVendor(vendorId : any) {
    var url = this.apiurlNew + 'cashMemo/vendor/'+encodeURIComponent(vendorId);
    const allCMByVendor = await lastValueFrom(this.http.get<any>(url));
    return allCMByVendor;
  }

}
