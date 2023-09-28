import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { lastValueFrom } from "rxjs";
import { environment } from "src/environments/environment";
import { Order } from "./order";

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  apiurl: string = environment.apiurl;
  typeOfRequest: any;

  constructor(private http: HttpClient) { }

  async confirmOrder(order: Order) {
    var url = this.apiurl + '/order/confirm/' + encodeURIComponent(order.id!);
    const res = await lastValueFrom(this.http.get<any>(url));
    return res;
  }
  async getOrders(storeId: string, status: string) {
    var url = this.apiurl + '/order/getbystore/' + encodeURIComponent(storeId) + '?status=' + status;
    const order = await lastValueFrom(this.http.get<any>(url));
    return order;
  }

  async getDraftOrder(id: any) {
    var url = this.apiurl + '/order/getbymachine/' + encodeURIComponent(id);
    const order = await lastValueFrom(this.http.get<any>(url));
    return order;
  }

  async createOrder(order: any, machineId: string) {
    var url = this.apiurl + '/order/createByMachine/' + encodeURIComponent(machineId);
    const _order = await lastValueFrom(this.http.post<any>(url, order));
    return _order;
  }

  async updateOrder(order: any) {
    var url = this.apiurl + '/order/update/' + encodeURIComponent(order.id!);
    const _order = await lastValueFrom(this.http.put<any>(url, order));
    return _order;
  }

  async deleteOrder(order: any) {
    var url = this.apiurl + '/order/delete/' + encodeURIComponent(order.id!);
    const _order = await lastValueFrom(this.http.delete<any>(url));
    return _order;
  }

  generateId() {
    let text = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
  }

  async emailDetails(token: any, typeOfRequest: any, orderId: any, email: String) {
    var url = this.apiurl + '/pdf/sendEmail/' + '?token=' + token + '&typeOfRequest=' + typeOfRequest + '&orderId=' + encodeURIComponent(orderId) + '&email=' + email;
    const emailDtls = await lastValueFrom(this.http.get<any>(url));
    return emailDtls;
  }
  getTypeOfEmail(typeOfEmail: any) {
    if (typeOfEmail == 'activeStatus') this.typeOfRequest = 'SALESORDER';
  }


  async processCancelOrder(status: string, id: any) {
    var url = this.apiurl + '/order/' + status + '/' + encodeURIComponent(id);
    const po = await lastValueFrom(this.http.get<any>(url));
    return po;
  }

  async processConfirmOrder(status: string, id: any) {
    var url = this.apiurl + '/order/' + status + '/' + encodeURIComponent(id);
    const po = await lastValueFrom(this.http.post<any>(url, {}));
    return po;
  }

}
