import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { GoodsReceiptLine } from './goods-receipt-line';

@Injectable({
    providedIn: 'root'
})
export class GoodsReceiptLineService {

    async getPoLines(orderId: any) {
        var url = this.apiurl + '/purchase-order-line/getByPurchaseOrder/' + encodeURIComponent(orderId);
        const pols = await lastValueFrom(this.http.get<any>(url));
        return pols;
    }

    apiurl: string = environment.apiurl;


    constructor(private http: HttpClient) { }

    async getStoreCatalogByStore(storeId: string) {
        var url = this.apiurl + '/storeCatalog/getbystore/' + encodeURIComponent(storeId);
        const product = await lastValueFrom(this.http.get<any>(url));
        return product.content;
    }

    async getByGoodsReceipt(id: string) {
        var url = this.apiurl + '/goods-receipt-lines/getByGoodsReceipt/' + encodeURIComponent(id!);
        const grs = await lastValueFrom(this.http.get<any>(url));
        return grs.content;
    }

    async deleteGoodsReceiptLine(id: string) {
        var url = this.apiurl + '/goods-receipt-lines/delete/' + encodeURIComponent(id);
        const stores = await lastValueFrom(this.http.delete<any>(url));
        return stores.content;
    }

    async createGoodsReceiptLine(goodsReceiptLine: GoodsReceiptLine) {
        var url = this.apiurl + '/goods-receipt-lines/create'
        const pol = await lastValueFrom(this.http.post<any>(url, goodsReceiptLine));
        return pol;
    }

    async updateGoodsReceiptLine(goodsReceiptLine: GoodsReceiptLine) {
        var url = this.apiurl + '/goods-receipt-lines/update/' + encodeURIComponent(goodsReceiptLine.id!);
        const pol = await lastValueFrom(this.http.put<any>(url, goodsReceiptLine));
        return pol;
    }


}