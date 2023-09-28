import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SettingService {
  apiurl: string = environment.apiurl;

  constructor(private http: HttpClient) {}

  async getSettingsByStore(storeId: any) {
    var url =
      this.apiurl + '/setting/getByStore/' + encodeURIComponent(storeId);
    const settings = await lastValueFrom(this.http.get<any>(url));
    return settings;
  }

  async getSettingsByKeyAndDistributor(key: string, distributorId: any) {
    var url =
      this.apiurl +
      '/setting/getByKeyAndDistributor/' +
      encodeURIComponent(key) +
      '/' +
      encodeURIComponent(distributorId);
    const settings = await lastValueFrom(this.http.get<any>(url));
    return settings;
  }

  async getSettingsByKeyAndStore(key: string, storeId: any) {
    var url =
      this.apiurl +
      '/setting/getByKeyAndStore/' +
      encodeURIComponent(key) +
      '/' +
      encodeURIComponent(storeId);
    const settings = await lastValueFrom(this.http.get<any>(url));
    return settings;
  }
  async getSettings() {
    var url = this.apiurl + '/setting/global';
    const setting = await lastValueFrom(this.http.get<any>(url));
    return setting.content;
  }

  async getSettingByKey(key: string) {
    var url = this.apiurl + '/setting/getByKey/' + encodeURIComponent(key);
    const setting = await lastValueFrom(this.http.get<any>(url));
    return setting;
  }

  async createSetting(setting: any) {
    var url = this.apiurl + '/setting/create';
    const _setting = await lastValueFrom(this.http.post<any>(url, setting));
    return _setting;
  }

  async updateSetting(setting: any) {
    var url =
      this.apiurl + '/setting/update/' + encodeURIComponent(setting.id!);
    const _setting = await lastValueFrom(this.http.put<any>(url, setting));
    return _setting;
  }

  async deleteSetting(setting: any) {
    var url =
      this.apiurl + '/setting/delete/' + encodeURIComponent(setting.id!);
    const _setting = await lastValueFrom(this.http.delete<any>(url));
    return _setting;
  }

  async getPaymentUrl(
    tranId: string,
    storeId: string,
    storeName: string,
    amount: number | undefined
  ) {
    var url =
      this.apiurl +
      '/setting/getUpiUrl?tn=Order Payment&amount=' +
      amount +
      '&pn=' +
      storeName +
      '&storeId=' +
      storeId +
      '&tranid=' +
      tranId;
    const res = await lastValueFrom(
      this.http.get(url, { responseType: 'text' })
    );
    return res;
  }

  async getSplentaUpiUrl(amount: number | undefined, tn: string) {
    var url =
      this.apiurl + '/setting/getSplentaUpiUrl?tn=' + tn + '&amount=' + amount;
    const res = await lastValueFrom(
      this.http.get(url, { responseType: 'text' })
    );
    return res;
  }
}
