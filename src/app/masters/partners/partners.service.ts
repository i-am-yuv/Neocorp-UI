import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Partner } from './partners';
import { lastValueFrom } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class PartnersService {
  apiurl: string = environment.apiurl;

  constructor(private http: HttpClient) { }

  async createPartner(partner: Partner) {
    var url = this.apiurl + '/partners/create';
    const _partnerres = await lastValueFrom(this.http.post<any>(url, partner));
    return _partnerres;
  }

  async updatePartner(_partner: Partner) {
    var url =
      this.apiurl + '/partners/update/' + encodeURIComponent(_partner.id!);
    const _partnerres = await lastValueFrom(this.http.put<any>(url, _partner));
    return _partnerres;
  }

  async getAllPartner(
    pageNo: number,
    pageSize: number,
    sortField: any,
    sortDir: any,
    filter: string
  ) {
    var url =
      this.apiurl + '/partners/all?pageNo=' + pageNo + '&pageSize=' + pageSize + '&sortField=' + sortField + '&sortDir=' + sortDir + filter;
    const _partnerres = await lastValueFrom(this.http.get<any>(url));
    return _partnerres;
  }

  async deletePartner(partner: Partner) {
    var url =
      this.apiurl + '/partners/delete/' + encodeURIComponent(partner.id!);
    const _partner = await lastValueFrom(this.http.delete<any>(url));
    return _partner;
  }
}
