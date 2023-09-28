import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class StoreCatalogService {
  apiurl: string = environment.apiurl;

  constructor(private http: HttpClient) {}

  async getProducts() {
    var url = this.apiurl + '/product/all';
    const brands = await lastValueFrom(this.http.get<any>(url));
    return brands.content;
  }
  async getDistributors(productId: any) {
    var url =
      this.apiurl +
      '/distributor/getByProduct/' +
      encodeURIComponent(productId);
    const distributors = await lastValueFrom(this.http.get<any>(url));
    return distributors;
  }
  async getDistributorCatalogs(productId: any) {
    var url =
      this.apiurl +
      '/distributorCatalog/getDistributorCatalogByProduct/' +
      encodeURIComponent(productId);
    const distributorCatalogs = await lastValueFrom(this.http.get<any>(url));
    return distributorCatalogs;
  }

  async getDistributorCatalog(productId: string, distId: string) {
    var url =
      this.apiurl +
      '/distributorCatalog/getDistributorCatalogByProductAndDistributor/' +
      encodeURIComponent(productId) +
      '/' +
      encodeURIComponent(distId);
    const distributorCatalogs = await lastValueFrom(this.http.get<any>(url));
    return distributorCatalogs;
  }

  async getBrands() {
    var url = this.apiurl + '/brand/all';
    const brands = await lastValueFrom(this.http.get<any>(url));
    return brands.content;
  }

  async getTaxRates() {
    var url = this.apiurl + '/tax-rate/all';
    const taxrates = await lastValueFrom(this.http.get<any>(url));
    return taxrates.content;
  }

  async getProductCategories() {
    var url = this.apiurl + '/product-category/all';
    const productCategories = await lastValueFrom(this.http.get<any>(url));
    return productCategories.content;
  }

  async getStoreCatalog(id: string) {
    var url = this.apiurl + '/storeCatalog/get/' + encodeURIComponent(id);
    const product = await lastValueFrom(this.http.get<any>(url));
    return product;
  }

  async getStoreCatalogByStore(
    storeId: any,
    pageNo: number,
    pageSize: number,
    sortField: any,
    sortDir: any,
    filter: string
  ) {
    var url =
      this.apiurl +
      '/storeCatalog/getbystore/' +
      encodeURIComponent(storeId) +
      '?pageNo=' +
      pageNo +
      '&pageSize=' +
      pageSize +
      '&sortField=' +
      sortField +
      '&sortDir=' +
      sortDir +
      filter;
    const product = await lastValueFrom(this.http.get<any>(url));
    //
    return product;
  }
  async getStoreCatalogByStoreExcel(storeId: string) {
    var url =
      this.apiurl + '/storeCatalog/getbystore/' + encodeURIComponent(storeId);
    const product = await lastValueFrom(this.http.get<any>(url));
    return product;
  }

  async createStoreCatalog(storeCatalog: any) {
    var url = this.apiurl + '/storeCatalog/createwithoutFile';
    const _storeCatalog = await lastValueFrom(
      this.http.post<any>(url, storeCatalog)
    );
    return _storeCatalog;
  }
  upload(file: File, data: string): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    var url = this.apiurl + '/storeCatalog/create';
    formData.append('data', data);
    formData.append('file', file);
    console.log(JSON.stringify(formData));
    const req = new HttpRequest('POST', `${url}`, formData, {
      reportProgress: true,
      responseType: 'json',
    });

    return this.http.request(req);
  }

  // uploadUpdate(file: File, data: string, id: any): Observable<HttpEvent<any>> {
  //   const formData: FormData = new FormData();
  //   var url = this.apiurl + '/storeCatalog/update/' + encodeURIComponent(id!);
  //   formData.append('data', data);
  //   formData.append('file', file);
  //   console.log(JSON.stringify(formData));
  //   const req = new HttpRequest('PUT', `${url}`, formData, {
  //     reportProgress: true,
  //     responseType: 'json',
  //   });

  //   return this.http.request(req);
  // }

  async updateStoreCatalog(storeCatalog: any) {
    var url =
      this.apiurl +
      '/storeCatalog/update/' +
      encodeURIComponent(storeCatalog.id!);
    const _storeCatalog = await lastValueFrom(
      this.http.put<any>(url, storeCatalog)
    );
    return _storeCatalog;
  }

  async deleteStoreCatalog(storeCatalog: any) {
    var url =
      this.apiurl +
      '/storeCatalog/delete/' +
      encodeURIComponent(storeCatalog.id!);
    const _storeCatalog = await lastValueFrom(this.http.delete<any>(url));
    return _storeCatalog;
  }
  downloadTemplate() {
    var url = this.apiurl + '/storeCatalog/storeCatalog-template';
    return this.http.get(url, {
      responseType: 'blob',
    });
  }

  exportCSV() {
    var url = this.apiurl + '/storeCatalog/export';
    return this.http.get(url, {
      responseType: 'blob',
    });
  }

  // async searchOrder(params : any) {
  //   var url = this.apiurl + '/product/all?pageSize' + params.rows + '&pageNo=' + (params.first / 10);
  //   if (params.globalFilter) {
  //     url += '&filter=name~' + encodeURIComponent("'%" + params.globalFilter + "%'");
  // }
  //   const product = await lastValueFrom(this.http.get<any>(url));
  //   return product;
  // }

  async getPagination(
    pageNo: number,
    pageSize: number,
    sortField: any,
    sortDir: any,
    search: string
  ) {
    var url =
      this.apiurl +
      '/storeCatalog/all?pageNo=' +
      pageNo +
      '&pageSize=' +
      pageSize +
      '&sortField=' +
      sortField +
      '&sortDir=' +
      sortDir +
      '&search=' +
      search;
    const stores = await lastValueFrom(this.http.get<any>(url));
    return stores;
  }
}
