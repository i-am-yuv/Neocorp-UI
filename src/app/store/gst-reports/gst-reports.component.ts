import { GstReportServiceService } from './gst-report-service.service';
import { Component, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import * as saveAs from 'file-saver';
import { Store, StoreForm } from 'src/app/masters/stores/store';
import { StoreUserService } from '../store-user/store-user.service';
import { AuthService } from 'src/app/auth/auth.service';
import { MenuItem, MessageService } from 'primeng/api';

@Component({
  selector: 'app-gst-reports',
  templateUrl: './gst-reports.component.html',
  styleUrls: ['./gst-reports.component.scss'],
})
export class GstReportsComponent implements OnInit {
  blob: any;
  form1!: FormGroup;
  form2!: FormGroup;
  form3!: FormGroup;

  fromDate!: String;
  toDate!: String;
  typeofReport: any;
  storeId!: StoreForm;
  submitted!: false;
  home!: MenuItem;
  items: MenuItem[] = [];
  token: any;

  constructor(
    private fb: FormBuilder,
    private gstReportServiceService: GstReportServiceService,
    private storeUserService: StoreUserService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.storeUserService
      .getStore(this.authService.getUserId())
      .then((store) => {
        this.storeId = store.id;
      });
    this.gstReportForm1();
    this.gstReportForm2();
    this.gstReportForm3();

    this.items = [{ label: 'GST Reports' }];
    this.home = { icon: 'pi pi-home', routerLink: '/dashboard' };
  }

  gstReportForm1() {
    this.form1 = this.fb.group({
      fromDate1: ['', Validators.required],
      toDate1: ['', Validators.required],
    });
  }
  gstReportForm2() {
    this.form2 = this.fb.group({
      fromDate2: ['', Validators.required],
      toDate2: ['', Validators.required],
    });
  }
  gstReportForm3() {
    this.form3 = this.fb.group({
      fromDate3: ['', Validators.required],
      toDate3: ['', Validators.required],
    });
  }
  getPdfReport(type: String) {
    const format = 'YYYY-MM-dd';
    const myDate = '2023-02-03';
    const locale = 'en-US';
    this.fromDate = formatDate(
      this.form1.get('fromDate1')!.value,
      format,
      locale
    ).toString();
    this.toDate = formatDate(
      this.form1.get('toDate1')!.value,
      format,
      locale
    ).toString();

    this.token = sessionStorage.getItem('token');

    this.gstReportServiceService
      .getPdf(this.token, this.fromDate, this.toDate, type, this.storeId)
      .subscribe((data: any) => {
        this.blob = new Blob([data], { type: 'application/pdf' });
        var downloadURL = window.URL.createObjectURL(data);
        var link = document.createElement('a');
        link.href = downloadURL;
        link.download = type + '.pdf';
        link.click();
      });
  }

  getExcel(type: String) {
    // if (type == 'gstr2') {
    //   alert('Working in progress');
    // } else {
    const format = 'YYYY-MM-dd';
    const myDate = '2023-02-03';
    const locale = 'en-US';
    this.fromDate = formatDate(
      this.form1.get('fromDate1')!.value,
      format,
      locale
    ).toString();
    this.toDate = formatDate(
      this.form1.get('toDate1')!.value,
      format,
      locale
    ).toString();

    this.gstReportServiceService
      .downloadExcel(type, this.storeId, this.fromDate, this.toDate)
      .subscribe((blob) => saveAs(blob, 'GSTReport1.xlsx'));

    // }
  }
  getPdfReport2(type: String) {
    const format = 'YYYY-MM-dd';
    const myDate = '2023-02-03';
    const locale = 'en-US';
    this.fromDate = formatDate(
      this.form2.get('fromDate2')!.value,
      format,
      locale
    ).toString();
    this.toDate = formatDate(
      this.form2.get('toDate2')!.value,
      format,
      locale
    ).toString();

    this.token = sessionStorage.getItem('token');

    this.gstReportServiceService
      .getPdf(this.token, this.fromDate, this.toDate, type, this.storeId)
      .subscribe((data: any) => {
        this.blob = new Blob([data], { type: 'application/pdf' });
        var downloadURL = window.URL.createObjectURL(data);
        var link = document.createElement('a');
        link.href = downloadURL;
        link.download = type + '.pdf';
        link.click();
      });
  }

  getExcel2(type: String) {
    // if (type == 'gstr2') {
    //   alert('Working in progress');
    // } else {
    const format = 'YYYY-MM-dd';
    const myDate = '2023-02-03';
    const locale = 'en-US';
    this.fromDate = formatDate(
      this.form2.get('fromDate2')!.value,
      format,
      locale
    ).toString();
    this.toDate = formatDate(
      this.form2.get('toDate2')!.value,
      format,
      locale
    ).toString();

    this.gstReportServiceService
      .downloadExcel(type, this.storeId, this.fromDate, this.toDate)
      .subscribe((blob) => saveAs(blob, 'GSTReport2.xlsx'));
    // }
  }
  getPdfReport3(type: String) {
    const format = 'YYYY-MM-dd';
    const myDate = '2023-02-03';
    const locale = 'en-US';
    this.fromDate = formatDate(
      this.form3.get('fromDate3')!.value,
      format,
      locale
    ).toString();
    this.toDate = formatDate(
      this.form3.get('toDate3')!.value,
      format,
      locale
    ).toString();

    this.token = sessionStorage.getItem('token');

    this.gstReportServiceService
      .getPdf(this.token, this.fromDate, this.toDate, type, this.storeId)
      .subscribe((data: any) => {
        this.blob = new Blob([data], { type: 'application/pdf' });
        var downloadURL = window.URL.createObjectURL(data);
        var link = document.createElement('a');
        link.href = downloadURL;
        link.download = type + '.pdf';
        link.click();
      });
  }

  getExcel3(type: String) {
    // if (type == 'gstr2') {
    //   alert('Working in progress');
    // } else {
    const format = 'YYYY-MM-dd';
    const myDate = '2023-02-03';
    const locale = 'en-US';
    this.fromDate = formatDate(
      this.form3.get('fromDate3')!.value,
      format,
      locale
    ).toString();
    this.toDate = formatDate(
      this.form3.get('toDate3')!.value,
      format,
      locale
    ).toString();

    this.gstReportServiceService
      .downloadExcel(type, this.storeId, this.fromDate, this.toDate)
      .subscribe((blob) => saveAs(blob, 'GSTReport3.xlsx'));
    // }
  }
}
