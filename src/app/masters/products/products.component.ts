import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  Validators,
} from '@angular/forms';
import {
  MessageService,
  ConfirmationService,
  MenuItem,
  LazyLoadEvent,
} from 'primeng/api';
import { Table } from 'primeng/table';
import { User } from 'src/app/settings/users/user';
import { FilterBuilder } from 'src/app/utils/FilterBuilder';
import { Brand, BrandForm } from '../brands/brand';
import { Company } from '../companies/company';
import {
  ProductCategories,
  ProductCategoriesForm,
} from '../product-categories/product-categories';
import { TaxRate, TaxRateForm } from '../tax-rates/tax-rate';
import { Product, ProductForm, ProductType } from './product';
import { ProductService } from './product.service';
import { Observable } from 'rxjs';
import { HttpEventType, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  productForm!: FormGroup<ProductForm>;

  productDialog!: boolean;

  products!: Product[];

  selectedProducts!: any;

  submitted!: boolean;

  @ViewChild('dt') dt: Table | undefined;

  productCategories: ProductCategories[] = [];

  brands: Brand[] = [];

  taxRates: TaxRate[] = [];

  productTypes: any[] = ['ITEM', 'SERVICE'];
  home!: MenuItem;
  items: MenuItem[] = [];
  sortField: string = '';
  search: string = '';
  pageNo: number = 0;
  pageSize: number = 10;
  sortDir: string = 'DESC';
  totalRecords: any;

  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.items = [{ label: 'Products' }];
    this.home = { icon: 'pi pi-home', routerLink: '/dashboard' };
    this.initForm();
    // this.productService.getProducts().then(data => this.products = data);
    this.productService
      .getProductCategories()
      .then((data) => (this.productCategories = data));
    this.productService.getBrands().then((data) => (this.brands = data));
    this.productService
      .getProductTaxRates(0, 10, '', 'DESC', '')
      .then((data) => (this.taxRates = data));
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
  selectedFiles?: FileList;
  currentFile?: File;
  progress = 0;
  message = '';

  fileInfos?: Observable<any>;
  selectFile(event: any): void {
    this.selectedFiles = event.target.files;
  }
  upload() {
    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);
      var data = this.productForm.value;
      console.log(this.productForm.value);
      var jsonString = JSON.stringify(this.productForm.value);
      if (file) {
        this.currentFile = file;

        this.productService.upload(this.currentFile, jsonString).subscribe({
          next: (event: any) => {
            if (event.type === HttpEventType.UploadProgress) {
              this.progress = Math.round((100 * event.loaded) / event.total);
            } else if (event instanceof HttpResponse) {
              this.message = event.body.message;
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Product Created Successfully ',
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
      this.productForm.reset();
      this.selectedFiles = undefined;
    }
  }

  // updateUpload(id: any) {
  //   if (this.selectedFiles) {
  //     const file: File | null = this.selectedFiles.item(0);
  //     var data = this.productForm.value;
  //     var jsonString = JSON.stringify(this.productForm.value);
  //     if (file) {
  //       this.currentFile = file;

  //       this.productService
  //         .uploadUpdate(this.currentFile, jsonString, id)
  //         .subscribe({
  //           next: (event: any) => {
  //             if (event.type === HttpEventType.UploadProgress) {
  //               this.progress = Math.round((100 * event.loaded) / event.total);
  //             } else if (event instanceof HttpResponse) {
  //               this.message = event.body.message;
  //               this.messageService.add({
  //                 severity: 'success',
  //                 summary: 'Success',
  //                 detail: 'Product Updated Successfully ',
  //                 life: 3000,
  //               });
  //               // this.fileInfos = this.uploadService.getFiles();
  //             }
  //           },
  //           error: (err: any) => {
  //             console.log(err);
  //             this.progress = 0;

  //             if (err.error && err.error.message) {
  //               this.message = err.error.message;
  //               this.message = 'Could not upload the file!';
  //               this.messageService.add({
  //                 severity: 'error',
  //                 summary: 'Error',
  //                 detail: 'Issue happend while updation ',
  //                 life: 3000,
  //               });
  //             } else {
  //               this.message = 'Could not upload the file!';
  //               this.messageService.add({
  //                 severity: 'error',
  //                 summary: 'Error',
  //                 detail: this.message,
  //                 life: 3000,
  //               });
  //             }

  //             this.currentFile = undefined;
  //           },
  //         });
  //     }
  //     // this.productForm.reset();
  //     this.selectedFiles = undefined;
  //   }
  // }
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
      var filtercols = ['searchKey', 'name', 'model', 'barCode', 'skuCode'];
      filter = FilterBuilder.build(filtercols, this.search);
    }
    this.productService
      .getProducts(
        this.pageNo,
        this.pageSize,
        this.sortField,
        this.sortDir,
        filter
      )
      .then((data) => {
        if (data) {
          this.products = data.content;
          this.totalRecords = data.totalElements;
        }
      });
    // this.productService.getProductCategories().then(data => this.productCategories = data);
    // this.productService.getBrands().then(data => this.brands = data);
    // this.productService.getTaxRates(this.pageNo, this.pageSize, this.sortField, this.sortDir, this.search).then(data => this.taxRates = data);
  }

  private initForm() {
    this.productForm = new FormGroup<ProductForm>({
      id: new FormControl(''),
      name: new FormControl('', {
        nonNullable: true,
        validators: Validators.required,
      }),
      searchKey: new FormControl('', {
        nonNullable: true,
        validators: Validators.required,
      }),
      productType: new FormControl(ProductType.ITEM, {
        nonNullable: true,
        validators: Validators.required,
      }),
      model: new FormControl(''),
      description: new FormControl(''),
      skuCode: new FormControl(''),
      barCode: new FormControl(''),
      hsnCode: new FormControl(''),
      help: new FormControl(''),
      mrp: new FormControl(0, {
        nonNullable: true,
        validators: [Validators.required, Validators.min(0)],
      }),
      needapproval: new FormControl(false),
      //thumbnail: new FormControl(''),
      category: new FormGroup<ProductCategoriesForm>({
        id: new FormControl('', {
          nonNullable: true,
          validators: Validators.required,
        }),
      }),
      taxRate: new FormGroup<TaxRateForm>({
        id: new FormControl('', {
          nonNullable: true,
          validators: Validators.required,
        }),
      }),
      brand: new FormGroup<BrandForm>({
        id: new FormControl('', {
          nonNullable: true,
          validators: Validators.required,
        }),
      }),
    });
  }

  openNew() {
    this.productForm.reset();
    this.submitted = false;
    this.productDialog = true;
  }

  deleteSelectedProducts() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected Products?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        var counter = 0;
        var success = 0;
        var selected = this.selectedProducts.length;
        this.selectedProducts.forEach((product: any) => {
          this.productService.deleteProduct(product).then(() => {
            success++;
            if (counter === selected) {
              if (success == selected) {
                this.products = this.products.filter(
                  (val) => !this.selectedProducts.includes(val)
                );
                this.selectedProducts = null;
                this.messageService.add({
                  severity: 'success',
                  summary: 'Successful',
                  detail: 'Products Deleted',
                  life: 3000,
                });
              } else {
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail:
                    'Products Deletion Error, Please refresh and try again',
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

  editProduct(product: Product) {
    this.productForm.reset();
    this.productDialog = true;
    this.productForm.patchValue({ ...product });
  }

  deleteProduct(product: Product) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + product.name + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.productService
          .deleteProduct(product)
          .then((data) => {
            this.products = this.products.filter(
              (val) => val.id !== product.id
            );
            // this.product = {};
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Product Deleted',
              life: 3000,
            });
          })
          .catch(() => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Product Deletion Error, Please refresh and try again',
              life: 3000,
            });
          });
      },
    });
  }

  hideDialog() {
    this.productDialog = false;
    this.submitted = false;
  }

  saveProduct() {
    this.submitted = true;
    // this.product = this.productForm.value;
    var data = this.productForm.value;

    if (data.id) {
      this.productService.updateProduct(data).then((res: any) => {
        // this.products.push(res);
        this.products[this.findIndexById(res.id)] = res;
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Product Updated',
          life: 3000,
        });
      });
    } else {
      this.upload();
      // this.productService.createProduct(data).then((res: any) => {
      //   this.products.push(res);
      //   this.messageService.add({
      //     severity: 'success',
      //     summary: 'Successful',
      //     detail: 'Product Created',
      //     life: 3000,
      //   });
      // });

      this.products = [...this.products];
    }
    this.productDialog = false;
  }

  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.products.length; i++) {
      if (this.products[i].id === id) {
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
