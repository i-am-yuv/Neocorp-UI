import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { lastValueFrom } from "rxjs";
import { environment } from "src/environments/environment";
import { Discount } from "./discount";


@Injectable({
  providedIn: 'root'
})
export class DiscountService {


  apiurl: string = environment.apiurl;

  constructor(private http: HttpClient) { }

  async getDiscountsByStore(storeId: any, pageNo: number,
    pageSize: number,
    sortField: any,
    sortDir: any,
    filter: string) {
    var url = this.apiurl + '/discount/getByStore/' + encodeURIComponent(storeId) + '?pageNo=' + pageNo + '&pageSize=' + pageSize + '&sortField=' + sortField + '&sortDir=' + sortDir + filter;
    const discounts = await lastValueFrom(this.http.get<any>(url));
    return discounts;
  }

  async getDiscounts(storeCatalogId: string) {
    var url = this.apiurl + '/discount/getByStoreCatalog/' + encodeURIComponent(storeCatalogId);
    const discount = await lastValueFrom(this.http.get<any>(url));
    return discount;
  }

  async createDiscount(discount: any) {
    var url = this.apiurl + '/discount/create';
    const _discount = await lastValueFrom(this.http.post<any>(url, discount));
    return _discount;
  }

  async updateDiscount(discount: any) {
    var url = this.apiurl + '/discount/update/' + encodeURIComponent(discount.id!);
    const _discount = await lastValueFrom(this.http.put<any>(url, discount));
    return _discount;
  }

  async deleteDiscount(discount: any) {
    var url = this.apiurl + '/discount/delete/' + encodeURIComponent(discount.id!);
    const _discount = await lastValueFrom(this.http.delete<any>(url));
    return _discount;
  }

  async getDiscountPagination(
    pageNo: number,
    pageSize: number,
    sortField: any,
    sortDir: any,
    search: string
  ) {
    var url = this.apiurl + '/discount/all?pageNo=' + pageNo + '&pageSize=' + pageSize + '&sortField=' + sortField + '&sortDir=' + sortDir + '&search=' + search;
    const stores = await lastValueFrom(this.http.get<any>(url));
    return stores;
  }

}