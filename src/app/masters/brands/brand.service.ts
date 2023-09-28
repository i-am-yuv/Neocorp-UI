import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, catchError, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Brand } from './brand';

@Injectable({
  providedIn: 'root'
})
export class BrandService {

  apiurl: string = environment.apiurl;

  constructor(private http: HttpClient) { }

  getBrands(pageNo: number,
    pageSize: number,
    sortField : any,
    sortDir : any,
    filter: string) {
    var url = this.apiurl + '/brand/all?pageNo='+ pageNo + '&pageSize=' + pageSize + '&sortField=' + sortField + '&sortDir=' + sortDir + filter ;
    return this.http.get<any>(url)
      .toPromise()
      .then(data => { return data; });
  }

  createBrand(brand: Brand) {
    var url = this.apiurl + '/brand/create'
    return this.http.post<any>(url, brand)
      .toPromise()
      // .then(res => <Brand>res.data)
      .then(data => { return data; });
  }

  updateBrand(brand: Brand) {
    var url = this.apiurl + '/brand/update/' + encodeURIComponent(brand.id!);
    return this.http.put<any>(url, brand)
      .toPromise()
      // .then(res => <Brand>res.data)
      .then(data => { return data; });
  }

  deleteBrand(brand: Brand) {
    var url = this.apiurl + '/brand/delete/' + encodeURIComponent(brand.id!);
    return this.http.delete<any>(url)
      .toPromise()
      // .then(res => <Brand>res.data)
      .then(data => { return data; });

  }
}
