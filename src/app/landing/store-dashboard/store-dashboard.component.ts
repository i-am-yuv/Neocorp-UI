import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Company } from 'src/app/masters/companies/company';
import { State } from 'src/app/masters/states/state';
import { Store } from 'src/app/masters/stores/store';
import { StoreService } from 'src/app/masters/stores/store.service';
import { PurchaseOrderService } from 'src/app/store/purchase-order/purchase-order.service';
import { StoreWalkThorugh } from 'src/app/store/store-user/store-user';
import { StoreUserService } from 'src/app/store/store-user/store-user.service';
import { DashboardService } from '../dashboard/dashboard.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-store-dashboard',
  templateUrl: './store-dashboard.component.html',
  styleUrls: ['./store-dashboard.component.scss'],
})
export class StoreDashboardComponent implements OnInit {
  basicOptions: any;
  companyStat?: any;
  catalogStat?: any;
  machineStat?: any;
  paymentMethodStat?: any;
  profileStatusStat?: any;
  storeStat?: any;

  basicData: any;
  storeDialog!: boolean;
  lineStylesData: any;
  companies: Company[] = [];
  companyStatus: any = false;
  states: State[] = [];
  global: boolean = true;
  company: any;
  getValues?: StoreWalkThorugh;
  stores!: Store[];

  store: Store = {};
  storeValId: any;
  selectedStores!: any;

  submitted!: boolean;
  getStarted!: boolean;

  panelsData: any[] = [
    {
      title: 'Orders',
      metric: '0',
      submetric: '0 new',
      period: 'this week',
      icon: 'shopping-cart',
      color: 'blue',
    },
    {
      title: 'Revenue',
      metric: '0',
      submetric: '0 new',
      period: 'this week',
      icon: 'map-marker',
      color: 'orange',
    },
    {
      title: 'Quantities Sold',
      metric: '0',
      submetric: '0 new',
      period: 'this week',
      icon: 'inbox',
      color: 'cyan',
    },
    {
      title: 'Expense',
      metric: '0',
      submetric: '0 new',
      period: 'this week',
      icon: 'comment',
      color: 'purple',
    },
  ];
  confirmedPos: any;
  live: boolean = true;
  shippedPos: any;
  detailedWalkthrough: any;

  selectedOption: any;

  constructor(
    private storeUserService: StoreUserService,
    private dashboardService: DashboardService,
    private purchaseOrderService: PurchaseOrderService,
    private router: Router,
    private storeService: StoreService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.basicOptions = {
      scales: {
        yAxis: {
          min: 0,
        },
      },
    };

    this.getStore();
    this.getMetrics();
    this.getSalesChartData();
    this.getValidate(this.store.id);

    if (this.router.url.includes('my-stores')) {
      this.storeUserService.getCurrentStore().then((res: any) => {
        this.global = false;
        this.company = res.company;
        this.storeService
          .getStoresByCompany(res.company.id, 0, 10, '', 'DESC', '')
          .then((data) => (this.stores = data));
      });
    } else {
      // this.storeService.getStores(0, 10).then((data) => (this.stores = data));
    }
    this.storeService.getCompanies().then((data) => (this.companies = data));
    this.storeService.getStates().then((data) => (this.states = data));

    this.selectedOption = 0;
  }
  getValidate(storeIdd: any) {
    this.storeUserService.getCurrentStore().then((res: any) => {
      this.store = res.store;
      this.storeUserService.getAllDetails(this.store.id).then((res: any) => {
        this.getValues = res;
        this.companyStat = this.getValues?.companyStatus;
        this.catalogStat = this.getValues?.catalog;
        this.machineStat = this.getValues?.machine;
        this.paymentMethodStat = this.getValues?.paymentMethod;
        this.profileStatusStat = this.getValues?.profileStatus;
        this.storeStat = this.getValues?.storeStatus;
        this.getStarted =
          this.companyStat &&
          this.catalogStat &&
          this.machineStat &&
          this.paymentMethodStat &&
          this.profileStatusStat &&
          this.storeStat;
      });
    });
  }
  getStore() {
    this.storeUserService.getCurrentStore().then((res: any) => {
      this.store = res;
      this.getConfirmedPos();
    });
  }
  hideDialog() {
    this.storeDialog = false;
    this.submitted = false;
  }
  makeSalesData(dataSet: any[]) {
    // var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var salesChartLabels1: string[] = [];
    var salesChartLabels2: string[] = [];
    var salesChartLabels3: string[] = [];
    var salesChartValues1: string[] = [];
    var salesChartValues2: string[] = [];
    var salesChartValues3: string[] = [];

    dataSet[0].chartsData.forEach((t: any) => {
      salesChartLabels1.push(t.label);
      salesChartValues1.push(t.value);
    });

    dataSet[1].chartsData.forEach((t: any) => {
      salesChartLabels2.push(t.label);
      salesChartValues2.push(t.value);
    });

    dataSet[2].chartsData.forEach((t: any) => {
      salesChartLabels3.push(t.label);
      salesChartValues3.push(t.value);
    });

    this.lineStylesData = {
      labels: salesChartLabels1,
      datasets: [
        {
          label: dataSet[0].title,
          data: salesChartValues1,
          fill: true,
          borderColor: '#42A5F5',
          tension: 0.4,
          backgroundColor: 'rgba(66, 165, 245,0.2)',
        },
      ],
    };
    this.basicData = {
      labels: salesChartLabels2,
      datasets: [
        {
          label: dataSet[1].title,
          backgroundColor: '#42A5F5',
          data: salesChartValues2,
        },
        {
          label: dataSet[2].title,
          backgroundColor: '#FFA726',
          data: salesChartValues3,
        },
      ],
    };
  }
  editStore(store: Store) {
    this.store = { ...store };
    this.storeDialog = true;
  }
  getMetrics() {
    this.dashboardService.getStoreMetrics().then((res: any) => {
      this.panelsData = res;
    });
  }

  getSalesChartData() {
    this.dashboardService.getSalesChartData().then((res: any) => {
      this.makeSalesData(res);
    });
  }
  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.stores.length; i++) {
      if (this.stores[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  }
  openCompany() {
    // this.store = {};
    // this.store = { ...store };
    // this.storeDialog = true;
    // this.submitted = false;
    // this.storeDialog = true;
    this.router.navigate(['/settings'], {
      queryParams: { options: 'COMPANY' },
    });
  }

  openStore() {
    this.router.navigate(['/settings'], { queryParams: { options: 'STORE' } });
  }
  openCompleteProfile() {
    this.router.navigate(['/settings'], {
      queryParams: { options: 'ACCOUNT' },
    });
  }

  openPayment() {
    this.router.navigate(['/settings'], {
      queryParams: { options: 'PAYMENT' },
    });
  }
  openAddProducts() {
    this.router.navigate(['/store/storecatalog']);
  }

  openPosMachine() {
    this.router.navigate(['/store/posmachines']);
  }

  getConfirmedPos() {
    this.dashboardService
      .getConfirmedByStore(this.store.id, 'CONFIRMED')
      .then((res: any) => {
        this.confirmedPos = res.content;
      });
  }
  readWalkThrough() {
    var baseUrl = environment.docsurl;
    switch (this.selectedOption) {
      case 0:
        window.open(baseUrl + '/store/#/company_details', '_blank');
        break;
      case 1:
        window.open(baseUrl + '/store/#/setup_store_details', '_blank');
        break;
      case 2:
        window.open(baseUrl + '/store/#/complete_profile', '_blank');
        break;
      case 3:
        window.open(baseUrl + '/store/#/add_products', '_blank');
        break;
      case 4:
        window.open(baseUrl + '/store/#/payments_methods', '_blank');
        break;
      case 5:
        window.open(baseUrl + '/store/#/POS_machines', '_blank');
        break;
    }

    // this.dashboardService.getReadWalkthrough(this.store.id)
    //   .then((res: any) => {
    //
    //     // this.detailedWalkthrough = res.content;
    //
    //   })
  }

  walkthroughOnclick(item: Number) {
    this.selectedOption = item;
  }

  getShippedPos() {
    this.dashboardService
      .getConfirmedByStore(this.store.id, 'SHIPPED')
      .then((res: any) => {
        this.shippedPos = res.content;
      });
  }

  getDt(dt: any): any {
    if (dt) return new Date(dt);
  }

  saveStore() {
    this.submitted = true;
    if (!this.global) {
      this.store.company = this.company;
    }
    if (this.store.storeName?.trim()) {
      if (this.store.id) {
        this.storeService.updateStore(this.store).then((res: any) => {
          // this.stores.push(res);
          this.stores[this.findIndexById(res.id)] = res;
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Store Updated',
            life: 3000,
          });
        });
      } else {
        this.storeService.createStore(this.store).then((res: any) => {
          this.stores.push(res);
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Store Created',
            life: 3000,
          });
        });
      }

      this.stores = [...this.stores];
      this.storeDialog = false;
      this.store = {};
    }
  }
}
