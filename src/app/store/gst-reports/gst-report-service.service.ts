import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GstReportServiceService {
  typeOfReport: any;
  downloadExcel(typeofReport: any, storeId: any, fromDate: any, toDate: any) {
    this.getTypeOfReport(typeofReport);
    // var url =
    //   this.apiurl +
    //   '/invoice/download/'+typeofReport+'?storeId=' + encodeURIComponent(storeId) + '&fromDate=' + fromDate +  '&toDate=' +toDate ;
    // return this.http.get(url, {
    //   responseType: 'blob',
    // });
    var url =
      this.apiurl +
      '/invoice/download/' +
      typeofReport +
      '?fromDate=' +
      fromDate +
      '&toDate=' +
      toDate +
      '&storeId=' +
      encodeURIComponent(storeId);
    return this.http.get(url, {
      responseType: 'blob',
    });
  }
  constructor(private http: HttpClient) {}
  apiurl: string = environment.apiurl;
  getPdf(
    token: any,
    fromDate: String,
    toDate: String,
    typeOfReport: any,
    storeId: any
  ) {
    console.log(
      'fromDate: ' +
        fromDate +
        '   toDate: ' +
        toDate +
        ' typeof report: ' +
        typeOfReport
    );
    var url =
      this.apiurl +
      '/pdf/downloadGSTReports/?token=' +
      token +
      '&fromDate=' +
      fromDate +
      '&toDate=' +
      toDate +
      '&typeOfRequest=' +
      typeOfReport +
      '&storeId=' +
      encodeURIComponent(storeId);

    return this.http.get(url, { responseType: 'blob' });
  }
  getTypeOfReport(typeReport: any) {
    if (typeReport == 'GSTR1') this.typeOfReport = 'gstr1';
    if (typeReport == 'GSTR2') this.typeOfReport = 'gstr2';
    if (typeReport == 'GSTR2A') this.typeOfReport = 'gstr2a';
    if (typeReport == 'GSTR3') this.typeOfReport = 'gstr3';
    if (typeReport == 'DC') this.typeOfReport = 'dc';
  }
}
