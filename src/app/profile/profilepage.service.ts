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

  async getAllProduct(user : any) {
    var url = this.apiurlNew + 'api/product/product/'+ encodeURIComponent(user.id);
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

  async getAllProductCategory(user : any) {
    var url = this.apiurlNew + 'api/productCategory/productCategory/' +  encodeURIComponent(user.id) ;
    const allCategory = await lastValueFrom(this.http.get<any>(url));
    return allCategory;
  }

  async getProductCategoryById(id: any) {
    var url = this.apiurlNew + 'api/productCategory/' +  encodeURIComponent(id) ;
    const allCategory = await lastValueFrom(this.http.get<any>(url));
    return allCategory;
  }

  async updateProductCategory(productCategory: any ) {
    var url = this.apiurlNew + 'api/productCategory';
    const updateProduct = await lastValueFrom(this.http.put<any>(url, productCategory));
    return updateProduct;
  }

  async searchProduct( query: any) {
    // var url = this.apiurl + 'api/PurchaseOrder??filter=vendor.id~' + encodeURIComponent("'%" + vendorId + "%'") + encodeURIComponent(" and  status~'%" + status + "%' and orderNumber~'%" + query + "%'");
     
    var url = this.apiurlNew + 'api/product?filter=searchKey~' + encodeURIComponent("'%" + query + "%'") + encodeURIComponent(" or  name~'%" + query + "%' or model~'%" + query + "%' or productType~'%" + query + "%'or mrp~'%" + query + "%'");
     const filteredProducts = await lastValueFrom(this.http.get<any>(url));
     return filteredProducts;
   }

   async searchProductCategory( query: any) {
    // var url = this.apiurl + 'api/PurchaseOrder??filter=vendor.id~' + encodeURIComponent("'%" + vendorId + "%'") + encodeURIComponent(" and  status~'%" + status + "%' and orderNumber~'%" + query + "%'");
     
    var url = this.apiurlNew + 'api/productCategory?filter=searchKey~' + encodeURIComponent("'%" + query + "%'") + encodeURIComponent(" or  name~'%" + query + "%'");
     const filteredProductCategories = await lastValueFrom(this.http.get<any>(url));
     return filteredProductCategories;
   }

}
