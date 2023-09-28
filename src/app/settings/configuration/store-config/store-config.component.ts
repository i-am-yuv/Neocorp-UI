import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as saveAs from 'file-saver';
import { TrurthifyPipe } from 'ngx-pipes';
import { MenuItem, MessageService } from 'primeng/api';
import { AuthService } from 'src/app/auth/auth.service';
import { CompanyService } from 'src/app/masters/companies/companyService';
import { State } from 'src/app/masters/states/state';
import { StateService } from 'src/app/masters/states/state.service';
import { Store } from 'src/app/masters/stores/store';
import { StoreService } from 'src/app/masters/stores/store.service';
import { GstReportServiceService } from 'src/app/store/gst-reports/gst-report-service.service';
import { StoreUserService } from 'src/app/store/store-user/store-user.service';
import { environment } from 'src/environments/environment';
import { Setting } from '../../settings/setting';
import { SettingService } from '../../settings/setting.service';
import { StoreUser } from '../../store-users/store-user';

@Component({
  selector: 'app-store-config',
  templateUrl: './store-config.component.html',
  styleUrls: ['./store-config.component.scss'],
})
export class StoreConfigComponent implements OnInit {
  items: MenuItem[] = [];
  utilities: MenuItem[] = [];
  activeItem!: MenuItem;
  storeCatalogUploadUrl: string =
    environment.apiurl + '/storeCatalog/bulk/create/';

  store: Store = {};

  storeForm!: FormGroup;
  companyFormDetails!: FormGroup;
  accountFormDetails!: FormGroup;
  form!: FormGroup;
  paymentForm: FormGroup = new FormGroup({});

  activeSection: string | null = 'ACCOUNT';
  states: State[] = [];

  storeUser: StoreUser = { user: {} };

  roles: any;
  upi: boolean = false;
  cash: boolean = true;
  UPIID: string = '';
  mystores: Store[] = [];
  paymentMethodSettings: any[] = [];
  storePaymentMethods: any[] = [];
  setting: Setting = {};
  blob: any;
  gstReportDialog!: boolean;
  readOnly: boolean = false;
  utilitiesForm: FormGroup = new FormGroup({});
  submitted: boolean = false;

  fromDate!: String;
  toDate!: String;
  home!: MenuItem;
  items1: MenuItem[] = [];

  storeId: any;
  typeofReport: any;
  id: string | null = '';
  fieldTextType!: boolean;
  upiInvalid: boolean = false;

  constructor(
    private router: Router,
    private storeService: StoreService,
    private companyService: CompanyService,
    private storeUserService: StoreUserService,
    private stateService: StateService,
    private messageService: MessageService,
    private authService: AuthService,
    private settingService: SettingService,
    private fb: FormBuilder,
    private gstReportServiceService: GstReportServiceService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // this.id = this.route.snapshot.paramMap.get('id')
    // if(this.route.snapshot.paramMap.get('options')){
    // this.activeSection = this.route.snapshot.paramMap.get('options');
    // }

    this.route.queryParams.subscribe((params) => {
      if (params['options']) this.activeSection = params['options'];
    });
    this.accountForm();
    this.storeUserService
      .getStoreUserByUser(this.authService.getUserId())
      .then((storeUser) => {
        this.accountFormDetails.patchValue({ ...storeUser });
      });
    this.storeUserService
      .getStore(this.authService.getUserId())
      .then((store) => {
        this.store = store;
        this.storeForm.patchValue({ ...store });
        this.companyForm();
        this.companyFormDetails.patchValue({ ...store.company });
        this.getPaymentSetting();
        this.getMyStores();
        this.getStoreUser();
        this.storeCatalogUploadUrl += store.id;
        this.storeId = store.id;
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
            label: 'Store',
            icon: 'pi pi-fw pi-shopping-bag',
            command: () => (this.activeSection = 'STORE'),
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
          {
            label: 'Utilities',
            icon: 'pi pi-fw pi-cog',
            command: () => (this.activeSection = 'UTILITIES'),
          },
          {
            label: 'Billing',
            icon: 'pi pi-fw pi-book',
            command: () => this.router.navigate(['/settings/billing']),
          },
        ],
      },
    ];
    // this.getStore();

    this.initForm();
    this.getStates();
    this.getRoles();

    // this.gstReportForm();

    this.utilities = [
      {
        label: 'Bulk Upload',
        icon: 'pi pi-file-import',
        command: () => (this.activeSection = 'BULKUPLOAD'),
      },
      { label: 'GST Reports', icon: 'pi pi-file-pdf' },
      { label: 'Export', icon: 'pi pi-file-export' },
    ];
    this.activeItem = this.items[0];

    this.items1 = [{ label: 'Store Configuration' }];
    this.home = { icon: 'pi pi-home', routerLink: '/dashboard' };
  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
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
      this.getPaymentSettingForStore();
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
  getMyStores() {
    this.storeService
      .getStoresByCompany(this.store.company!.id, 0, 10, '', 'DESC', '')
      .then((res: any) => {
        this.mystores = res.content;
      });
  }
  getStoreUser() {
    var userId = this.authService.getUserId();
    this.storeUserService.getStoreUserByUser(userId).then((data: any) => {
      this.storeUser = data;
    });
  }
  getRoles() {
    this.storeUserService
      .getRolesByType('STORE')
      .then((data) => (this.roles = data));
  }
  getStates() {
    this.stateService
      .getStates(0, 10, '', 'DESC', '')
      .then((res: any) => (this.states = res));
  }
  getStore() {
    this.storeUserService.getCurrentStore().then((res: any) => {
      this.store = res.store;
      this.storeForm.patchValue({ ...res.store });
    });
  }
  get state() {
    return this.storeForm.controls['state'] as FormGroup;
  }
  initForm() {
    this.storeForm = this.fb.group({
      id: [''],
      storeName: ['', { nonNullable: true, validators: [Validators.required] }],
      storeLocation: [
        '',
        { nonNullable: true, validators: [Validators.required] },
      ],
      storeAddress1: [
        '',
        { nonNullable: true, validators: [Validators.required] },
      ],
      storeAddress2: [
        '',
        { nonNullable: true, validators: [Validators.required] },
      ],
      storePhone: [
        '',
        { nonNullable: true, validators: [Validators.required] },
      ],
      storeMail: [
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
        null,
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
  }
  companyForm() {
    this.companyFormDetails = this.fb.group({
      id: ['', { nonNullable: true }],
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
      companyAddress1: [
        '',
        { nonNullable: true, validators: [Validators.required] },
      ],
      companyAddress2: [
        '',
        { nonNullable: true, validators: [Validators.required] },
      ],
      companyLocation: [
        '',
        { nonNullable: true, validators: [Validators.required] },
      ],
      state: ['', { nonNullable: true, validators: [Validators.required] }],
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
      companyPhone: [
        '',
        {
          nonNullable: true,
          validators: [
            Validators.required,
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
      // loginMobile: ['', { nonNullable: true, validators: [Validators.required] }],
      // loginPassword: ['', { nonNullable: true, validators: [Validators.required] }],
      email: [
        '',
        {
          nonNullable: true,
          validators: [Validators.required, Validators.email],
        },
      ],
      // userRoles: ['', { nonNullable: true, validators: [Validators.required] }],
      firstName: ['', { nonNullable: true, validators: [Validators.required] }],
      lastName: ['', { nonNullable: true, validators: [Validators.required] }],
      phone: [
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
  storeFormSubmit() {
    this.storeService.updateStore(this.storeForm.value).then((store: any) => {
      this.storeForm.patchValue({ ...store });
      this.messageService.add({
        severity: 'success',
        summary: 'success',
        detail: 'Store details updated',
      });
    });
  }

  saveStoreUser() {
    this.storeUser.firstName = this.accountFormDetails.value.firstName ;
    this.storeUser.lastName = this.accountFormDetails.value.lastName ;
    this.storeUser.phone = this.accountFormDetails.value.phone ;
    this.storeUser.email = this.accountFormDetails.value.email ;

    if (this.storeUser.firstName?.trim()) {
      if (this.storeUser.id) {
        var _storeUser = this.storeUser;
        this.storeUserService.updateStoreUser(_storeUser).then((res: any) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'StoreUser Updated',
            life: 3000,
          });
        });
      }
      //this.storeUser = {};
    }
  }

  saveCompany() {
    this.submitted = true;
    this.companyService
      .updateCompany(this.companyFormDetails.value)
      .then(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Company Details Updated',
          life: 3000,
        });
      });
  }

  setDefaultStore() {
    this.storeUser.store = this.store;
    this.storeUserService.updateStoreUser(this.storeUser).then(() => {
      this.getStore();
      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Default Store Updated',
        life: 3000,
      });
    });
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
    if (this.upiInvalid) {
      return;
    }

    if (this.setting.id) {
      this.setting.settingValue = JSON.stringify(this.paymentForm.value);
      this.settingService.updateSetting(this.setting).then((res: any) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Store Payment Methods Updated',
          life: 3000,
        });
      });
    } else {
      this.setting.store = this.store;
      this.setting.settingKey = 'PAYMENT_METHODS';
      this.setting.settingValue = JSON.stringify(this.paymentForm.value);
      this.settingService.createSetting(this.setting).then((res: any) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Store Payment Methods Saved',
          life: 3000,
        });
      });
    }
  }

  getPaymentSettingForStore() {
    this.settingService
      .getSettingsByKeyAndStore('PAYMENT_METHODS', this.store.id)
      .then((res: any) => {
        this.setting = res;
        if (res.settingValue) {
          this.paymentForm.patchValue({ ...JSON.parse(res.settingValue) });
        }
      });
  }

  importResponseHandler(event: any) {
    if (event.originalEvent.status === 200) {
      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'All records imported successfully',
        life: 5000,
      });
    }
  }
  importErrorHandler(event: any) {
    //
    var array = event.error.error.text.split(/\r?\n/);
    var count = array.length - 2;
    var final = count + ' Invalid  records';
    this.messageService.add({
      severity: 'error',
      summary: 'Import Error',
      detail: final,
      life: 5000,
    });

    var blob = new Blob([event.error.error.text], {
      type: 'text/plain',
    });
    saveAs(blob, 'StoreCatalogImportError.csv');
    setTimeout(HelloWorld, 4000);
    function HelloWorld() {
      window.location.reload();
    }
  }

  exportCSV(keytype: any) {
    this.gstReportDialog = true;
    this.typeofReport = keytype;

    // this.gstReportServiceService
    //   .getPdf(keytype, this.fromDate, this.toDate)
    //   .subscribe((data: any) => {
    //
    //     this.blob = new Blob([data], { type: 'application/pdf' });
    //     var downloadURL = window.URL.createObjectURL(data);
    //     var link = document.createElement('a');
    //     link.href = downloadURL;
    //     link.download = keytype + '.pdf';
    //     link.click();
    //   });
  }

  // getPdfReport(type: String) {

  //   const format = 'YYYY-MM-dd';
  //   const myDate = '2023-02-03';
  //   const locale = 'en-US';
  //   this.fromDate = formatDate(this.form.get('fromDate')!.value, format, locale).toString();
  //   this.toDate = formatDate(this.form.get('toDate')!.value, format, locale).toString();

  //
  //
  //
  //
  //   this.gstReportServiceService
  //     .getPdf(type, this.fromDate, this.toDate, this.storeId)
  //     .subscribe((data: any) => {
  //
  //       this.blob = new Blob([data], { type: 'application/pdf' });
  //       var downloadURL = window.URL.createObjectURL(data);
  //       var link = document.createElement('a');
  //       link.href = downloadURL;
  //       link.download = this.typeofReport + '.pdf';
  //       link.click();
  //     });
  // }

  getExcel() {
    if (this.typeofReport == 'GSTR2A') {
      alert('working in progress');
    } else {
      const format = 'YYYY-MM-dd';
      const myDate = '2023-02-03';
      const locale = 'en-US';
      this.fromDate = formatDate('2023-01-10', format, locale).toString();
      this.toDate = formatDate('2023-02-03', format, locale).toString();
      this.gstReportServiceService
        .downloadExcel(
          this.typeofReport,
          this.storeId,
          this.fromDate,
          this.toDate
        )
        .subscribe((blob) => saveAs(blob, 'VendorImportTemplate.xlsx'));
    }
  }
}
