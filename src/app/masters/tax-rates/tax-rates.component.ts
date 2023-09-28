import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import {
  MessageService,
  ConfirmationService,
  MenuItem,
  LazyLoadEvent,
} from 'primeng/api';
import { Table } from 'primeng/table';
import { FilterBuilder } from 'src/app/utils/FilterBuilder';
import { TaxRate } from './tax-rate';
import { TaxRateService } from './tax-rate.service';

@Component({
  selector: 'app-tax-rates',
  templateUrl: './tax-rates.component.html',
  styleUrls: ['./tax-rates.component.scss'],
})
export class TaxRatesComponent implements OnInit {
  taxRateDialog!: boolean;

  taxRates!: TaxRate[];

  taxRate: TaxRate = {};

  @ViewChild('taxRateForm') public taxRateForm!: NgForm;

  selectedTaxRates!: any;

  submitted!: boolean;
  home!: MenuItem;
  items: MenuItem[] = [];
  sortField: string = '';
  search: string = '';
  pageNo: number = 0;
  pageSize: number = 10;
  sortDir: string = 'DESC';

  @ViewChild('dt') dt: Table | undefined;
  totalRecords: any;

  constructor(
    private taxRateService: TaxRateService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    // this.taxRateService.getTaxRates().then(data => this.taxRates = data);
    this.items = [{ label: 'Tax Rates' }];
    this.home = { icon: 'pi pi-home', routerLink: '/dashboard' };
  }

  openNew() {
    this.taxRate = {};
    this.taxRateForm.reset();
    this.submitted = false;
    this.taxRateDialog = true;
  }
  applyFilterGlobal($event: any, stringVal: any) {
    var searchString = ($event.target as HTMLInputElement).value;

    // this.dt.filterGlobal(($event.target as HTMLInputElement).value, 'contains');
    if (searchString.length > 0) {
      this.search = searchString;
      this.getFilter(searchString);
    } else {
      this.getFilter(searchString);
    }
  }

  loadPage(event: LazyLoadEvent) {
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
      var filtercols = ['taxRateName', 'gst'];
      filter = FilterBuilder.build(filtercols, this.search);
    }
    this.taxRateService
      .getTaxRates(
        this.pageNo,
        this.pageSize,
        this.sortField,
        this.sortDir,
        filter
      )
      .then((data) => {
        if (data) {
          this.taxRates = data.content;

          this.totalRecords = data.totalElements;
        }
        // this.taxRates = data
      });
  }
  deleteSelectedTaxRates() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected TaxRates?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.taxRates = this.taxRates.filter(
          (val) => !this.selectedTaxRates.includes(val)
        );
        this.selectedTaxRates = null;
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'TaxRates Deleted',
          life: 3000,
        });
      },
    });
  }

  editTaxRate(taxRate: TaxRate) {
    this.taxRate = { ...taxRate };
    this.taxRateDialog = true;
  }

  deleteTaxRate(taxRate: TaxRate) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + taxRate.taxRateName + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.taxRateService.deleteTaxRate(taxRate).then((data) => {
          this.taxRates = this.taxRates.filter((val) => val.id !== taxRate.id);
          this.taxRate = {};
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'TaxRate Deleted',
            life: 3000,
          });
        });
      },
    });
  }

  hideDialog() {
    this.taxRateDialog = false;
    this.submitted = false;
  }

  saveTaxRate() {
    this.submitted = true;

    if (this.taxRate.taxRateName?.trim()) {
      if (this.taxRate.id) {
        this.taxRateService.updateTaxRate(this.taxRate).then((res: any) => {
          // this.taxRates.push(res);
          this.taxRates[this.findIndexById(res.id)] = res;
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'TaxRate Updated',
            life: 3000,
          });
        });
      } else {
        this.taxRateService.createTaxRate(this.taxRate).then((res: any) => {
          this.taxRates.push(res);
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'TaxRate Created',
            life: 3000,
          });
        });
      }

      this.taxRates = [...this.taxRates];
      this.taxRateDialog = false;
      this.taxRate = {};
    }
  }

  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.taxRates.length; i++) {
      if (this.taxRates[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  }

  // applyFilterGlobal($event: any, stringVal: any) {
  //
  //   this.dt?.filterGlobal(($event.target as HTMLInputElement).value, 'contains');
  // }
}
