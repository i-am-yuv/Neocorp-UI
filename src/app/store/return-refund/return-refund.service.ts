import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReturnRefundService {

  apiurl: string = environment.apiurl;
  typeOfRequest: any;

  constructor(private http: HttpClient) { }

  async getByOrder(orderId: any) {
    var url = this.apiurl + '/return-refund/getByOrder/' + encodeURIComponent(orderId)
    const returnRefunds = await lastValueFrom(this.http.get<any>(url));
    return returnRefunds;
  }

  async createReturnRefund(returnRefund: any) {
    var url = this.apiurl + '/return-refund/create'
    const _returnRefund = await lastValueFrom(this.http.post<any>(url, returnRefund));
    return _returnRefund;
  }

  async updateReturnRefund(returnRefund: any) {
    var url = this.apiurl + '/return-refund/update/' + encodeURIComponent(returnRefund.id!);
    const _returnRefund = await lastValueFrom(this.http.put<any>(url, returnRefund));
    return _returnRefund;
  }

  async deleteReturnRefund(returnRefund: any) {
    var url = this.apiurl + '/return-refund/delete/' + encodeURIComponent(returnRefund.id!);
    const _returnRefund = await lastValueFrom(this.http.delete<any>(url));
    return _returnRefund;
  }

  async emailDetails(typeOfRequest: any, storeId : any, email : any){
    var url = this.apiurl + '/pdf/sendEmail/' +typeOfRequest +'&storeId='+ encodeURIComponent(storeId) + '&emailAddress=' + email ;
    const emailDtls = await lastValueFrom(this.http.get<any>(url));
    return emailDtls;
}
getTypeOfEmail(typeOfEmail: any) {
  if (typeOfEmail == 'activeStatus') this.typeOfRequest = 'status';
}
}
