import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfilepageService {

  apiurl: string = environment.apiurl;
  apiurlNew:string = environment.apiurlNew ;

  constructor(private http: HttpClient) { }

  async createProduct(product: any) {
    var url = this.apiurlNew + 'api/product'
    const _product = await lastValueFrom(this.http.post<any>(url, product));
    return _product;
  }

  async createProductCategory(product: any) {
    var url = this.apiurlNew + 'api/productCategory'
    const _productCategory = await lastValueFrom(this.http.post<any>(url, product));
    return _productCategory;
  }

  async getAllCategory()
  {
    var url = this.apiurlNew + 'api/productCategory'
    const _allCategory = await lastValueFrom(this.http.get<any>(url));
    return _allCategory;
  }

  async createBeneficiary(data : any) {
    var url = this.apiurlNew + 'beneficiary'
    const savedData = await lastValueFrom(this.http.post<any>(url , data));
    return savedData;
  }

  async updateBeneficiary(data : any) {
    var url = this.apiurlNew + 'beneficiary'
    const updatedData = await lastValueFrom(this.http.put<any>(url , data));
    return updatedData;
  }

  async getCurrBeneficiary(data : any) {
    var url = this.apiurlNew + 'beneficiary/'+encodeURIComponent(data);
    const getdata = await lastValueFrom(this.http.get<any>(url , data));
    return getdata;
  }

}
