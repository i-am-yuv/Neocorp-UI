import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Posmachine } from './posmachine';

@Injectable({
  providedIn: 'root'
})
export class PosmachineService {

  apiurl: string = environment.apiurl;

  constructor(private http: HttpClient) { }

  async getPosMachines(storeId: string,pageNo: number,pageSize: number, sortField: any,sortDir: any,filter: string) {
    var url = this.apiurl + '/posMachine/allbystore/' + encodeURIComponent(storeId)+'?pageNo='+  pageNo + '&pageSize=' + pageSize + '&sortField=' + sortField + '&sortDir=' + sortDir+ filter; 
    const posmachines = await lastValueFrom(this.http.get<any>(url));
    return posmachines;
  }


  async createPosmachine(posmachine: Posmachine) {
    var url = this.apiurl + '/posMachine/create'
    const state = await lastValueFrom(this.http.post<any>(url, posmachine));
    return state;
  }

  async updatePosmachine(posmachine: Posmachine) {
    var url = this.apiurl + '/posMachine/update/' + encodeURIComponent(posmachine.id!);
    const state = await lastValueFrom(this.http.put<any>(url, posmachine));
    return state;
  }

  async deletePosmachine(posmachine: Posmachine) {
    var url = this.apiurl + '/posMachine/delete/' + encodeURIComponent(posmachine.id!);
    const state = await lastValueFrom(this.http.delete<any>(url));
    return state;
  }
}
