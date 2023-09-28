import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { environment } from 'src/environments/environment';
import { Users } from './users';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  apiurl: string = environment.apiurl;

  constructor(private http: HttpClient) {}

  getUser(
    pageNo: number,
    pageSize: number,
    sortField: any,
    sortDir: any,
    search: string
  ) {
    var url =
      this.apiurl +
      '/users?pageNo=' +
      pageNo +
      '&pageSize=' +
      pageSize +
      '&sortField=' +
      sortField +
      '&sortDir=' +
      sortDir +
      '&search=' +
      search;
    console.log('url: ' + url);
    return this.http
      .get<any>(url)
      .toPromise()
      .then((data) => {
        return data.content;
      });
  }
  getUserData(
    pageNo: number,
    pageSize: number,
    sortField: any,
    sortDir: any,
    filter: string
  ) {
    var url =
      this.apiurl +
      '/users?pageNo=' +
      pageNo +
      '&pageSize=' +
      pageSize +
      '&sortField=' +
      sortField +
      '&sortDir=' +
      sortDir +
      filter;
    return this.http
      .get<any>(url)
      .toPromise()
      .then((data) => {
        // console.log(JSON.stringify(data));
        return data;
      });
  }
  createUser(users: Users) {
    var url = this.apiurl + '/users';
    return (
      this.http
        .post<any>(url, users)
        .toPromise()
        // .then(res => <users>res.data)
        .then((data) => {
          return data;
        })
    );
  }

  updateUser(users: Users) {
    var url = this.apiurl + '/users';
    return (
      this.http
        .put<any>(url, users)
        .toPromise()
        // .then(res => <users>res.data)
        .then((data) => {
          return data;
        })
    );
  }

  deleteUser(users: Users) {
    var url = this.apiurl + '/users/' + encodeURIComponent(users.id!);
    return (
      this.http
        .delete<any>(url)
        .toPromise()
        // .then(res => <users>res.data)
        .then((data) => {
          return data;
        })
    );
  }
}
