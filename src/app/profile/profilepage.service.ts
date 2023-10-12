import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfilepageService {

  apiurl: string = environment.apiurl;
  apiurlNew: string = environment.apiurlNew;

  constructor(private http: HttpClient) { }

  async createProduct(product: any) {
    var url = this.apiurlNew + 'api/product'
    const _product = await lastValueFrom(this.http.post<any>(url, product));
    return _product;
  }

  async getAllProduct() {
    var url = this.apiurlNew + 'api/product'
    const allProduct = await lastValueFrom(this.http.get<any>(url));
    return allProduct;
  }

  async getProductById(id: any) {
    var url = this.apiurlNew + 'api/product/' + encodeURIComponent(id);
    const productById = await lastValueFrom(this.http.get<any>(url));
    return productById;
  }

  async updateProduct(product: any ) {
    var url = this.apiurlNew + 'api/product';
    const updateProduct = await lastValueFrom(this.http.put<any>(url, product));
    return updateProduct;
  }

  async createProductCategory(product: any) {
    var url = this.apiurlNew + 'api/productCategory'
    const _productCategory = await lastValueFrom(this.http.post<any>(url, product));
    return _productCategory;
  }

  async getAllProductCategory() {
    var url = this.apiurlNew + 'api/productCategory'
    const allCategory = await lastValueFrom(this.http.get<any>(url));
    return allCategory;
  }

  async getProductCategoryById(id: any) {
    var url = this.apiurlNew + 'api/productCategory/' +  encodeURIComponent(id) 
    const allCategory = await lastValueFrom(this.http.get<any>(url));
    return allCategory;
  }

  async updateProductCategory(productCategory: any ) {
    var url = this.apiurlNew + 'api/productCategory';
    const updateProduct = await lastValueFrom(this.http.put<any>(url, productCategory));
    return updateProduct;
  }

  async createBeneficiary(data: any) {
    var url = this.apiurlNew + 'beneficiary'
    const savedData = await lastValueFrom(this.http.post<any>(url, data));
    return savedData;
  }

  async updateBeneficiary(data: any) {
    var url = this.apiurlNew + 'beneficiary'
    const updatedData = await lastValueFrom(this.http.put<any>(url, data));
    return updatedData;
  }

  async getCurrBeneficiary(data: any) {
    var url = this.apiurlNew + 'beneficiary/' + encodeURIComponent(data);
    const getdata = await lastValueFrom(this.http.get<any>(url, data));
    return getdata;
  }

}
