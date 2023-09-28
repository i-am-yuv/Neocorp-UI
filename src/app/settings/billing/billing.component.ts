import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { AuthService } from 'src/app/auth/auth.service';
import { StoreUserService } from 'src/app/store/store-user/store-user.service';
import { SettingService } from '../settings/setting.service';

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss'],
})
export class BillingComponent implements OnInit {
  plans: any[] = [
    { id: 1, name: 'Stater', cost: 1999 },
    { id: 2, name: 'Standard', cost: 5999 },
    { id: 3, name: 'Volume', cost: 10999 },
  ];
  activePlan: any = { id: 2, name: 'Standard', cost: 5999 };
  showQr: boolean = false;
  paymentDone: boolean = false;
  showOptions: boolean = true;
  store: any;
  subActive: boolean = false;
  upiUrl: string = '';
  home!: MenuItem;
  items: MenuItem[] = [];
  customPackDetails!: FormGroup;

  constructor(
    private storeUserService: StoreUserService,
    private settingService: SettingService,
    private fb: FormBuilder,
    private authService: AuthService
  ) {}
  changePlan(no: number) {
    this.activePlan = this.plans.find((t) => t.id === no);

    this.showQr = true;
    this.getUpiUrl(this.activePlan.cost);
  }

  getPlanCost(no: number) {
    var plan = this.plans.find((t) => t.id === no);
    return plan.cost;
  }

  getCustomPlans() {
    this.customPackDetails = this.fb.group({
      amount: [
        11999,
        [Validators.required, Validators.min(11999), Validators.max(29999)],
      ],
    });
  }

  planDetails() {
    var customValue = this.customPackDetails.value;

    this.activePlan = { id: 4, name: 'Custom', cost: customValue.amount };
    this.showQr = true;
    this.getUpiUrl(customValue.amount);
  }

  ngOnInit(): void {
    this.getStore();
    this.getCustomPlans();
    this.items = [
      { label: ' Settings', routerLink: '/settings' },
      // { label: ' Billing', routerLink: '/settings' },
      {
        label: ' Service Packs',
        routerLink: '/settings/billing',
        // command: () => this.router.navigate(['/settings/billing']),
      },
    ];
    this.home = this.home = { icon: 'pi pi-home', routerLink: '/dashboard' };
  }

  activateStore() {
    this.showQr = false;
    this.paymentDone = true;
    this.showOptions = false;
  }

  getStore() {
    // this.storeUserService.getCurrentStore().then((res: any) => {
    //   this.store = res;
    //   this.subActive = res.company.subscriptionActive;
    // });

    this.storeUserService
      .getStore(this.authService.getUserId())
      .then((store) => {
        this.store = store;
        this.subActive = store.company.subscriptionActive;
      });
  }

  getUpiUrl(amount: number) {
    if (amount) {
      this.settingService
        .getSplentaUpiUrl(amount, 'NeoMaxer Subscription')
        .then((res: string) => {
          this.upiUrl = res;
        });
    }
  }
}
