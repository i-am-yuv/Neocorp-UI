import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  products: string[] = [];

  apiurl: string = environment.apiurl;

  constructor(private http: HttpClient) {}

  async getBrands() {
    var url = this.apiurl + '/brand/all';
    const brands = await lastValueFrom(this.http.get<any>(url));
    return brands.content;
  }

  async getTaxRates(
    pageNo: number,
    pageSize: number,
    sortField: any,
    sortDir: any,
    search: string
  ) {
    var url =
      this.apiurl +
      '/tax-rate/all?pageNo=' +
      pageNo +
      '&pageSize=' +
      pageSize +
      '&sortField=' +
      sortField +
      '&sortDir=' +
      sortDir +
      '&search=' +
      search;
    const taxrates = await lastValueFrom(this.http.get<any>(url));
    return taxrates;
  }

  upload(file: File, data: string): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    var url = this.apiurl + '/product/create';
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
  //   var url = this.apiurl + '/product/update/' + encodeURIComponent(id!);
  //   formData.append('data', data);
  //   formData.append('file', file);
  //   console.log(JSON.stringify(formData));
  //   const req = new HttpRequest('PUT', `${url}`, formData, {
  //     reportProgress: true,
  //     responseType: 'json',
  //   });

  //   return this.http.request(req);
  // }
  async getProductCategories() {
    var url = this.apiurl + '/product-category/all';
    const productCategories = await lastValueFrom(this.http.get<any>(url));
    return productCategories.content;
  }

  async getProducts(
    pageNo: number,
    pageSize: number,
    sortField: any,
    sortDir: any,
    filter: string
  ) {
    var url =
      this.apiurl +
      '/product/all?pageNo=' +
      pageNo +
      '&pageSize=' +
      pageSize +
      '&sortField=' +
      sortField +
      '&sortDir=' +
      sortDir +
      filter;
    const product = await lastValueFrom(this.http.get<any>(url));
    return product;
  }

  async createProduct(product: any) {
    var url = this.apiurl + '/product/create';
    const _product = await lastValueFrom(this.http.post<any>(url, product));
    return _product;
  }

  async updateProduct(product: any) {
    var url =
      this.apiurl + '/product/update/' + encodeURIComponent(product.id!);
    const _product = await lastValueFrom(this.http.put<any>(url, product));
    return _product;
  }

  async deleteProduct(product: any) {
    var url =
      this.apiurl + '/product/delete/' + encodeURIComponent(product.id!);
    const _product = await lastValueFrom(this.http.delete<any>(url));
    return _product;
  }

  async getProductTaxRates(
    pageNo: number,
    pageSize: number,
    sortField: any,
    sortDir: any,
    search: string
  ) {
    var url = this.apiurl + '/tax-rate/all';
    const taxrates = await lastValueFrom(this.http.get<any>(url));
    return taxrates.content;
  }
  async getCatalogTaxRates() {
    var url = this.apiurl + '/tax-rate/all';
    const taxrates = await lastValueFrom(this.http.get<any>(url));
    return taxrates.content;
  }
}
