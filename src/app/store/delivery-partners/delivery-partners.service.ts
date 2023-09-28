import { state } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class DeliveryPartnersService {
  apiurl: string = environment.apiurl;

  constructor(private http: HttpClient) {}

  async getDeliveryAgencies(storeId: any) {
    var url =
      this.apiurl +
      'deliveryPartner/getByStoreID/' +
      encodeURIComponent(storeId);
    const deliveryAgencies = await lastValueFrom(this.http.get<any>(url));
    console.log(deliveryAgencies.conent);
    return deliveryAgencies.content;
  }
}
