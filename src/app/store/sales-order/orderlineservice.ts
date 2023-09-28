import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { lastValueFrom } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
})
export class OrderLineService {

    apiurl: string = environment.apiurl;

    constructor(private http: HttpClient) { }

    async getOrderLines() {
        var url = this.apiurl + '/order-lines/all'
        const orderLine = await lastValueFrom(this.http.get<any>(url));
        return orderLine.content;
    }

    async getByOrder(orderId: any) {
        var url = this.apiurl + '/order-lines/getByOrder/' + encodeURIComponent(orderId);
        const orderLines = await lastValueFrom(this.http.get<any>(url));
        return orderLines;
    }

    async createOrderLine(orderLine: any) {
        var url = this.apiurl + '/order-lines/create'
        const _orderLine = await lastValueFrom(this.http.post<any>(url, orderLine));
        return _orderLine;
    }

    async updateOrderLine(orderLine: any) {
        var url = this.apiurl + '/order-lines/update/' + encodeURIComponent(orderLine.id!);
        const _orderLine = await lastValueFrom(this.http.put<any>(url, orderLine));
        return _orderLine;
    }

    async deleteOrderLine(orderLine: any) {
        var url = this.apiurl + '/order-lines/delete/' + encodeURIComponent(orderLine.id!);
        const _orderLine = await lastValueFrom(this.http.delete<any>(url));
        return _orderLine;
    }
}