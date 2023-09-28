import { Component, OnInit, ViewChild } from '@angular/core';
import {
  MessageService,
  ConfirmationService,
  MenuItem,
  LazyLoadEvent,
} from 'primeng/api';
import { Table } from 'primeng/table';
import { FilterBuilder } from 'src/app/utils/FilterBuilder';
import { ProductCategories } from './product-categories';
import { ProductCategoriesService } from './product-categories-service';
import { Observable } from 'rxjs';
import { HttpEventType, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-product-categories',
  templateUrl: './product-categories.component.html',
  styleUrls: ['./product-categories.component.scss'],
})
export class ProductCategoriesComponent implements OnInit {
  productCategoriesDialog!: boolean;

  productCategories!: ProductCategories[];

  productCategory!: ProductCategories;

  selectedFiles?: FileList;
  currentFile?: File;
  progress = 0;
  message = '';

  fileInfos?: Observable<any>;

  roles: any[] = [];

  selectedProductCategories!: any;

  submitted!: boolean;
  home!: MenuItem;
  items: MenuItem[] = [];
  sortField: string = '';
  search: string = '';
  pageNo: number = 0;
  pageSize: number = 10;
  sortDir: string = 'DESC';

  @ViewChild('dt') dt: Table | undefined;
  totalRecords: any;

  constructor(
    private productCategoriesService: ProductCategoriesService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.items = [{ label: 'Product Categories' }];
    this.home = { icon: 'pi pi-home', routerLink: '/dashboard' };
    // this.productCategoriesService.getProductCategoriess().then(data => this.productCategories = data);
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
      var filtercols = ['searchKey', 'name', 'description'];
      filter = FilterBuilder.build(filtercols, this.search);
    }
    this.productCategoriesService
      .getProductCategoriess(
        this.pageNo,
        this.pageSize,
        this.sortField,
        this.sortDir,
        filter
      )
      .then((data) => {
        if (data) {
          this.productCategories = data.content;
          this.totalRecords = data.totalElements;
        }
      });
  }
  openNew() {
    this.productCategory = {};
    this.submitted = false;
    this.productCategoriesDialog = true;
  }

  deleteSelectedProductCategoriess() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected Product Category?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.productCategories = this.productCategories.filter(
          (val) => !this.selectedProductCategories.includes(val)
        );
        this.selectedProductCategories = null;
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Product Category Deleted',
          life: 3000,
        });
      },
    });
  }

  editProductCategories(productCategory: ProductCategories) {
    this.productCategory = { ...productCategory };
    this.productCategoriesDialog = true;
  }

  deleteProductCategories(productCategory: ProductCategories) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + productCategory.name + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.productCategoriesService
          .deleteProductCategories(productCategory)
          .then((data) => {
            this.productCategories = this.productCategories.filter(
              (val) => val.id !== productCategory.id
            );
            this.productCategory = {};
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Product Categories Deleted',
              life: 3000,
            });
          });
      },
    });
  }

  hideDialog() {
    this.productCategoriesDialog = false;
    this.submitted = false;
  }
  selectFile(event: any): void {
    this.selectedFiles = event.target.files;
  }
  saveProductCategories() {
    this.submitted = true;
    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);
      if (file) {
        this.currentFile = file;

        if (this.productCategory.name?.trim()) {
          var jsonString = JSON.stringify(this.productCategory);
          if (this.productCategory.id) {
            this.uploadUpdate(jsonString, this.productCategory.id);
            // this.productCategoriesService
            //   .updateProductCategories(jsonString, this.currentFile)
            //   .then((res: any) => {
            //     // this.productCategoriess.push(res);
            //     this.productCategories[this.findIndexById(res.id)] = res;
            //     this.messageService.add({
            //       severity: 'success',
            //       summary: 'Successful',
            //       detail: 'Product Category Updated',
            //       life: 3000,
            //     });
            //   });
          } else {
            this.upload();
            // this.productCategoriesService
            //   .createProductCategories(jsonString, this.currentFile)
            //   .then((res: any) => {
            //     this.productCategories.push(res);
            //     this.messageService.add({
            //       severity: 'success',
            //       summary: 'Successful',
            //       detail: 'Product Category Created',
            //       life: 3000,
            //     });
            //   });
          }
        }
      }
      this.productCategories = [...this.productCategories];
      this.productCategoriesDialog = false;
      this.productCategory = {};
    }
  }

  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.productCategories.length; i++) {
      if (this.productCategories[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  }

  upload() {
    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);
      var data = this.productCategory;
      console.log(this.productCategory);
      var jsonString = JSON.stringify(this.productCategory);
      if (file) {
        this.currentFile = file;

        this.productCategoriesService
          .upload(this.currentFile, jsonString)
          .subscribe({
            next: (event: any) => {
              if (event.type === HttpEventType.UploadProgress) {
                this.progress = Math.round((100 * event.loaded) / event.total);
              } else if (event instanceof HttpResponse) {
                this.message = event.body.message;
                this.messageService.add({
                  severity: 'success',
                  summary: 'Success',
                  detail: 'Product Category Created Successfully ',
                  life: 3000,
                });
                // this.fileInfos = this.uploadService.getFiles();
              }
            },
            error: (err: any) => {
              console.log(err);
              this.progress = 0;

              if (err.error && err.error.message) {
                this.message = err.error.message;
                this.message = 'Could not upload the file!';
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: 'Issue happend while creation ',
                  life: 3000,
                });
              } else {
                this.message = 'Could not upload the file!';
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: this.message,
                  life: 3000,
                });
              }

              this.currentFile = undefined;
            },
          });
      }
      //  this.productForm.reset();
      this.selectedFiles = undefined;
    }
  }

  uploadUpdate(prodCat: string, id: any) {
    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);
      var data = this.productCategory;
      console.log(this.productCategory);
      var jsonString = JSON.stringify(this.productCategory);
      if (file) {
        this.currentFile = file;

        this.productCategoriesService
          .uploadUpdate(this.currentFile, prodCat, id)
          .subscribe({
            next: (event: any) => {
              if (event.type === HttpEventType.UploadProgress) {
                //this.progress = Math.round((100 * event.loaded) / event.total);
              } else if (event instanceof HttpResponse) {
                this.message = event.body.message;
                this.messageService.add({
                  severity: 'success',
                  summary: 'Success',
                  detail: 'Product Category Updated Successfully ',
                  life: 3000,
                });
                // this.fileInfos = this.uploadService.getFiles();
              }
            },
            error: (err: any) => {
              console.log(err);
              this.progress = 0;

              if (err.error && err.error.message) {
                this.message = err.error.message;
                this.message = 'Could not upload the file!';
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: 'Issue happend while creation ',
                  life: 3000,
                });
              } else {
                this.message = 'Could not upload the file!';
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: this.message,
                  life: 3000,
                });
              }

              this.currentFile = undefined;
            },
          });
      }
      //  this.productForm.reset();
      this.selectedFiles = undefined;
    }
  }

  getParents(roles: any) {
    var displayRoles: any[] = [];

    roles.forEach((role: any) => {
      displayRoles.push(role.name);
    });
    return displayRoles.join(',');
  }

  // applyFilterGlobal($event: any, stringVal: any) {
  //
  //   this.dt?.filterGlobal(($event.target as HTMLInputElement).value, 'contains');
  // }
}
