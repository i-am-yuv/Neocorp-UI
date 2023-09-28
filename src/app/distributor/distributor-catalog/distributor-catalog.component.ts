import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {
  MessageService,
  ConfirmationService,
  MenuItem,
  LazyLoadEvent,
} from 'primeng/api';
import { Table } from 'primeng/table';
import { AuthService } from 'src/app/auth/auth.service';
import { Product } from 'src/app/masters/products/product';
import { DistributorUserService } from '../distributor-user/distributor-user.service';
import { CatalogExcel, DistributorCatalog } from './distributor-catalog';
import { DistributorCatalogService } from './distributor-catalog.service';
import { saveAs } from 'file-saver';
import { environment } from 'src/environments/environment';
import { FilterBuilder } from 'src/app/utils/FilterBuilder';
@Component({
  selector: 'app-distributor-catalog',
  templateUrl: './distributor-catalog.component.html',
  styleUrls: ['./distributor-catalog.component.scss'],
})
export class DistributorCatalogComponent implements OnInit {
  distributorCatalog: DistributorCatalog = {};
  cols: any;
  distributorCatalogs: DistributorCatalog[] = [];
  selectedDistributorCatalogs!: any;
  distributorCatalogUploadUrl: string =
    environment.apiurl + '/distributorCatalog/bulk/create/';
  distId: any;
  distributors: any[] = [];
  home!: MenuItem;
  items: MenuItem[] = [];

  pageNo: number = 0;
  pageSize: number = 10;
  sortField: string = '';
  sortDir: string = 'DESC';
  search: string = '';

  @ViewChild('dt') dt: Table | undefined;
  catalogExcel: CatalogExcel[] = [{}];
  products: Product[] = [];
  inventory: any = {};
  invType: any[] = [
    {
      name: 'ADD',
      code: 'VPLUS',
    },
    {
      name: 'REDUCE',
      code: 'VMINUS',
    },
  ];
  indexing: number = 0;
  totalRecords: any;

  constructor(
    private authService: AuthService,
    private distributorUserService: DistributorUserService,
    private distributorCatalogService: DistributorCatalogService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.items = [{ label: 'Catalog' }];
    this.home = { icon: 'pi pi-home', routerLink: '/dashboard' };
    // this.distributorUserService
    //   .getDistributorUser(this.authService.getUserId())
    //   .then((distributorUser) => {
    //
    //     this.distId = distributorUser.distributor.id;
    //     this.distributorCatalogService
    //       .getbydistributor(distributorUser.distributor.id)
    //       .then((data) => {
    //         this.distributorCatalogs = data.content;
    //         data.content.forEach((element: any) => {
    //           //this.getMap(element, this.indexing++);
    //         });
    //       });
    //   });
    // this.distributorCatalogService
    //   .getProducts()
    //   .then((data) => (this.products = data));

    // this.distributorCatalogService.getBrands().then(data => this.brands = data);
    // this.distributorCatalogService.getTaxRates().then(data => this.taxRates = data);
    this.distributorUserService
      .getDistributorUser(this.authService.getUserId())
      .then((distributorUser) => {
        this.distributorCatalogUploadUrl += distributorUser.distributor.id;
      });

    this.cols = [
      { field: '', header: '' },
      { field: 'productName', header: 'Product' },
      { field: 'MRP', header: 'MRP' },
      { field: 'Landing Cost', header: 'Landing Cost' },
      { field: 'Selling Price', header: 'Selling Price' },
    ];
  }

  loadPage(event: LazyLoadEvent) {
    if (event.globalFilter) {
      this.search = event.globalFilter.target.value;
    }
    this.pageNo = event.first! / 10;
    this.pageSize = event.rows!;
    if (event.sortField) {
      this.sortField = event.sortField;
    }
    this.sortDir = event.sortOrder! > 0 ? 'DESC' : 'ASC';
    this.getFilter(this.search);
  }
  getFilter(searchString: string) {
    this.search = searchString;
    // this.storeService.getPagination(this.pageNo, this.pageSize, this.sortField, this.sortDir, this.search)
    //   .then((data: any) => {
    //     this.storeDt = data;
    // if(data){
    // 	this.stores = data.content;
    //     this.totalRecords = data.totalElements;
    // }

    //   });
    this.distributorUserService
      .getDistributorUser(this.authService.getUserId())
      .then((distributorUser) => {
        this.distId = distributorUser.distributor.id;
        var filter = '';
        if (this.search !== '') {
          var filtercols = [
            'product.name',
            'product.mrp',
            'landingCost',
            'sellingPrice',
          ];
          filter = FilterBuilder.build(filtercols, this.search);
        }
        this.distributorCatalogService
          .getbydistributor(
            distributorUser.distributor.id,
            this.pageNo,
            this.pageSize,
            this.sortField,
            this.sortDir,
            filter
          )
          .then((data) => {
            this.distributorCatalogs = data.content;
            if (data) {
              this.distributorCatalogs = data.content;
              this.totalRecords = data.totalElements;
            }
            data.content.forEach((element: any) => {
              //this.getMap(element, this.indexing++);
            });
          });
      });
    this.distributorCatalogService
      .getProducts()
      .then((data) => (this.products = data));

    this.distributorUserService
      .getDistributorUser(this.authService.getUserId())
      .then((distributorUser) => {
        this.distributorCatalogUploadUrl += distributorUser.distributor.id;
      });
  }
  openNew() {
    this.router.navigate(['/distributor/distributorcatalog/create']);
  }

  exportExcel() {
    this.distributorUserService
      .getDistributorUser(this.authService.getUserId())
      .then((distributorUser) => {
        this.distId = distributorUser.distributor.id;
        this.distributorCatalogService
          .getbydistributor(
            distributorUser.distributor.id,
            0,
            10,
            '',
            'DESC',
            ''
          )
          .then((data) => {
            data.content.forEach((element: any) => {
              this.getMap(element, this.indexing++);
            });
          });
      });
    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(this.catalogExcel);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });
      this.saveAsExcelFile(excelBuffer, 'distributorCatalogs');
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE,
    });
    saveAs(
      data,
      fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION
    );
  }

  getMap(element: DistributorCatalog, index: number) {
    var obj = {
      name: element?.product?.name == null ? 'NA' : element?.product?.name,
      mrp: element?.product?.mrp == null ? 0 : element?.product?.mrp,
      sellingPrice: element?.sellingPrice == null ? 0 : element?.sellingPrice,
      landingCost: element?.landingCost == null ? 0 : element?.landingCost,
    };
    this.catalogExcel[index] = obj;
  }

  deleteSelectedDistributorCatalogs() {
    this.confirmationService.confirm({
      message:
        'Are you sure you want to delete the selected DistributorCatalogs?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        var counter = 0;
        var success = 0;
        var selected = this.selectedDistributorCatalogs.length;
        this.selectedDistributorCatalogs.forEach((distributorCatalog: any) => {
          this.distributorCatalogService
            .deleteDistributorCatalog(distributorCatalog)
            .then(() => {
              success++;
              if (counter === selected) {
                if (success == selected) {
                  this.distributorCatalogs = this.distributorCatalogs.filter(
                    (val) => !this.selectedDistributorCatalogs.includes(val)
                  );
                  this.selectedDistributorCatalogs = null;
                  this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'DistributorCatalogs Deleted',
                    life: 3000,
                  });
                } else {
                  this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail:
                      'DistributorCatalogs Deletion Error, Please refresh and try again',
                    life: 3000,
                  });
                }
              }
            }).catch(() => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Deletion not allowed, Product has a dependency , ',
                life: 3000,
              });
            });
          counter++;
        });
      },
    });
  }

  editDistributorCatalog(distributorCatalog: DistributorCatalog) {
    this.router.navigate([
      '/distributor/distributorcatalog/edit/' + distributorCatalog.id,
    ]);
  }

  deleteDistributorCatalog(distributorCatalog: DistributorCatalog) {
    this.confirmationService.confirm({
      message:
        'Are you sure you want to delete ' +
        distributorCatalog.product?.name +
        '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.distributorCatalogService
          .deleteDistributorCatalog(distributorCatalog)
          .then((data) => {
            this.distributorCatalogs = this.distributorCatalogs.filter(
              (val) => val.id !== distributorCatalog.id
            );
            // this.distributorCatalog = {};
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'DistributorCatalog Deleted',
              life: 3000,
            });
          })
          .catch((e) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Deletion not allowed, Product has a dependency, ',
            life: 3000,
          });
        } 
          );
      },
    });
  }

  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.distributorCatalogs.length; i++) {
      if (this.distributorCatalogs[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  }

  downloadTemplate() {
    this.distributorCatalogService
      .downloadTemplate()
      .subscribe((blob) => saveAs(blob, 'DistributorCatalogemplate.csv'));
  }

  importResponseHandler(event: any) {
    this.distributorUserService
      .getDistributorUser(this.authService.getUserId())
      .then((distributorUser) => {});
    if (event.originalEvent.status === 200) {
      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'All records imported successfully',
        life: 5000,
      });
    }
  }
  importErrorHandler(event: any) {
    //
    var array = event.error.error.text.split(/\r?\n/);
    var count = array.length - 2;
    var final = count + ' Invalid  records';
    this.messageService.add({
      severity: 'error',
      summary: 'Import Error',
      detail: final,
      life: 5000,
    });

    var blob = new Blob([event.error.error.text], {
      type: 'text/plain',
    });
    saveAs(blob, 'DistributorCatalogImportError.csv');
    setTimeout(HelloWorld, 4000);
    function HelloWorld() {
      window.location.reload();
    }
  }
}
