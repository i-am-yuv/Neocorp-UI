import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { AuthService } from 'src/app/auth/auth.service';
import { Product } from 'src/app/masters/products/product';
import { ProductService } from 'src/app/masters/products/product.service';
import { Inventory } from '../../inventory/inventory';
import { InventoryService } from '../../inventory/inventory.service';
import { StorageService } from '../../stock/storage.service';
import { StoreUserService } from '../../store-user/store-user.service';
import { StoreCatalog } from '../store-catalog';
import { StoreCatalogService } from '../store-catalog.service';
import { Observable } from 'rxjs';
import { HttpEventType, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-store-catalog-form',
  templateUrl: './store-catalog-form.component.html',
})
export class StoreCatalogFormComponent implements OnInit {
  storeCatalog: StoreCatalog = { local: false };

  distributors: any[] = [];

  distributorCatalogs: any[] = [];

  submitted!: boolean;

  @ViewChild('dt') dt: Table | undefined;

  products: Product[] = [];

  inventory: Inventory = {};

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
  id: string | null = '';
  productCategories: any;
  brands: any;
  taxRates: any;
  productTypes: any[] = ['ITEM', 'SERVICE'];
  distlandingCost: number = 0;
  home!: MenuItem;
  items: MenuItem[] = [];
  catalogGlobalForm!: FormGroup;
  createdAt: any;
  updateAt: any;

  constructor(
    private authService: AuthService,
    private storeUserService: StoreUserService,
    private storeCatalogService: StoreCatalogService,
    private messageService: MessageService,
    private storageService: StorageService,
    private inventoryService: InventoryService,
    private router: Router,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.items = [
      { label: ' Manage Products', routerLink: '/store/storecatalog' },
    ];
    // this.home = { icon: 'pi pi-home', routerLink: '/dashboard' };
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.getData();
    } else {
      this.storeUserService
        .getStoreUserByUser(this.authService.getUserId())
        .then((data: any) => {
          this.storeCatalog.store = data.store;
        });
    }
    // this.storeCatalogService.getProducts().then(data => this.products = data);
    this.productService
      .getProducts(0, 1000, '', 'DESC', '')
      .then((data) => (this.products = data.content));
    this.productService
      .getProductCategories()
      .then((data) => (this.productCategories = data));
    this.productService.getBrands().then((data) => (this.brands = data));
    this.productService
      .getCatalogTaxRates()
      .then((data) => (this.taxRates = data));

    // this.getGlobalCatalog();
  }
  // getGlobalCatalog(){
  //   this.catalogGlobalForm = this.fb.group({
  //     product : ['',Validators.required],
  //     distributor : ['',Validators.required],
  //     landingPrice : ['',Validators.required],
  //     sellingPrice : ['',Validators.required]
  //   })
  // }

  getData() {
    this.storeCatalogService.getStoreCatalog(this.id!).then((data: any) => {
      this.storeCatalog = data;
      if (this.storeCatalog.product) {
        this.getDistributors(this.storeCatalog.product);
        // this.getDistributorCatalogs(this.storeCatalog.product);
      }

      this.getStorage();
    });
  }

  getDistributors(product: any) {
    this.storeCatalogService.getDistributors(product.id).then((data) => {
      this.distributors = data;
      this.getDistributorCatalogs(product);
    });
  }

  getDistributorCatalogs(product: any) {
    if (product) {
      this.storeCatalogService
        .getDistributorCatalogs(product.id)
        .then((data) => {
          this.distributorCatalogs = data;
          if (this.storeCatalog.distributor) {
            this.getDistributorLandingCost(this.storeCatalog.distributor);
          }
        });
    }
  }

  getDistributorLandingCost(distributor: any) {
    if (this.distributorCatalogs.length > 0 && distributor) {
      var dc = this.distributorCatalogs.find(
        (t) => t.distributor.id === distributor.id
      );
      this.distlandingCost = dc.sellingPrice;
    }
  }

  setLandingCost(landingCost: any) {
    this.storeCatalog.landingCost = landingCost;
  }

  saveStoreCatalog1() {
    // if(this.storeCatalog.local == false){
    //   if(this.storeCatalog.landingCost==null ||  this.storeCatalog.sellingPrice==null  || this.storeCatalog.distributor == null){
    //     this.submitted=false;
    //     this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Product distributor, Selling price, Landing price should not be empty', life: 3000 });
    //     return;
    //   }
    // }

    this.submitted = true;

    var data = this.storeCatalog;
    if (data.id) {
      this.storeCatalogService
        .updateStoreCatalog(data)
        .then((res: any) => {
          // this.createInventory();
          this.getData();
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'StoreCatalog Updated',
            life: 3000,
          });
        })
        .catch((e) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Store Catalog Update Failed',
            life: 3000,
          });
        });
    } else {
      this.storeCatalogService
        .createStoreCatalog(data)
        .then((res: any) => {
          // this.createInventory();
          // this.storeCatalog.id = res.id;

          // this.createdAt = res.createdAt;

          // this.updateAt = res.updateAt

          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'StoreCatalog Created',
            life: 3000,
          });
          this.router.navigate(['/store/storecatalog/edit/' + res.id]);
        })
        .catch((e) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Store Catalog Create Failed ' + e.error.message,
            life: 3000,
          });
        });
    }
  }
  image: File | null = null;
  // onImageChange(event: any) {
  //   this.image = event.target.files.item(0);

  //   //this.storeCatalog.file({ image: imageFile });
  // }
  // formdata!: FormData;

  onImageChange(event: any) {
    if (event.target.files.length > 0) {
      this.image = event.target.files[0];
      console.log(this.image + ' file');
      // this.storeCatalog.file.setValue(file);
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
      var data = this.storeCatalog;
      var jsonString = JSON.stringify(this.storeCatalog);
      if (file) {
        this.currentFile = file;

        this.storeCatalogService
          .upload(this.currentFile, jsonString)
          .subscribe({
            next: (event: any) => {
              if (event.type === HttpEventType.UploadProgress) {
                this.progress = Math.round((100 * event.loaded) / event.total);
              } else if (event instanceof HttpResponse) {
                console.log(JSON.stringify(event));

                this.message = event.body.message;
                this.messageService.add({
                  severity: 'success',
                  summary: 'Success',
                  detail: 'Catalog Created Successfully ',
                  life: 3000,
                });
                // this.fileInfos = this.uploadService.getFiles();
                //this.router.navigate(['/store/storecatalog/edit/' + res.id]);
                console.log(event);
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
      this.storeCatalog = {};
      this.selectedFiles = undefined;
    }
  }

  // uploadUpdate(id: any) {
  //   if (this.selectedFiles) {
  //     const file: File | null = this.selectedFiles.item(0);
  //     var data = this.storeCatalog;
  //     var jsonString = JSON.stringify(this.storeCatalog);
  //     if (file) {
  //       this.currentFile = file;

  //       this.storeCatalogService
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
  //                 detail: 'Catalog Updated Successfully ',
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
  //                 detail: 'Issue happend while Updation ',
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
  //     // this.storeCatalog = {};
  //     this.selectedFiles = undefined;
  //   }
  // }
  saveStoreCatalogs() {
    // if(this.storeCatalog.local == true){
    //   if(this.storeCatalog.product==null || this.storeCatalog.category==null || this.storeCatalog.productType==null || this.storeCatalog.brand==null || this.storeCatalog.mrp==null || this.storeCatalog.taxRate==null || this.storeCatalog.landingCost==null ||  this.storeCatalog.sellingPrice==null ){
    //       this.submitted=false;
    //       this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please provide all required fields', life: 3000 });
    //       return;
    //     }
    // }
    if (this.storeCatalog.sellingPrice! < this.storeCatalog.landingCost!) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Selling price is lower than the landing price',
        life: 3000,
      });
      return;
    }

    this.submitted = true;
    var data = this.storeCatalog;
    if (data.id) {
      this.storeCatalogService
        .updateStoreCatalog(data)
        .then((res: any) => {
          // this.createInventory();
          this.getData();
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'StoreCatalog Updated',
            life: 3000,
          });
        })
        .catch((e) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Store Catalog Update Failed',
            life: 3000,
          });
        });
    } else {
      this.upload();
      // this.storeCatalogService
      //   .createStoreCatalog(data)
      //   .then((res: any) => {
      //     // this.createInventory();
      //     this.messageService.add({
      //       severity: 'success',
      //       summary: 'Successful',
      //       detail: 'StoreCatalog Created',
      //       life: 3000,
      //     });
      //     this.router.navigate(['/store/storecatalog/edit/' + res.id]);
      //   })
      //   .catch((e) => {
      //     this.messageService.add({
      //       severity: 'error',
      //       summary: 'Error',
      //       detail: 'Store Catalog Create Failed ' + e.error.message,
      //       life: 3000,
      //     });
      //   });
    }
  }
  saveStoreCatalog() {
    // if(this.storeCatalog.local == true){
    //   if(this.storeCatalog.product==null || this.storeCatalog.category==null || this.storeCatalog.productType==null || this.storeCatalog.brand==null || this.storeCatalog.mrp==null || this.storeCatalog.taxRate==null || this.storeCatalog.landingCost==null ||  this.storeCatalog.sellingPrice==null ){
    //       this.submitted=false;
    //       this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please provide all required fields', life: 3000 });
    //       return;
    //     }
    // }
    if (this.storeCatalog.sellingPrice! < this.storeCatalog.landingCost!) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Selling price is lower than the landing price',
        life: 3000,
      });
      return;
    }

    this.submitted = true;
    var data = this.storeCatalog;
    if (data.id) {
      this.storeCatalogService
        .updateStoreCatalog(data)
        .then((res: any) => {
          // this.createInventory();
          this.getData();
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'StoreCatalog Updated',
            life: 3000,
          });
        })
        .catch((e) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Store Catalog Update Failed',
            life: 3000,
          });
        });
    } else {
      this.storeCatalogService
        .createStoreCatalog(data)
        .then((res: any) => {
          // this.createInventory();
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'StoreCatalog Created',
            life: 3000,
          });
          this.router.navigate(['/store/storecatalog/edit/' + res.id]);
        })
        .catch((e) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Store Catalog Create Failed ' + e.error.message,
            life: 3000,
          });
        });
    }
  }
  cancel() {
    this.router.navigate(['/store/storecatalog']);
  }

  getStorage() {
    if (this.storeCatalog) {
      this.storageService
        .getStorageByStoreCatalog(this.storeCatalog.id!)
        .then((data: any) => {
          this.inventory.storage = data;
          this.inventory.type = 'VPLUS';
        });
    }
  }

  createInventory(type: string) {
    this.inventory.type = type;
    if (this.inventory.type) {
      this.inventory.storeCatalog = this.storeCatalog;
      this.inventory.store = this.storeCatalog.store;
      this.inventoryService
        .createInventory(this.inventory)
        .then((res: any) => {
          this.inventory.quantity = '';
          this.getData();
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Inventory Created',
            life: 3000,
          });
        })
        .catch(() => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Inventory Create Failed',
            life: 3000,
          });
        });
    }
  }

  clearValues() {
    // if(!this.storeCatalog.local){
    // this.storeCatalog.id = '';
    // this.storeCatalog.name = '';
    // this.storeCatalog.category = '';
    // this.storeCatalog.productType = '';
    // this.storeCatalog.brand = '';
    // this.storeCatalog.mrp = 0;
    // this.storeCatalog.taxRate == null;
    // this.storeCatalog.barCode = '';
    // this.storeCatalog.hsnCode = '';
    // this.storeCatalog.landingCost = 0;
    // this.storeCatalog.sellingPrice =0
    // }else{
    // this.storeCatalog.distributor = null;
    // this.storeCatalog.product = "";
    // this.storeCatalog.landingCost = 0;
    // this.storeCatalog.sellingPrice = 0
    // }
  }
}
