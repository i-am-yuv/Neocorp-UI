import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { DistributorUserService } from '../distributor-users/distributor-user.service';
import { SettingService } from '../settings/setting.service';

@Component({
  selector: 'app-distributor-billing',
  templateUrl: './distributor-billing.component.html',
  styleUrls: ['./distributor-billing.component.scss'],
})
export class DistributorBillingComponent implements OnInit {
  plans: any[] = [
    { id: 1, name: 'Basic', cost: 24999 },
    { id: 2, name: 'Essential', cost: 39999 },
    { id: 3, name: 'Premium', cost: 55999 },
  ];
  activePlan: any = { id: 2, name: 'Essential', cost: 3499 };
  showQr: boolean = false;
  paymentDone: boolean = false;
  showOptions: boolean = true;
  distributor: any;
  subActive: boolean = false;
  upiUrl: string | undefined;
  home!: MenuItem;
  items: MenuItem[] = []

  constructor(
    private distributorUserService: DistributorUserService,
    private settingService: SettingService
  ) {}

  ngOnInit(): void {
    this.getDistributor();
    this.items = [
      { label: ' Billing' , routerLink: '/settings' , icon: 'pi pi-chevron-left',},
    ];
  }

  changePlan(no: number) {
    this.activePlan = this.plans.find((t) => t.id === no);
    this.getUpiUrl(this.activePlan.cost);
    this.showQr = true;
    this.showOptions = false;
  }

  activateDistributor() {
    this.showQr = false;
    this.paymentDone = true;
    this.showOptions = false;
  }

  getPlanCost(no: number) {
    var plan = this.plans.find((t) => t.id === no);
    return plan.cost;
  }

  getDistributor() {
    this.distributorUserService.getCurrentDistributorUser().then((res: any) => {
      this.distributor = res.distributor;
      this.subActive = res.company.subscriptionActive;
    });
  }

  getUpiUrl(amount: number) {
    this.settingService
      .getSplentaUpiUrl(amount, 'NeoMaxer Subscription')
      .then((res: string) => {
        this.upiUrl = res;
      });
  }
}
