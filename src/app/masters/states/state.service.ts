import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { State } from './state';

@Injectable({
  providedIn: 'root'
})
export class StateService {

  apiurl: string = environment.apiurl;

  constructor(private http: HttpClient) { }

  getStates(pageNo: number,
    pageSize: number,
    sortField: any,
    sortDir: any,
    search: string) {
    var url = this.apiurl + '/state/all?pageNo=' + pageNo + '&pageSize=' + pageSize + '&sortField=' + sortField + '&sortDir=' + sortDir + '&search=' + search;
    return this.http.get<any>(url)
      .toPromise()
      .then(data => { return data.content; });
  }
  getStatesData(pageNo: number,
    pageSize: number,
    sortField: any,
    sortDir: any,
    filter: string) {
    var url = this.apiurl + '/state/all?pageNo=' + pageNo + '&pageSize=' + pageSize + '&sortField=' + sortField + '&sortDir=' + sortDir + filter;
    return this.http.get<any>(url)
      .toPromise()
      .then(data => { return data; });
  }
  createState(state: State) {
    var url = this.apiurl + '/state/create'
    return this.http.post<any>(url, state)
      .toPromise()
      // .then(res => <State>res.data)
      .then(data => { return data; });
  }

  updateState(state: State) {
    var url = this.apiurl + '/state/update/' + encodeURIComponent(state.id!);
    return this.http.put<any>(url, state)
      .toPromise()
      // .then(res => <State>res.data)
      .then(data => { return data; });
  }

  deleteState(state: State) {
    var url = this.apiurl + '/state/delete/' + encodeURIComponent(state.id!);
    return this.http.delete<any>(url)
      .toPromise()
      // .then(res => <State>res.data)
      .then(data => { return data; });
  }
}
