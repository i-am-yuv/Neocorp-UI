import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DistributorWalkThorugh } from 'src/app/distributor/distributor-user/distributor-user';
import { DistributorUserService } from 'src/app/distributor/distributor-user/distributor-user.service';
import { Distributor } from 'src/app/masters/distributors/distributor';
import { DashboardService } from '../dashboard/dashboard.service';

@Component({
  selector: 'app-distributor-dashboard',
  templateUrl: './distributor-dashboard.component.html',
  styleUrls: ['./distributor-dashboard.component.scss'],
})
export class DistributorDashboardComponent implements OnInit {
  basicOptions: any;

  basicData: any;

  lineStylesData: any;
  distributor: any;

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
  store: any;
  forwardedPos: any;
  paidPos: any;

  selectedOption: any;
  getStarted!: boolean;
  companyStat?: any;
  catalogStat?: any;
  machineStat?: any;
  paymentMethodStat?: any;
  profileStatusStat?: any;
  storeStat?: any;
  getValues?: DistributorWalkThorugh;

  constructor(
    private distributorUserService: DistributorUserService,
    private dashboardService: DashboardService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.basicOptions = {
      scales: {
        yAxis: {
          min: 0,
        },
      },
    };
    this.basicData = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: 'My First dataset',
          backgroundColor: '#42A5F5',
          data: [],
        },
        {
          label: 'My Second dataset',
          backgroundColor: '#FFA726',
          data: [],
        },
      ],
    };

    this.lineStylesData = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: 'Third Dataset',
          data: [],
          fill: true,
          borderColor: '#42A5F5',
          tension: 0.4,
          backgroundColor: 'rgba(66, 165, 245,0.2)',
        },
      ],
    };
    this.getDistributor();
    this.getMetrics();
    this.getSalesChartData();

    this.selectedOption = 0;
  }
  getDistributor() {
    this.distributorUserService.getCurrentDistributor().then((res: any) => {
      this.distributor = res;

      this.distributorUserService
        .getWalkThroughDetails(this.distributor.distributor.id)
        .then((res: any) => {
          this.getValues = res;
          this.companyStat = this.getValues?.companyStatus;
          this.catalogStat = this.getValues?.catalog;
          this.paymentMethodStat = this.getValues?.paymentMethod;
          this.profileStatusStat = this.getValues?.profileStatus;
          this.getStarted =
            this.companyStat &&
            this.catalogStat &&
            this.paymentMethodStat &&
            this.profileStatusStat;
        });
    });
  }

  makeChartsData(dataSet: any[]) {
    // var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var chartLabels: string[] = [];
    var chartLabels1: string[] = [];
    var chartLabels2: string[] = [];
    var chartLabels3: string[] = [];

    dataSet[0].chartsData.forEach((t: any) => {
      chartLabels.push(t.label);
      chartLabels1.push(t.value);
    });

    dataSet[1].chartsData.forEach((t: any) => {
      chartLabels2.push(t.value);
    });

    dataSet[2].chartsData.forEach((t: any) => {
      chartLabels3.push(t.value);
    });

    this.lineStylesData = {
      labels: chartLabels,
      datasets: [
        {
          label: dataSet[0].title,
          data: chartLabels1,
          fill: true,
          borderColor: '#42A5F5',
          tension: 0.4,
          backgroundColor: 'rgba(66, 165, 245,0.2)',
        },
      ],
    };
    this.basicData = {
      labels: chartLabels,
      datasets: [
        {
          label: dataSet[1].title,
          backgroundColor: '#42A5F5',
          data: chartLabels2,
        },
        {
          label: dataSet[2].title,
          backgroundColor: '#FFA726',
          data: chartLabels3,
        },
      ],
    };
  }
  getMetrics() {
    this.dashboardService.getDistributorMetrics().then((res: any) => {
      this.panelsData = res;
    });
  }

  openCompany() {
    this.router.navigate(['/settings'], {
      queryParams: { options: 'COMPANY' },
    });
  }
  openProfile() {
    this.router.navigate(['/settings'], {
      queryParams: { options: 'ACCOUNT' },
    });
  }
  openProducts() {
    this.router.navigate(['/settings'], {
      queryParams: { options: 'DISTRIBUTOR' },
    });
  }
  openPayment() {
    this.router.navigate(['/settings'], {
      queryParams: { options: 'PAYMENT' },
    });
  }
  getSalesChartData() {
    this.dashboardService.getDistributorChartData().then((res: any) => {
      this.makeChartsData(res);
    });
  }

  getForwardedos() {
    this.dashboardService
      .getConfirmedByDistributor(this.distributor.id, 'FORWARDED')
      .then((res: any) => {
        this.forwardedPos = res.content;
      });
  }

  getPaidPos() {
    this.dashboardService
      .getConfirmedByDistributor(this.store.id, 'PAID')
      .then((res: any) => {
        this.paidPos = res.content;
      });
  }

  getDt(dt: any): any {
    if (dt) return new Date(dt);
  }

  readWalkThrough() {
    switch (this.selectedOption) {
      case 0:
        break;
      case 1:
        break;
      case 2:
        break;
      case 3:
        break;
      case 4:
        break;
      case 5:
        break;
    }
  }

  walkthroughOnclick(item: Number) {
    this.selectedOption = item;
  }

  openNew(distributor: Distributor) {
    // this.store = {};
    // this.store = { ...store };
    // this.storeDialog = true;
    // this.submitted = false;
    // this.storeDialog = true;
  }
}
