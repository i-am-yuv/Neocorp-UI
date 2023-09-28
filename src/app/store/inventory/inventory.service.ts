import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Inventory } from './inventory';

@Injectable({
  providedIn: 'root',
})
export class InventoryService {
  apiurl: string = environment.apiurl;

  constructor(private http: HttpClient) { }

  async getInventories(storeId: any, pageNo: number,
    pageSize: number,
    sortField: any,
    sortDir: any,
    filter: string) {
    var url =
      this.apiurl + '/inventory/allbystore/' + encodeURIComponent(storeId) + '?pageNo=' + pageNo + '&pageSize=' + pageSize + '&sortField=' + sortField + '&sortDir=' + sortDir + filter;
    const inventorys = await lastValueFrom(this.http.get<any>(url));
    return inventorys;
  }
  async getWhInventories(warehouseId: string) {
    var url =
      this.apiurl +
      '/inventory/allbywarehouse/' +
      encodeURIComponent(warehouseId);
    const inventorys = await lastValueFrom(this.http.get<any>(url));
    return inventorys.content;
  }

  async getInventoriesByDistributor(distributorId: string,pageNo: number,
    pageSize: number,
    sortField: any,
    sortDir: any,
    filter: string) {
    var url =
      this.apiurl +
      '/inventory/allbydistributor/' +
      encodeURIComponent(distributorId) + '?pageNo=' + pageNo + '&pageSize=' + pageSize + '&sortField=' + sortField + '&sortDir=' + sortDir + filter;
    const inventorys = await lastValueFrom(this.http.get<any>(url));
    return inventorys;
  }
  async createInventory(inventory: Inventory) {
    var url = this.apiurl + '/inventory/create';
    const state = await lastValueFrom(this.http.post<any>(url, inventory));
    return state;
  }

  async updateInventory(inventory: Inventory) {
    var url =
      this.apiurl + '/inventory/update/' + encodeURIComponent(inventory.id!);
    const state = await lastValueFrom(this.http.put<any>(url, inventory));
    return state;
  }

  async deleteInventory(inventory: Inventory) {
    var url =
      this.apiurl + '/inventory/delete/' + encodeURIComponent(inventory.id!);
    const state = await lastValueFrom(this.http.delete<any>(url));
    return state;
  }

  // async pagination(params: any) {
  //   var url = this.apiurl + '/inventory/all??pageSize=' + params.rows + '&pageNo=' + (params.first / 10);
  //   if (params.globalFilter) {
  //     url += '&filter=storeCatalog.product.name~' + encodeURIComponent("'%" + params.globalFilter + "%'")  + encodeURIComponent(" or storage.name~'%" + params.globalFilter + "%'");
  // }
  //   const orders = await lastValueFrom(this.http.get<any>(url));
  //   return orders;
  // }

  async getPagination(
    pageNo: number,
    pageSize: number,
    sortField: any,
    sortDir: any,
    search: string,
  ) {
    var url = this.apiurl + '/inventory/all?pageNo=' + pageNo + '&pageSize=' + pageSize + '&sortField=' + sortField + '&sortDir=' + sortDir + '&search=' + search;
    const stores = await lastValueFrom(this.http.get<any>(url));
    return stores;
  }
}
