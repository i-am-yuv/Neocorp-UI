import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

import { ProductCategories } from './product-categories';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProductCategoriesService {
  apiurl: string = environment.apiurl;

  constructor(private http: HttpClient) {}

  getProductCategoriess(
    pageNo: number,
    pageSize: number,
    sortField: any,
    sortDir: any,
    filter: string
  ) {
    var url =
      this.apiurl +
      '/product-category/all?pageNo=' +
      pageNo +
      '&pageSize=' +
      pageSize +
      '&sortField=' +
      sortField +
      '&sortDir=' +
      sortDir +
      filter;
    return this.http
      .get<any>(url)
      .toPromise()
      .then((data) => {
        return data;
      });
  }

  createProductCategories(productCategories: string, file: File) {
    var url = this.apiurl + '/product-category/create';
    const formData: FormData = new FormData();
    formData.append('data', productCategories);
    formData.append('file', file);
    //console.log(JSON.stringify(formData));

    return (
      this.http
        .post<any>(url, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .toPromise()
        // .then(res => <ProductCategories>res.data)
        .then((data) => {
          return data;
        })
    );
  }

  updateProductCategories(productCategories: string, file: File) {
    var url =
      this.apiurl +
      '/product-category/update/' +
      encodeURIComponent(productCategories);
    const formData: FormData = new FormData();
    formData.append('data', productCategories);
    formData.append('file', file);
    console.log(JSON.stringify(formData));

    return (
      this.http
        .put<any>(url, formData)
        .toPromise()
        // .then(res => <ProductCategories>res.data)
        .then((data) => {
          return data;
        })
    );
  }

  deleteProductCategories(productCategories: ProductCategories) {
    var url =
      this.apiurl +
      '/product-category/delete/' +
      encodeURIComponent(productCategories.id!);
    return (
      this.http
        .delete<any>(url)
        .toPromise()
        // .then(res => <ProductCategories>res.data)
        .then((data) => {
          return data;
        })
    );
  }
  upload(file: File, data: string): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    var url = this.apiurl + '/product-category/create';
    formData.append('data', data);
    formData.append('file', file);
    console.log(JSON.stringify(formData));
    const req = new HttpRequest('POST', `${url}`, formData, {
      reportProgress: true,
      responseType: 'json',
    });

    return this.http.request(req);
  }

  uploadUpdate(
    file: File,
    data: string,
    productCategoriesId: any
  ): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    var url =
      this.apiurl +
      '/product-category/updatee/' +
      encodeURIComponent(productCategoriesId);
    formData.append('data', data);
    formData.append('file', file);
    console.log(JSON.stringify(formData));
    const req = new HttpRequest('PUT', `${url}`, formData, {
      reportProgress: true,
      responseType: 'json',
    });

    return this.http.request(req);
  }
}
