import { Component, OnInit, ViewChild } from '@angular/core';
import {
  MessageService,
  ConfirmationService,
  MenuItem,
  LazyLoadEvent,
} from 'primeng/api';
import { Table } from 'primeng/table';
import { FilterBuilder } from 'src/app/utils/FilterBuilder';
import { State } from '../states/state';
import { StateService } from '../states/state.service';
import { Company } from './company';
import { CompanyService } from './companyService';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.scss'],
})
export class CompaniesComponent implements OnInit {
  companyDialog!: boolean;

  companies!: Company[];

  company!: Company;

  states: State[] = [];

  selectedCompanies!: any;

  submitted!: boolean;

  totalRecords: number = 0;
  home!: MenuItem;
  items: MenuItem[] = [];
  sortField: string = '';
  search: string = '';
  pageNo: number = 0;
  pageSize: number = 10;
  sortDir: string = 'DESC';

  @ViewChild('dt') dt: Table | undefined;

  constructor(
    private stateService: StateService,
    private companyService: CompanyService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.stateService
      .getStates(this.pageNo, 1000, 'stateName', 'ASC', this.search)
      .then((data) => (this.states = data));
    this.items = [{ label: 'Companies' }];
    this.home = { icon: 'pi pi-home', routerLink: '/dashboard' };
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
  loadData(event: LazyLoadEvent) {
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
      var filtercols = ['companyName', 'companyLocation'];
      filter = FilterBuilder.build(filtercols, this.search);
    }
    this.companyService
      .getCompanies(
        this.pageNo,
        this.pageSize,
        this.sortField,
        this.sortDir,
        filter
      )
      .then((data) => {
        if (data) {
          this.companies = data.content;

          this.totalRecords = data.totalElements;
        }
      });
    // this.stateService.getStates(this.pageNo, this.pageSize, this.sortField, this.sortDir, this.search).then((data) => (this.states = data));
  }
  // loadData(params: any) {

  // this.companyService.getCompanies(params).then((data) => {
  //   this.companies = data.content;
  //   this.totalRecords = data.totalElements;
  // });
  // }
  openNew() {
    this.company = {};
    this.submitted = false;
    this.companyDialog = true;
  }

  deleteSelectedCompanies() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected Companys?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.companies = this.companies.filter(
          (val) => !this.selectedCompanies.includes(val)
        );
        this.selectedCompanies = null;
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Companys Deleted',
          life: 3000,
        });
      },
    });
  }

  editCompany(company: Company) {
    this.company = { ...company };
    this.companyDialog = true;
  }

  deleteCompany(company: Company) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + company.companyName + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.companyService.deleteCompany(company).then((data) => {
          this.companies = this.companies.filter(
            (val) => val.id !== company.id
          );
          this.company = {};
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Company Deleted',
            life: 3000,
          });
        });
      },
    });
  }

  hideDialog() {
    this.companyDialog = false;
    this.submitted = false;
  }

  saveCompany() {
    this.submitted = true;

    if (this.company.companyName?.trim()) {
      if (this.company.id) {
        this.companyService.updateCompany(this.company).then((res: any) => {
          // this.companies.push(res);
          this.companies[this.findIndexById(res.id)] = res;
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Company Updated',
            life: 3000,
          });
        });
      } else {
        this.companyService.createCompany(this.company).then((res: any) => {
          this.companies.push(res);
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Company Created',
            life: 3000,
          });
        });
      }

      this.companies = [...this.companies];
      this.companyDialog = false;
      this.company = {};
    }
  }

  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.companies.length; i++) {
      if (this.companies[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  }

  // applyFilterGlobal($event: any, stringVal: any) {
  //
  //   this.dt?.filterGlobal(
  //     ($event.target as HTMLInputElement).value,
  //     'contains'
  //   );
  // }
}
