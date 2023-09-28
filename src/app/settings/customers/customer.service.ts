import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Customer, CustomerForm } from './customer';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  customers: string[] = [];

  apiurl: string = environment.apiurl;
  apiurlNew:string = environment.apiurlNew ;

  constructor(private http: HttpClient) { }

  async getUsers() {
    var url = this.apiurl + '/user/all'
    const customer = await lastValueFrom(this.http.get<any>(url));
    return customer.content;
  }

  async getCompanies() {
    var url = this.apiurl + '/company/all'
    const customer = await lastValueFrom(this.http.get<any>(url));
    return customer.content;
  }

  async getCustomers(pageNo: number,
    pageSize: number,
    sortField : any,
    sortDir : any,
    filter: string) {
    var url = this.apiurl + '/customer/all?pageNo='+ pageNo + '&pageSize=' + pageSize + '&sortField=' + sortField + '&sortDir=' + sortDir + filter ;
    const customer = await lastValueFrom(this.http.get<any>(url));
    return customer;
  }

  async createCustomer(customer: any) {
    var url = this.apiurlNew + 'customer'
    const _customer = await lastValueFrom(this.http.post<any>(url, customer));
    return _customer;
  }

  async updateCustomer(customer: any) {
    var url = this.apiurl + '/customer/update/' + encodeURIComponent(customer.id!);
    const _customer = await lastValueFrom(this.http.put<any>(url, customer));
    return _customer;
  }

  async deleteCustomer(customer: any) {
    var url = this.apiurl + '/customer/delete/' + encodeURIComponent(customer.id!);
    const _customer = await lastValueFrom(this.http.delete<any>(url));
    return _customer;
  }
}
