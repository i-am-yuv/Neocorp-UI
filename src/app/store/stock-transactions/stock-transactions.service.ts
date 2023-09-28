import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StockTransactionsService {

  apiurl: string = environment.apiurl;

  constructor(private http: HttpClient) { }

  async getByStore(storeId: any, pageNo: number,
    pageSize: number,
    sortField : any,
    sortDir : any,
    filter: string) {
    var url = this.apiurl + '/stock-transactions/getByStore/' + encodeURIComponent(storeId)+ '?pageNo='+ pageNo + '&pageSize=' + pageSize + '&sortField=' + sortField + '&sortDir=' + sortDir + filter ;
    const transactions = await lastValueFrom(this.http.get<any>(url));
    return transactions;
  }
}
