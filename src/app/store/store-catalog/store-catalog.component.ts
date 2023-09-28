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
import { StoreUserService } from '../store-user/store-user.service';
import { CatalogExcel, StoreCatalog } from './store-catalog';
import { StoreCatalogService } from './store-catalog.service';
import { saveAs } from 'file-saver';
import { environment } from 'src/environments/environment';
import { take } from 'rxjs/operators';
import { ProductService } from 'src/app/masters/products/product.service';
import { FilterBuilder } from 'src/app/utils/FilterBuilder';
@Component({
  selector: 'app-store-catalog',
  templateUrl: './store-catalog.component.html',
  styleUrls: ['./store-catalog.component.scss'],
})
export class StoreCatalogComponent implements OnInit {
  storeCatalog: StoreCatalog = {};
  storeCatalogUploadUrl: string =
    environment.apiurl + '/storeCatalog/bulk/create/';
  storeCatalogDialog!: boolean;
  pageNo: number = 0;
  pageSize: number = 10;
  sortField: string = '';
  sortDir: string = 'DESC';
  search: string = '';

  storeCatalogs!: StoreCatalog[];
  catalogExcel: CatalogExcel[] = [{}];
  storeCatalogExcel!: StoreCatalog[];
  selectedStoreCatalogs!: any;
  searchOrder: any;
  distributors: any[] = [];

  distributorCatalogs: any[] = [];
  exportColumns!: any[];
  submitted!: boolean;
  bulkStoreId: any;
  cols: any;
  indexing: number = 0;
  @ViewChild('dt') dt: Table | undefined;
  home!: MenuItem;
  items: MenuItem[] = [];
  productDetails: Product[] = [];

  products: Product[] = [];
  productsData: any;
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
  totalRecords: any;
  name: any;
  catlogData: any[] = [];
  storeDt: any;
  brands: any;
  taxRates: any;

  constructor(
    private authService: AuthService,
    private storeUserService: StoreUserService,
    private storeCatalogService: StoreCatalogService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.items = [{ label: 'Catalog' }];
    this.home = { icon: 'pi pi-home', routerLink: '/dashboard' };
    // this.storeUserService
    //   .getStore(this.authService.getUserId())
    //   .then((store) => {
    //
    //     this.storeCatalogService
    //       .getStoreCatalogByStore(store.id)
    //       .then((data: any) => {
    //         // this.storeCatalogs = data;
    //
    //       });
    //   });
    this.productService
      .getProducts(
        this.pageNo,
        this.pageSize,
        this.sortField,
        this.sortDir,
        this.search
      )
      .then((data) => (this.products = data));
    // this.storeCatalogService
    //   .getProducts()
    //   .then((data) => {
    //     this.products = data;
    //
    //   });

    this.storeCatalogService.getBrands().then((data) => (this.brands = data));
    this.storeCatalogService
      .getTaxRates()
      .then((data) => (this.taxRates = data));

    this.cols = [
      { field: '', header: '' },
      { field: 'productName', header: 'Product' },
      { field: 'HSN', header: 'HSN' },
      { field: 'MRP', header: 'MRP' },
      { field: 'Selling Price', header: 'Selling Price' },
      { field: 'Help', header: 'Help' },
    ];
    this.exportColumns = this.cols.map((col: any) => ({
      title: col.header,
      dataKey: col.field,
    }));
    this.storeUserService
      .getStore(this.authService.getUserId())
      .then((store) => {
        //alert(this.authService.getUserId() + '\n\n\n' + JSON.stringify(store));
        this.storeCatalogUploadUrl += store?.id;
      });
  }
  getMap(element: StoreCatalog, index: number) {
    var obj = {
      name: element?.name != null ? element?.name : element?.product?.name,
      mrp: element?.mrp != null ? element?.mrp : element?.product?.mrp,
      sellingPrice:
        element?.sellingPrice != null
          ? element?.sellingPrice
          : element?.product?.mrp,
      hsnCode:
        element.hsnCode != null ? element?.hsnCode : element.product?.hsnCode,
      help: element?.product?.help,
    };
    this.catalogExcel[index] = obj;
  }

  openNew() {
    this.router.navigate(['/store/storecatalog/create']);
  }

  deleteSelectedStoreCatalogs() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected StoreCatalogs?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        var counter = 0;
        var success = 0;
        var selected = this.selectedStoreCatalogs.length;
        this.selectedStoreCatalogs.forEach((storeCatalog: any) => {
          this.storeCatalogService.deleteStoreCatalog(storeCatalog).then(() => {
            success++;
            if (counter === selected) {
              if (success == selected) {
                this.storeCatalogs = this.storeCatalogs.filter(
                  (val) => !this.selectedStoreCatalogs.includes(val)
                );
                this.selectedStoreCatalogs = null;
                this.messageService.add({
                  severity: 'success',
                  summary: 'Successful',
                  detail: 'StoreCatalogs Deleted',
                  life: 3000,
                });
              } else {
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail:
                    'StoreCatalogs Deletion Error, Please refresh and try again',
                  life: 3000,
                });
              }
            }
          }).catch(() => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail:
                'Can not  Delete, This Product has a dependency.',
              life: 3000,
            });
          });
          counter++;
        });
      },
    });
  }

  editStoreCatalog(storeCatalog: StoreCatalog) {
    //
    this.router.navigate(['/store/storecatalog/edit/' + storeCatalog.id]);
    ///this.storeCatalog = { ...storeCatalog };
    //this.storeCatalogDialog = true;
  }

  exportExcel() {
    this.storeUserService
      .getStore(this.authService.getUserId())
      .then((store) => {
        this.storeCatalogService
          .getStoreCatalogByStoreExcel(store.id)
          .then((data) =>
            data.content.forEach((element: any) => {
              this.getMap(element, this.indexing++);
            })
          );
      });

    this.storeUserService
      .getStore(this.authService.getUserId())
      .then((store) => {
        this.storeCatalogService
          .getStoreCatalogByStore(store.id, 0, 10, '', 'DESC', '')
          .then((data) => (this.storeCatalogs = data));
      });

    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(this.catalogExcel);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });
      this.saveAsExcelFile(excelBuffer, 'storeCatalogs');
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

  deleteStoreCatalog(storeCatalog: StoreCatalog) {
    this.confirmationService.confirm({
      message:
        'Are you sure you want to delete ' + storeCatalog.product?.name + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.storeCatalogService
          .deleteStoreCatalog(storeCatalog)
          .then((data) => {
            this.storeCatalogs = this.storeCatalogs.filter(
              (val) => val.id !== storeCatalog.id
            );
            // this.storeCatalog = {};
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'StoreCatalog Deleted',
              life: 3000,
            });
          })
          .catch(() => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail:
                'This Product has a dependency.',
              life: 3000,
            });
          });
      },
    });
  }

  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.storeCatalogs.length; i++) {
      if (this.storeCatalogs[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  }

  downloadTemplate() {
    this.storeCatalogService
      .downloadTemplate()
      .subscribe((blob) => saveAs(blob, 'StoreCatalogemplate.csv'));
  }

  importResponseHandler(event: any) {
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
    saveAs(blob, 'StoreCatalogImportError.csv');
    setTimeout(HelloWorld, 4000);
    function HelloWorld() {
      window.location.reload();
    }
  }

  // searchOrders(params : any) {
  //   this.storeCatalogService.searchOrder(params).then((data) => {
  //     this.storeCatalogs = data.content;
  //
  //     this.totalRecords = data.totalElements;
  //   });
  // }

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
    this.getCatalogFilter(this.search);
  }
  getCatalogFilter(searchString: string) {
    this.search = searchString;
    this.storeUserService
      .getStore(this.authService.getUserId())
      .then((store) => {
        // this.storeCatalogs = store.id;

        var filter = '';
        if (this.search !== '') {
          var filtercols = ['product.name', 'product.hsnCode', 'product.mrp', 'sellingPrice'];
          filter = FilterBuilder.build(filtercols, this.search);
        }
        this.storeCatalogService
          .getStoreCatalogByStore(
            store.id,
            this.pageNo,
            this.pageSize,
            this.sortField,
            this.sortDir,
            filter
          )
          .then((data: any) => {
            // this.storeCatalogs = data;
            if (data) {
              this.storeCatalogs = data.content;
              this.totalRecords = data.totalElements;
            }
          });
      });
  }
}
