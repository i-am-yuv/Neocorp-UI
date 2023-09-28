import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Warehouse } from '../warehouses/warehouse';

@Injectable({
  providedIn: 'root'
})
export class WarehouseService {

  apiurl: string = environment.apiurl;

  constructor(private http: HttpClient) { }

  async getWarehousesByCompany(company: any) {
    var url = this.apiurl + '/warehouse/allByCompany/' + encodeURIComponent(company.id);
    const warehouses = await lastValueFrom(this.http.get<any>(url));
    return warehouses.content;
  }

  async getWarehousesByDistributor(distributor: any, pageNo: number,
    pageSize: number,
    sortField : any,
    sortDir : any,
    filter: string) {
    var url = this.apiurl + '/warehouse/allByDistributor/' + encodeURIComponent(distributor.id)+ '?pageNo='+ pageNo + '&pageSize=' + pageSize + '&sortField=' + sortField + '&sortDir=' + sortDir + filter ;
    const warehouses = await lastValueFrom(this.http.get<any>(url));
    return warehouses;
  }
  async getCompanies() {
    var url = this.apiurl + '/company/all'
    const companies = await lastValueFrom(this.http.get<any>(url));
    return companies.content;
  }
  getStates(pageNo: number,
    pageSize: number,
    sortField: any,
    sortDir: any,
    search: string) {
    var url = this.apiurl + '/state/all?pageNo=' + pageNo + '&pageSize=' + pageSize + '&sortField=' + sortField + '&sortDir=' + sortDir + '&search=' + search;
    return this.http.get<any>(url)
        .toPromise()
        .then(data => { return data.content; });
}
  async createWarehouse(warehouse: Warehouse) {
    var url = this.apiurl + '/warehouse/create'
    const state = await lastValueFrom(this.http.post<any>(url, warehouse));
    return state;
  }

  async updateWarehouse(warehouse: Warehouse) {
    var url = this.apiurl + '/warehouse/update/' + encodeURIComponent(warehouse.id!);
    const state = await lastValueFrom(this.http.put<any>(url, warehouse));
    return state;
  }

  async deleteWarehouse(warehouse: Warehouse) {
    var url = this.apiurl + '/warehouse/delete/' + encodeURIComponent(warehouse.id!);
    const state = await lastValueFrom(this.http.delete<any>(url));
    return state;
  }
}
