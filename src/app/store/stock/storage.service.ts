import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Storage } from './storage';


@Injectable({
  providedIn: 'root'
})
export class StorageService {



  apiurl: string = environment.apiurl;

  constructor(private http: HttpClient) { }

  async getStorageByStoreCatalog(storeCatalogId: string) {
    var url = this.apiurl + '/storage/getByStoreCatalog/' + encodeURIComponent(storeCatalogId);
    const storage = await lastValueFrom(this.http.get<any>(url));
    return storage;
  }

  async getStorageByDistributorCatalog(distributorCatalogId: string, warehouseId: string) {
    var url = this.apiurl + '/storage/getStorageByDistributorCatalog/' + encodeURIComponent(distributorCatalogId) + '/' + encodeURIComponent(warehouseId);
    const storage = await lastValueFrom(this.http.get<any>(url));
    return storage;
  }


  async getStoreStorages(storeId: string,pageNo: any, pageSize: number,
    sortField : any,
    sortDir : any,
    filter: string) {
    var url = this.apiurl + '/storage/getByStore/' + encodeURIComponent(storeId)+'?pageNo=' + pageNo+ '&pageSize=' + pageSize + '&sortField=' + sortField + '&sortDir=' + sortDir + filter;
    const storages = await lastValueFrom(this.http.get<any>(url));
    return storages;
  }

  async getWhStorages(warehouseId: string) {
    var url = this.apiurl + '/storage/getByWarehouse/' + encodeURIComponent(warehouseId);
    const storages = await lastValueFrom(this.http.get<any>(url));
    return storages.content;
  }

  async getStockByDistributor(id: any, pageNo: number,
		pageSize: number,
		sortField : any,
		sortDir : any,
		filter: string) {
    var url = this.apiurl + '/storage/getWarehousesStockByDistributor/' + encodeURIComponent(id)+ '?pageNo='+ pageNo + '&pageSize=' + pageSize + '&sortField=' + sortField + '&sortDir=' + sortDir + filter ;
    const storages = await lastValueFrom(this.http.get<any>(url));
    return storages;
  }

  async getAllStoreStorages(distributorId: any, pageNo: number,
		pageSize: number,
		sortField : any,
		sortDir : any,
		filter: string) {
    var url = this.apiurl + '/storage/getStoreStockByDistributor/' + encodeURIComponent(distributorId)+'?pageNo='+ pageNo + '&pageSize=' + pageSize + '&sortField=' + sortField + '&sortDir=' + sortDir + filter ;
    const storages = await lastValueFrom(this.http.get<any>(url));
    return storages;
  }

}
