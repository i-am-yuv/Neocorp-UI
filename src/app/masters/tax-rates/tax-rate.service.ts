import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { TaxRate } from '../tax-rates/tax-rate';

@Injectable({
  providedIn: 'root'
})
export class TaxRateService {

  apiurl: string = environment.apiurl;

  constructor(private http: HttpClient) { }

  getTaxRates(pageNo: number,
    pageSize: number,
    sortField : any,
    sortDir : any,
    filter: string) {
    var url = this.apiurl + '/tax-rate/all?pageNo='+ pageNo + '&pageSize=' + pageSize + '&sortField=' + sortField + '&sortDir=' + sortDir + filter ;
    return this.http.get<any>(url)
      .toPromise()
      .then(data => { return data; });
  }

  createTaxRate(taxRate: TaxRate) {
    var url = this.apiurl + '/tax-rate/create'
    return this.http.post<any>(url, taxRate)
      .toPromise()
      // .then(res => <TaxRate>res.data)
      .then(data => { return data; });
  }

  updateTaxRate(taxRate: TaxRate) {
    var url = this.apiurl + '/tax-rate/update/' + encodeURIComponent(taxRate.id!);
    return this.http.put<any>(url, taxRate)
      .toPromise()
      // .then(res => <TaxRate>res.data)
      .then(data => { return data; });
  }

  deleteTaxRate(taxRate: TaxRate) {
    var url = this.apiurl + '/tax-rate/delete/' + encodeURIComponent(taxRate.id!);
    return this.http.delete<any>(url)
      .toPromise()
      // .then(res => <TaxRate>res.data)
      .then(data => { return data; });
  }
}
