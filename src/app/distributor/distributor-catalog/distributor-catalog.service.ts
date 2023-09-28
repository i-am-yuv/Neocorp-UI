import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DistributorCatalogService {
  apiurl: string = environment.apiurl;

  constructor(private http: HttpClient) {}

  async getProducts() {
    var url = this.apiurl + '/product/all';
    const brands = await lastValueFrom(this.http.get<any>(url));
    return brands.content;
  }

  async getbydistributor(distributorId: string,pageNo: number,
    pageSize: number,
    sortField : any,
    sortDir : any,
    filter: string) {
    var url =
      this.apiurl +
      '/distributorCatalog/getbydistributor/' +
      encodeURIComponent(distributorId)+'?pageNo='+ pageNo + '&pageSize=' + pageSize + '&sortField=' + sortField + '&sortDir=' + sortDir + filter ;
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

  async getDistributorCatalog(id: string) {
    var url = this.apiurl + '/distributorCatalog/get/' + encodeURIComponent(id);
    const product = await lastValueFrom(this.http.get<any>(url));
    return product;
  }

  async createDistributorCatalog(distributorCatalog: any) {
    var url = this.apiurl + '/distributorCatalog/create';
    const _distributorCatalog = await lastValueFrom(
      this.http.post<any>(url, distributorCatalog)
    );
    return _distributorCatalog;
  }

  async updateDistributorCatalog(distributorCatalog: any) {
    var url =
      this.apiurl +
      '/distributorCatalog/update/' +
      encodeURIComponent(distributorCatalog.id!);
    const _distributorCatalog = await lastValueFrom(
      this.http.put<any>(url, distributorCatalog)
    );
    return _distributorCatalog;
  }

  async deleteDistributorCatalog(distributorCatalog: any) {
    var url =
      this.apiurl +
      '/distributorCatalog/delete/' +
      encodeURIComponent(distributorCatalog.id!);
    const _distributorCatalog = await lastValueFrom(this.http.delete<any>(url));
    return _distributorCatalog;
  }

  downloadTemplate() {
    var url = this.apiurl + '/distributorCatalog/distributorCatalog-template';
    return this.http.get(url, {
      responseType: 'blob',
    });
  }

  exportCSV() {
    var url = this.apiurl + '/distributorCatalog/export';
    return this.http.get(url, {
      responseType: 'blob',
    });
  }
}
