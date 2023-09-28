import { Component, OnInit, ViewChild } from '@angular/core';
import {
  MessageService,
  ConfirmationService,
  MenuItem,
  LazyLoadEvent,
} from 'primeng/api';
import { Table } from 'primeng/table';
import { FilterBuilder } from 'src/app/utils/FilterBuilder';
import { Brand } from './brand';
import { BrandService } from './brand.service';

@Component({
  selector: 'app-brands',
  templateUrl: './brands.component.html',
  styleUrls: ['./brands.component.scss'],
})
export class BrandsComponent implements OnInit {
  brandDialog!: boolean;

  brands!: Brand[];

  brand!: Brand;

  selectedBrands!: any;

  submitted!: boolean;

  @ViewChild('dt') dt: Table | undefined;
  home!: MenuItem;
  items: MenuItem[] = [];
  sortField: string = '';
  search: string = '';
  pageNo: number = 0;
  pageSize: number = 10;
  sortDir: string = 'DESC';
  totalRecords: any;

  constructor(
    private brandService: BrandService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.items = [{ label: 'Brands' }];
    this.home = { icon: 'pi pi-home', routerLink: '/dashboard' };
    // this.brandService.getBrands().then(data => this.brands = data);
  }
  applyFilterGlobal($event: any, stringVal: any) {
    // this.sortField = this.store.storeName;
    var searchString = ($event.target as HTMLInputElement).value;

    // this.dt.filterGlobal(($event.target as HTMLInputElement).value, 'contains');
    if (searchString.length > 0) {
      this.search = searchString;
      this.getFilter(searchString);
    } else {
      this.getFilter(searchString);
    }
  }

  loadPage(event: LazyLoadEvent) {
    this.pageNo = event.first! / 10;
    this.pageSize = event.rows!;
    if (event.sortField) {
      this.sortField = event.sortField;
    }
    this.sortDir = event.sortOrder! > 0 ? 'DESC' : 'ASC';
    this.getFilter('');
  }

  getFilter(searchString: string) {
    this.search = searchString;
    var filter = '';
    if (this.search !== '') {
      var filtercols = ['searchkey', 'name'];
      filter = FilterBuilder.build(filtercols, this.search);
    }
    this.brandService
      .getBrands(
        this.pageNo,
        this.pageSize,
        this.sortField,
        this.sortDir,
        filter
      )
      .then((data) => {
        if (data) {
          this.brands = data.content;
          this.totalRecords = data.totalElements;
        }
      });
  }
  openNew() {
    this.brand = {};
    this.submitted = false;
    this.brandDialog = true;
  }

  deleteSelectedBrands() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected Brands?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        var counter = 0;
        var success = 0;
        var selected = this.selectedBrands.length;
        this.selectedBrands.forEach((brand: any) => {
          this.brandService.deleteBrand(brand).then(() => {
            success++;
            if (counter === selected) {
              if (success == selected) {
                this.brands = this.brands.filter(
                  (val) => !this.selectedBrands.includes(val)
                );
                this.selectedBrands = null;
                this.messageService.add({
                  severity: 'success',
                  summary: 'Successful',
                  detail: 'Brands Deleted',
                  life: 3000,
                });
              } else {
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: 'Brands Deletion Error, Please refresh and try again',
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

  editBrand(brand: Brand) {
    this.brand = { ...brand };
    this.brandDialog = true;
  }

  deleteBrand(brand: Brand) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + brand.name + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.brandService
          .deleteBrand(brand)
          .then((data) => {
            this.brands = this.brands.filter((val) => val.id !== brand.id);
            this.brand = {};
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Brand Deleted',
              life: 3000,
            });
          })
          .catch(() => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Brand Deletion Error, Please refresh and try again',
              life: 3000,
            });
          });
      },
    });
  }

  hideDialog() {
    this.brandDialog = false;
    this.submitted = false;
  }

  saveBrand() {
    this.submitted = true;

    if (this.brand.name?.trim()) {
      if (this.brand.id) {
        this.brandService.updateBrand(this.brand).then((res: any) => {
          // this.brands.push(res);
          this.brands[this.findIndexById(res.id)] = res;
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Brand Updated',
            life: 3000,
          });
        });
      } else {
        this.brandService.createBrand(this.brand).then((res: any) => {
          this.brands.push(res);
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Brand Created',
            life: 3000,
          });
        });
      }

      this.brands = [...this.brands];
      this.brandDialog = false;
      this.brand = {};
    }
  }

  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.brands.length; i++) {
      if (this.brands[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  }

  // applyFilterGlobal($event: any, stringVal: any) {
  //
  //   this.dt?.filterGlobal(($event.target as HTMLInputElement).value, 'contains');
  // }
}
