import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  apiurl: string = environment.apiurl;

  constructor(private http: HttpClient) { }

  async getByUser(userId: any) {
    var url = this.apiurl + '/notifications/getByUser/' + userId;
    const res = await lastValueFrom(this.http.get<any>(url));
    return res.content;
  }
}
