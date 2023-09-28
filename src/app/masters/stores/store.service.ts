import { state } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Store } from './store';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  async getStoresByCompany(companyId: any, pageNo: number,
    pageSize: number,
    sortField: any,
    sortDir: any,
    filter: string) {

    var url = this.apiurl + '/store/allByCompany/' + encodeURIComponent(companyId) + '?pageNo=' + pageNo + '&pageSize=' + pageSize + '&sortField=' + sortField + '&sortDir=' + sortDir + filter;
    const stores = await lastValueFrom(this.http.get<any>(url));
    return stores;
  }

  apiurl: string = environment.apiurl;

  constructor(private http: HttpClient) { }

  async getStores() {
    var url = this.apiurl + '/store/all'
    const stores = await lastValueFrom(this.http.get<any>(url));
    return stores.content;
  }


  async getStoresPagination(
    pageNo: number,
    pageSize: number,
    sortField: any,
    sortDir: any,
    search: string,
  ) {
    var url = this.apiurl + '/store/all?pageNo=' + pageNo + '&pageSize=' + pageSize + '&sortField=' + sortField + '&sortDir=' + sortDir + '&search=' + search;
    const stores = await lastValueFrom(this.http.get<any>(url));
    return stores;
  }


  // async getCompanies() {
  //   var url = this.apiurl + '/company/all'
  //   const companies = await lastValueFrom(this.http.get<any>(url));
  //   return companies.content;
  // }
  //   async getCompanies(pageNo: number, pageSize: number,
  //     sortField : any,
  //     sortDir : any,
  //     search: string) {
  //     var url = this.apiurl + '/company/all?pageNo='+ pageNo + '&pageSize=' + pageSize + '&sortField=' + sortField + '&sortDir=' + sortDir +'&search=' + search ;
  //     const res = await lastValueFrom(this.http.get<any>(url));
  //     return res.content;
  // }
  async getCompanies() {
    var url = this.apiurl + '/company/all';
    const res = await lastValueFrom(this.http.get<any>(url));
    return res.content;
  }
  async getStates() {
    var url = this.apiurl + '/state/all'
    const states = await lastValueFrom(this.http.get<any>(url));
    return states.content;
  }
  // getStates(pageNo: number,
  //   pageSize: number,
  //   sortField : any,
  //   sortDir : any,
  //   search: string) {
  //   var url = this.apiurl + '/state/all?pageNo='+ pageNo + '&pageSize=' + pageSize + '&sortField=' + sortField + '&sortDir=' + sortDir +'&search=' + search ;
  //   return this.http.get<any>(url)
  //     .toPromise()
  //     .then(data => { return data.content; });
  // }
  async createStore(store: Store) {
    var url = this.apiurl + '/store/create'
    const state = await lastValueFrom(this.http.post<any>(url, store));
    return state;
  }

  async updateStore(store: Store) {
    var url = this.apiurl + '/store/update/' + encodeURIComponent(store.id!);
    const state = await lastValueFrom(this.http.put<any>(url, store));
    return state;
  }

  async deleteStore(store: Store) {
    var url = this.apiurl + '/store/delete/' + encodeURIComponent(store.id!);
    const state = await lastValueFrom(this.http.delete<any>(url));
    return state;
  }
}
