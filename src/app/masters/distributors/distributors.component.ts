import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {
  MessageService,
  ConfirmationService,
  MenuItem,
  LazyLoadEvent,
} from 'primeng/api';
import { Table } from 'primeng/table';
import { DistributorUserService } from 'src/app/distributor/distributor-user/distributor-user.service';
import { FilterBuilder } from 'src/app/utils/FilterBuilder';
import { Company } from '../companies/company';
import { State } from '../states/state';
import { Distributor } from './distributor';
import { DistributorService } from './distributorService';

@Component({
  selector: 'app-distributors',
  templateUrl: './distributors.component.html',
  styleUrls: ['./distributors.component.scss'],
})
export class DistributorsComponent implements OnInit {
  distributorDialog!: boolean;

  distributors!: Distributor[];

  distributor!: Distributor;

  selectedDistributors!: any;

  submitted!: boolean;
  home!: MenuItem;
  items: MenuItem[] = [];

  @ViewChild('dt') dt: Table | undefined;

  companies: Company[] = [];

  states: State[] = [];
  global: boolean = true;
  company: any;
  pageNo: number = 0;
  pageSize: number = 10;
  sortField: string = '';
  sortDir: string = 'DESC';
  search: string = '';
  totalRecords: any;

  constructor(
    private distributorService: DistributorService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private distributorUserService: DistributorUserService,
    private router: Router
  ) {}

  ngOnInit() {
    this.items = [{ label: 'Distributor' }];
    this.home = { icon: 'pi pi-home', routerLink: '/dashboard' };
    // if (this.router.url.includes('my-distributors')) {
    //   this.distributorUserService.getCurrentDistributor().then((res: any) => {
    //     this.global = false;
    //     this.company = res.company;
    //     this.distributorService
    //       .getDistibutorsByCompany(res.company.id)
    //       .then((data) => (this.distributors = data));
    //   });
    // } else {
    // this.distributorService
    //   .getDistributors(this.pageNo, this.pageSize, this.sortField, this.sortDir, this.search)
    //   .then((data) => (this.distributors = data));
    // }
    this.distributorService
      .getCompanies()
      .then((data) => (this.companies = data));
    this.distributorService
      .getStates(0, 28, 'stateName', 'ASC', this.search)
      .then((data) => (this.states = data));
  }

  loadPage(event: LazyLoadEvent) {
    if (event.globalFilter) {
      this.search = event.globalFilter.target.value;
    }
    this.pageNo = event.first! / 10;
    this.pageSize = event.rows!;
    if (event.sortField) {
      this.sortField = event.sortField;
    }
    this.sortDir = event.sortOrder! > 0 ? 'DESC' : 'ASC';
    this.getDistributorFilter(this.search);
  }

  getDistributorFilter(searchString: string) {
    // if (this.router.url.includes('my-distributors')) {
    //   this.distributorUserService.getCurrentDistributor().then((res: any) => {
    //     this.global = false;
    //     this.company = res.company;
    //     var filter = '';
    //     if (this.search !== '') {
    //       var filtercols = ['distributorName', 'company.companyName', 'distributorLocation'];
    //       filter = FilterBuilder.build(filtercols, this.search);
    //     }
    //     this.distributorService
    //       .getDistibutorsByCompany(res.company.id, this.pageNo, this.pageSize, this.sortField, this.sortDir, filter)
    //       .then((data) => {
    //         if (data) {
    //           this.distributors = data.content;
    //           this.totalRecords = data.totalElements;
    //         }
    //       });
    //   });
    // }
    // else {
    this.distributorService
      .getDistributors(
        this.pageNo,
        this.pageSize,
        this.sortField,
        this.sortDir,
        this.search
      )
      .then((data) => {
        if (data) {
          this.distributors = data.content;

          this.totalRecords = data.totalElements;
        }
      });
    // }
    this.distributorService
      .getCompanies()
      .then((data) => (this.companies = data));
    // this.distributorService.getStates().then((data) => (this.states = data));
  }
  openNew() {
    this.distributor = {};
    this.submitted = false;
    this.distributorDialog = true;
  }

  deleteSelectedDistributors() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected Distributors?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        var counter = 0;
        var success = 0;
        var selected = this.selectedDistributors.length;
        this.selectedDistributors.forEach((distributor: any) => {
          this.distributorService.deleteDistributor(distributor).then(() => {
            success++;
            if (counter === selected) {
              if (success == selected) {
                this.distributors = this.distributors.filter(
                  (val) => !this.selectedDistributors.includes(val)
                );
                this.selectedDistributors = null;
                this.messageService.add({
                  severity: 'success',
                  summary: 'Successful',
                  detail: 'Distributors Deleted',
                  life: 3000,
                });
              } else {
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail:
                    'Distributors Deletion Error, Please refresh and try again',
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

  editDistributor(distributor: Distributor) {
    this.distributor = { ...distributor };
    this.distributorDialog = true;
  }

  deleteDistributor(distributor: Distributor) {
    this.confirmationService.confirm({
      message:
        'Are you sure you want to delete ' + distributor.distributorName + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.distributorService
          .deleteDistributor(distributor)
          .then((data) => {
            this.distributors = this.distributors.filter(
              (val) => val.id !== distributor.id
            );
            this.distributor = {};
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Distributor Deleted',
              life: 3000,
            });
          })
          .catch(() => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail:
                'Distributor Deletion Error, Please refresh and try again',
              life: 3000,
            });
          });
      },
    });
  }

  hideDialog() {
    this.distributorDialog = false;
    this.submitted = false;
  }

  saveDistributor() {
    this.submitted = true;
    if (!this.global) {
      this.distributor.company = this.company;
    }
    if (this.distributor.distributorName?.trim()) {
      if (this.distributor.id) {
        this.distributorService
          .updateDistributor(this.distributor)
          .then((res: any) => {
            // this.distributors.push(res);
            this.distributors[this.findIndexById(res.id)] = res;
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Distributor Updated',
              life: 3000,
            });
          });
      } else {
        this.distributorService
          .createDistributor(this.distributor)
          .then((res: any) => {
            this.distributors.unshift(res);
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Distributor Created',
              life: 3000,
            });
          });
      }

      this.distributors = [...this.distributors];
      this.distributorDialog = false;
      this.distributor = {};
    }
  }

  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.distributors.length; i++) {
      if (this.distributors[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  }
}
