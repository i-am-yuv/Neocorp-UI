import { formatDate } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as saveAs from 'file-saver';
import {
  MessageService,
  ConfirmationService,
  MenuItem,
  LazyLoadEvent,
} from 'primeng/api';
import { Table } from 'primeng/table';
import { AuthService } from 'src/app/auth/auth.service';
import { DistributorUserService } from 'src/app/distributor/distributor-user/distributor-user.service';
import { FilterBuilder } from 'src/app/utils/FilterBuilder';
import { GoodsShipment } from './goods-shipment';
import { GoodsShipmentService } from './goods-shipment.service';

@Component({
  selector: 'app-goods-shipment',
  templateUrl: './goods-shipment.component.html',
  styleUrls: ['./goods-shipment.component.scss'],
})
export class GoodsShipmentComponent implements OnInit {
  goodsShipment: GoodsShipment = {};

  goodsShipmentDialog!: boolean;

  goodsShipments!: GoodsShipment[];
  deliveryChallan: boolean = false;

  selectedGoodsShipments!: any;

  distributors: any[] = [];
  pageNo: number = 0;
  pageSize: number = 10;
  sortField: string = '';
  sortDir: string = 'DESC';
  search: string = '';
  form!: FormGroup;

  distributorCatalogs: any[] = [];
  home!: MenuItem;
  items: MenuItem[] = [];

  submitted!: boolean;
  gstReportDialog!: boolean;
  fromDate!: String;
  toDate!: String;

  @ViewChild('dt') dt: Table | undefined;
  totalRecords: any;
  goodsShipmentsData: any;
  token: any;
  blob: any;
  typeofReport: any;

  constructor(
    private authService: AuthService,
    private distributorUserService: DistributorUserService,
    private goodsShipmentService: GoodsShipmentService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.items = [{ label: 'Goods Shipment' }];
    this.home = { icon: 'pi pi-home', routerLink: '/dashboard' };
    // this.distributorUserService.getCurrentDistributor().then((data: any) => {
    //   this.goodsShipmentService.getGoodsShipmentByDistributor(data.distributor.id).then(data => this.goodsShipments = data);
    // });
  }
  loadPage(event: LazyLoadEvent) {
    if (event.globalFilter) {
      this.search = event.globalFilter.target.value;
    }
    this.getFilter(this.search);
    this.pageNo = event.first! / 10;
    this.pageSize = event.rows!;
    if (event.sortField) {
      this.sortField = event.sortField;
    }
    this.sortDir = event.sortOrder! > 0 ? 'DESC' : 'ASC';
    this.gstReportForm();
  }
  getFilter(searchString: string) {
    this.search = searchString;
    this.distributorUserService.getCurrentDistributor().then((data: any) => {
      var filter = '';
      if (this.search !== '') {
        var filtercols = [
          'documentno',
          'purchaseOrder.documentnumber',
          'shipmentDate',
          'status',
        ];
        filter = FilterBuilder.build(filtercols, this.search);
      }
      this.goodsShipmentService
        .getGoodsShipmentByDistributor(
          data.distributor.id,
          this.pageNo,
          this.pageSize,
          this.sortField,
          this.sortDir,
          filter
        )
        .then((data) => {
          this.goodsShipments = data;
          if (data) {
            this.goodsShipments = data.content;
            this.totalRecords = data.totalElements;
          }
        });
    });
  }

  openNew() {
    this.router.navigate(['/distributor/goods-shipment/create']);
  }

  deleteSelectedGoodsShipments() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected GoodsShipments?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        var counter = 0;
        var success = 0;
        var selected = this.selectedGoodsShipments.length;
        this.selectedGoodsShipments.forEach((goodsShipment: any) => {
          this.goodsShipmentService
            .deleteGoodsShipment(goodsShipment)
            .then(() => {
              success++;
              if (counter === selected) {
                if (success == selected) {
                  this.goodsShipments = this.goodsShipments.filter(
                    (val) => !this.selectedGoodsShipments.includes(val)
                  );
                  this.selectedGoodsShipments = null;
                  this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'GoodsShipments Deleted',
                    life: 3000,
                  });
                } else {
                  this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail:
                      'GoodsShipments Deletion Error, Please refresh and try again',
                    life: 3000,
                  });
                }
              }
            });
          counter++;
        });
      },
    });
  }

  editGoodsShipment(goodsShipment: GoodsShipment) {
    this.router.navigate([
      '/distributor/goods-shipment/edit/' + goodsShipment.id,
    ]);
  }

  deleteGoodsShipment(goodsShipment: GoodsShipment) {
    this.confirmationService.confirm({
      message:
        'Are you sure you want to delete ' + goodsShipment.documentno + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.goodsShipmentService
          .deleteGoodsShipment(goodsShipment)
          .then((data) => {
            this.goodsShipments = this.goodsShipments.filter(
              (val) => val.id !== goodsShipment.id
            );
            // this.goodsShipment = {};
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'GoodsShipment Deleted',
              life: 3000,
            });
          })
          .catch(() => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail:
                'GoodsShipment Deletion Error, Please refresh and try again',
              life: 3000,
            });
          });
      },
    });
  }

  createInvoice(goodsShipment: GoodsShipment) {
    this.goodsShipmentService
      .createInvoice(goodsShipment.id)
      .then((data) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Invoice Created',
          life: 3000,
        });
      })
      .catch(() => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'GoodsShipment Deletion Error, Please refresh and try again',
          life: 3000,
        });
      });
  }
  gstReportForm() {
    this.form = this.fb.group({
      fromDate: ['', Validators.required],
      toDate: ['', Validators.required],
    });
  }
  getPdfReport(type: String) {
    this.distributorUserService.getCurrentDistributor().then((data: any) => {
      const format = 'YYYY-MM-dd';
      const myDate = '2023-02-03';
      const locale = 'en-US';
      this.fromDate = formatDate(
        this.form.get('fromDate')!.value,
        format,
        locale
      ).toString();
      this.toDate = formatDate(
        this.form.get('toDate')!.value,
        format,
        locale
      ).toString();
      this.token = sessionStorage.getItem('token');
      this.goodsShipmentService
        .getPdf(
          this.token,
          this.fromDate,
          this.toDate,
          type,
          data.distributor.id
        )
        .subscribe((data: any) => {
          this.blob = new Blob([data], { type: 'application/pdf' });
          var downloadURL = window.URL.createObjectURL(data);
          var link = document.createElement('a');
          link.href = downloadURL;
          link.download = this.typeofReport + '.pdf';
          link.click();
        });
    });
  }
  getExcel(type: String) {
    const format = 'YYYY-MM-dd';
    const myDate = '2023-02-03';
    const locale = 'en-US';
    this.fromDate = formatDate(
      this.form.get('fromDate')!.value,
      format,
      locale
    ).toString();
    this.toDate = formatDate(
      this.form.get('toDate')!.value,
      format,
      locale
    ).toString();
    this.distributorUserService.getCurrentDistributor().then((data: any) => {
      this.goodsShipmentService
        .downloadExcel(
          type,
          data.distributor.id,
          // this.goodsShipment.id,
          this.fromDate,
          this.toDate
        )
        .subscribe((blob: any) => saveAs(blob, 'DeliveryChallan.xlsx'));
    });
  }

  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.goodsShipments.length; i++) {
      if (this.goodsShipments[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  }
}
