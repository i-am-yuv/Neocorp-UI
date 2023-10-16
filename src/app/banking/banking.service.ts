import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BankingService {

  apiurl: string = environment.apiurl;
  apiurlNew:string = environment.apiurlNew ;

  constructor(private http: HttpClient) { }

  async getAllBeneficairy() {
    var url = this.apiurlNew + 'beneficiary';
    const allBeneficairy = await lastValueFrom(this.http.get<any>(url));
    return allBeneficairy;
  }
  
  async createBeneficiary(data: any) {
    var url = this.apiurlNew + 'beneficiary'
    const savedData = await lastValueFrom(this.http.post<any>(url, data));
    return savedData;
  }
}
