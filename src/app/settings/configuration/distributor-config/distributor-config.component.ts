import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { StateService } from 'src/app/masters/states/state.service';
import { Distributor } from 'src/app/masters/distributors/distributor';
import { DistributorUserService } from '../../distributor-users/distributor-user.service';
import { State } from 'src/app/masters/states/state';
import { DistributorService } from 'src/app/masters/distributors/distributorService';
import { CompanyService } from 'src/app/masters/companies/companyService';
import { DistributorUser } from '../../distributor-users/distributor-user';
import { Setting } from '../../settings/setting';
import { SettingService } from '../../settings/setting.service';
import { AuthService } from 'src/app/auth/auth.service';
import { whitespace, whitespacealpha } from 'src/app/dutch/custom.validators';
@Component({
  selector: 'app-distributor-config',
  templateUrl: './distributor-config.component.html',
  styleUrls: ['./distributor-config.component.scss'],
})
export class DistributorConfigComponent implements OnInit {
  items: MenuItem[] = [];

  activeSection: string = 'ACCOUNT';

  distributor: Distributor = {};
  fieldTextType!: boolean;
  companyFormDetails!: FormGroup;

  distForm!: FormGroup;
  accountFormDetails!: FormGroup;
  states: State[] = [];
  roles: any;
  mydistributors: Distributor[] = [];

  distributorUser: DistributorUser = { user: {} };
  setting: Setting = {};
  paymentMethodSettings: any[] = [];
  paymentForm: FormGroup = new FormGroup({});
  upiInvalid: boolean = false;
  constructor(
    private router: Router,
    private companyService: CompanyService,
    private stateService: StateService,
    private distributorUserService: DistributorUserService,
    private messageService: MessageService,
    private distributorService: DistributorService,
    private fb: FormBuilder,
    private authService: AuthService,
    private settingService: SettingService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['options']) {
        this.activeSection = params['options'];
      }
    });
    this.items = [
      {
        label: 'Configuration',
        items: [
          {
            label: 'Account',
            icon: 'pi pi-fw pi-briefcase',
            command: () => (this.activeSection = 'ACCOUNT'),
          },
          {
            label: 'Distributor',
            icon: 'pi pi-fw pi-shopping-bag',
            command: () => (this.activeSection = 'DISTRIBUTOR'),
          },
          {
            label: 'Company',
            icon: 'pi pi-fw pi-building',
            command: () => (this.activeSection = 'COMPANY'),
          },
          {
            label: 'Payment Methods',
            icon: 'pi pi-fw pi-money-bill',
            command: () => (this.activeSection = 'PAYMENT'),
          },
          { label: 'Utilities', icon: 'pi pi-fw pi-cog' },
          {
            label: 'Billing',
            icon: 'pi pi-fw pi-book',
            command: () =>
              this.router.navigate(['/settings/distributor-billing']),
          },
        ],
      },
    ];
    this.getDistributorUser();
    this.getStates();
    this.initForm();
    this.getRoles();
    this.companyForm();
    // this.accountForm();
  }

  initForm() {
    this.paymentForm = this.fb.group({
      methods: this.fb.array([
        // {
        //   methodName: '', fields: this.fb.array([{
        //     key: '',
        //     val: ''
        //   }])
        // }
      ]),
    });
    this.distForm = this.fb.group({
      id: [''],
      distributorName: [
        '',
        { nonNullable: true, validators: [Validators.required] },
      ],
      distributorLocation: [
        '',
        { nonNullable: true, validators: [Validators.required] },
      ],
      distributorAddress1: [
        '',
        { nonNullable: true, validators: [Validators.required] },
      ],
      distributorAddress2: [
        '',
        { nonNullable: true, validators: [Validators.required] },
      ],
      distributorPhone: [
        '',
        { nonNullable: true, validators: [Validators.required] },
      ],
      distributorMail: [
        '',
        {
          nonNullable: true,
          validators: [Validators.required, Validators.email],
        },
      ],
      state: this.fb.group({
        id: ['', { nonNullable: true, validators: [Validators.required] }],
      }),
      pincode: [
        '',
        {
          nonNullable: true,
          validators: [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(6),
          ],
        },
      ],
      gstNumber: [
        '',
        {
          nonNullable: true,
          validators: [
            Validators.required,
            Validators.minLength(15),
            Validators.maxLength(15),
            Validators.pattern(
              '^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$'
            ),
          ],
        },
      ],
    });
  }
  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }
  companyForm() {
    this.companyFormDetails = this.fb.group({
      id: [
        '',
        { nonNullable: true, validators: [Validators.required] },
      ],
      companyName: [
        '',
        { nonNullable: true, validators: [Validators.required] },
      ],
      companyPanNumber: [
        '',
        {
          nonNullable: true,
          validators: [
            Validators.required,
            Validators.pattern('^([A-Z]){5}([0-9]){4}([A-Z]){1}$'),
          ],
        },
      ],
      companyLocation: [
        '',
        { nonNullable: true, validators: [Validators.required] },
      ],
      companyAddress1: [
        '',
        { nonNullable: true, validators: [Validators.required] },
      ],
      companyAddress2: [
        '',
        { nonNullable: true, validators: [Validators.required] },
      ],
      state: [
        '',
        { nonNullable: true, validators: [Validators.required] },
      ],
      pincode: [
        '',
        {
          nonNullable: true,
          validators: [Validators.required, Validators.required,
            Validators.maxLength(6),
            Validators.minLength(6)]
        },
      ],
      companyPhone: [
        '',
        {
          nonNullable: true,
          validators: [
            Validators.required,
            Validators.maxLength(10),
            Validators.minLength(10),
            Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$'),
          ],
        },
      ],
      companyMail: [
        '',
        {
          nonNullable: true,
          validators: [Validators.required, Validators.email],
        },
      ],
    });
  }
  accountForm() {
    this.accountFormDetails = this.fb.group({
      loginMobile: [
        '',
        { nonNullable: true, validators: [Validators.required] },
      ],
      loginPassword: [
        '',
        { nonNullable: true, validators: [Validators.required] },
      ],
      userEmail: [
        '',
        {
          nonNullable: true,
          validators: [Validators.required, Validators.email],
        },
      ],
      userRoles: ['', { nonNullable: true, validators: [Validators.required] }],
      userFirstName: [
        '',
        { nonNullable: true, validators: [Validators.required] },
      ],
      userLastName: [
        '',
        { nonNullable: true, validators: [Validators.required] },
      ],
      distributorUserPhone: [
        '',
        {
          nonNullable: true,
          validators: [
            Validators.required,
            Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$'),
          ],
        },
      ],
    });
  }
  getPaymentSetting() {
    this.settingService.getSettingByKey('PAYMENT_METHODS').then((res: any) => {
      this.paymentMethodSettings = JSON.parse(res.settingValue);
      this.paymentMethodSettings.forEach((pm, i) => {
        this.methods().push(this.newMethod(pm.paymentMethod));
        pm.fields.forEach((field: any) => {
          var p = this.newProp(field.label);
          this.paymentProps(i).push(p);
        });
      });
      this.getPaymentSettingForDistributor();
    });
  }
  methods(): FormArray {
    return this.paymentForm.get('methods') as FormArray;
  }
  newMethod(key: string): FormGroup {
    return this.fb.group({
      paymentMethod: key,
      props: this.fb.array([]),
    });
  }

  paymentProps(mIndex: number): FormArray {
    return this.methods().at(mIndex).get('props') as FormArray;
  }

  newProp(key: string): FormGroup {
    return this.fb.group({
      key: key,
      val: '',
    });
  }

  getPaymentSettingForDistributor() {
    this.settingService
      .getSettingsByKeyAndDistributor('PAYMENT_METHODS', this.distributor.id)
      .then((res: any) => {
        this.setting = res;
        if (res.settingValue) {
          this.paymentForm.patchValue({ ...JSON.parse(res.settingValue) });
        }
      });
  }

  getMyDistributors() {
    console.log();
    var company = this.distributor.company;
    if (company) {
      this.distributorService
        .getDistributorsByCompany(company)
        .then((res: any) => {
          this.mydistributors = res;
        });
    }
  }

  getStates() {
    this.stateService
      .getStates(0, 10, '', 'DESC', '')
      .then((res: any) => (this.states = res));
  }

  getRoles() {
    this.distributorUserService
      .getRolesByType('DISTRIBUTOR')
      .then((data) => (this.roles = data));
  }
  savePaymentSettings() {
    const paymentSettings = this.paymentForm.value;

    paymentSettings.methods.forEach((ps: any) => {
      if (ps['paymentMethod'] === 'UPI') {
        var upiVals = ps['props'];
        var validate = false;
        this.upiInvalid = false;
        upiVals.forEach((kv: any) => {
          if (kv.key === 'enabled' && kv.val === true) validate = true;
        });
        if (validate) {
          upiVals.forEach((kv: any) => {
            if (kv.key !== 'enabled' && kv.val === '') {
              this.upiInvalid = true;
            }
          });
        }

        if (this.upiInvalid) {
          return;
        }
      }
    });

    if (this.setting.id) {
      this.setting.settingValue = JSON.stringify(this.paymentForm.value);
      this.settingService.updateSetting(this.setting).then((res: any) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Distributor Payment Methods Updated',
          life: 3000,
        });
      });
    } else {
      this.setting.distributor = this.distributor;
      this.setting.settingKey = 'PAYMENT_METHODS';
      this.setting.settingValue = JSON.stringify(this.paymentForm.value);
      this.settingService.createSetting(this.setting).then((res: any) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Distributor Payment Methods Saved',
          life: 3000,
        });
      });
    }
  }
  getDistributorUser() {
    this.distributorUserService.getCurrentDistributorUser().then((res: any) => {
      this.distributorUser = res;
      this.distributor = res.distributor;
      this.companyFormDetails.patchValue({ ...this.distributor.company });
      this.getMyDistributors();
      this.distForm.patchValue({ ...res.distributor });
      this.getPaymentSetting();
    });
  }

  get state() {
    return this.distForm.controls['state'] as FormGroup;
  }

  distFormSubmit() {
    this.distributorService
      .updateDistributor(this.distForm.value)
      .then((distributor: any) => {
        this.distForm.patchValue({ ...distributor });
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Distributor details updated',
        });
      });
  }
 
  saveCompany() {
      if(this.distributor?.company)
      {
      this.distributor.company = this.companyFormDetails.value ;
      console.log(JSON.stringify( this.distributor));
      this.companyService.updateCompany(this.distributor.company!).then(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Company details updated',
          life: 3000,
        });
      });

    }
  }

  setDefaultDistributor() {
    this.distForm.patchValue({ distributor: this.distributor });
    this.distributorUserService
      .updateDistributorUser(this.distributorUser)
      .then(() => {
        this.getDistributorUser();
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Default Distributor Updated',
          life: 3000,
        });
      });
  }

  saveDistributorUser() {
    if (this.distributorUser.firstName?.trim()) {
      if (this.distributorUser.id) {
        var _distributorUser = this.distributorUser;
        this.distributorUserService
          .updateDistributorUser(_distributorUser)
          .then((res: any) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Distributor User Updated',
              life: 3000,
            });
          });
      }
      //this.distributorUser = {};
    }
  }
}
