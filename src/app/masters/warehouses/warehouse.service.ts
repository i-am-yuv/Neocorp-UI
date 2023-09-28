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

  async getWarehouses(pageNo: number,
    pageSize: number,
    sortField : any,
    sortDir : any,
    filter: string) {
    var url = this.apiurl + '/warehouse/all?pageNo='+ pageNo + '&pageSize=' + pageSize + '&sortField=' + sortField + '&sortDir=' + sortDir + filter ;
    const warehouses = await lastValueFrom(this.http.get<any>(url));
    return warehouses;
  }

  async getDistributorsByCompany(id: any) {
    var url = this.apiurl + '/distributor/getByCompany/' + encodeURIComponent(id!);
    const distributors = await lastValueFrom(this.http.get<any>(url));
    return distributors.content;
  }

  async getCompanies() {
    var url = this.apiurl + '/company/all'
    const companies = await lastValueFrom(this.http.get<any>(url));
    return companies.content;
  }

  async getStates() {
    var url = this.apiurl + '/state/all'
    const states = await lastValueFrom(this.http.get<any>(url));
    return states.content;
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
