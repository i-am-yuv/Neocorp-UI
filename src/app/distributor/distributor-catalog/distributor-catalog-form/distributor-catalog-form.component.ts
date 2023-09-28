import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { AuthService } from 'src/app/auth/auth.service';
import { ProductService } from 'src/app/masters/products/product.service';
import { DistributorUserService } from 'src/app/distributor/distributor-user/distributor-user.service';
import { WhInventory } from '../../wh-inventory/wh-inventory';
import { DistributorCatalog } from '../distributor-catalog';
import { DistributorCatalogService } from '../distributor-catalog.service';
import { StorageService } from 'src/app/store/stock/storage.service';
import { InventoryService } from 'src/app/store/inventory/inventory.service';
import { Product } from 'src/app/masters/products/product';

@Component({
  selector: 'app-distributor-catalog-form',
  templateUrl: './distributor-catalog-form.component.html',
  styleUrls: ['./distributor-catalog-form.component.scss']
})
export class DistributorCatalogFormComponent implements OnInit {

  distributorCatalog: DistributorCatalog = {};

  distributors: any[] = [];

  distributorCatalogs: any[] = [];

  submitted!: boolean;

  @ViewChild('dt') dt: Table | undefined;

  products: Product[] = [];

  inventory: WhInventory = {};
  home!: MenuItem;
  items: MenuItem[] = [];

  invType: any[] = [{
    name: 'ADD', code: 'VPLUS'
  }, {
    name: 'REDUCE', code: 'VMINUS'
  }];
  id: string | null = '';
  productCategories: any;
  brands: any;
  taxRates: any;
  productTypes: any[] = ['ITEM', 'SERVICE'];
  distributor: any;

  constructor(
    private authService: AuthService,
    private storageService: StorageService,
    private inventoryService: InventoryService,
    private distributorUserService: DistributorUserService,
    private distributorCatalogService: DistributorCatalogService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute,
    private productService: ProductService) { }

  ngOnInit(): void {
    this.items = [
      { label: ' Distributor Catlog', icon: 'pi pi-chevron-left' , routerLink: '/distributor/distributorcatalog'},
    ];
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.getData();
    } else {
      this.distributorUserService.getDistributorUser(this.authService.getUserId()).then((distributor) => {
        this.distributor = distributor;
        this.distributorCatalog.distributor = distributor.distributor;
      });
    }
    this.distributorCatalogService.getProducts().then(data => this.products = data);
  }

  getData() {
    this.distributorCatalogService.getDistributorCatalog(this.id!).then((data: any) => {
      this.distributorCatalog = data;
      // this.getStorage();
      // this.getDistributorCatalogs(this.distributorCatalog.product);
    });
  }
  // getDistributorCatalogs(product: any) {
  //   if (product) {
  //     this.distributorCatalogService.getDistributorCatalogs(product.id, this.distributorCatalog.distributor).then(data => {
  //       this.distributorCatalogs = data
  //     });
  //   }
  // }

  // getDistributorLandingCost(distributor: any) {
  //   if (this.distributorCatalogs.length > 0 && distributor) {
  //     var dc = this.distributorCatalogs.find(t => t.distributor.id === distributor.id);
  //     return dc.landingCost;
  //   }
  //   return 0;
  // }

  setLandingCost(landingCost: any) {
    this.distributorCatalog.landingCost = landingCost;
  }


  saveDistributorCatalog() {
    this.submitted = true;
    // this.distributorCatalog = this.distributorCatalogForm.value;
    var data = this.distributorCatalog;
    if (data.id) {
      this.distributorCatalogService.updateDistributorCatalog(data).then((res: any) => {
        this.createInventory();
        this.getData();
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'DistributorCatalog Updated', life: 3000 });
      }).catch((e) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Distributor Catalog Update Failed', life: 3000 });
      });
    } else {
      this.distributorCatalogService.createDistributorCatalog(data).then((res: any) => {
        this.createInventory();
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'DistributorCatalog Created', life: 3000 });
        this.router.navigate(['/distributor/distributorcatalog/edit/' + res.id]);
      }).catch((e) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Distributor Catalog Create Failed ' + e.error.message, life: 3000 });
      });
    }
  }
  cancel() {
    this.router.navigate(['/distributor/distributorcatalog']);
  }

  // getStorage() {
  //   if (this.distributorCatalog) {
  //     this.storageService.getStorageByDistributorCatalog(this.distributorCatalog.id!).then((data: any) => {
  //       this.inventory.storage = data;
  //       this.inventory.type = 'VPLUS';
  //     })
  //   }
  // }
  createInventory() {
    if (this.inventory.type) {
      this.inventory.distributorCatalog = this.distributorCatalog;
      // this.inventory.warehouse = this.distributorCatalog.warehouse;
      this.inventoryService.createInventory(this.inventory).then((res: any) => {
        this.inventory.quantity = '';
      }).catch(() => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Inventory Create Failed', life: 3000 });
      })
    }
  }

}
