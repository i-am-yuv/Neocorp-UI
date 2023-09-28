import { Component, OnInit, ViewChild } from '@angular/core';
import {
  MessageService,
  ConfirmationService,
  MenuItem,
  LazyLoadEvent,
} from 'primeng/api';
import { Table } from 'primeng/table';
import { FilterBuilder } from 'src/app/utils/FilterBuilder';
import { Country } from '../countries/country';
import { CountryService } from '../countries/countryService';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.scss'],
})
export class CountriesComponent implements OnInit {
  countryDialog!: boolean;

  countries!: Country[];

  country!: Country;

  selectedCountries!: any;

  submitted!: boolean;

  @ViewChild('dt') dt: Table | undefined;
  home!: MenuItem;
  items: MenuItem[] = [];
  sortField: string = '';
  search: string = '';
  pageNo: number = 0;
  pageSize: number = 10;
  sortDir: string = 'DESC';
  totalRecords: any;

  constructor(
    private countryService: CountryService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.items = [{ label: 'Countries' }];
    this.home = { icon: 'pi pi-home', routerLink: '/dashboard' };
    // this.countryService.getCountries().then(data => this.countries = data);
  }
  applyFilterGlobal($event: any, stringVal: any) {
    var searchString = ($event.target as HTMLInputElement).value;
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
      var filtercols = ['countryName', 'countryCode'];
      filter = FilterBuilder.build(filtercols, this.search);
    }
    this.countryService
      .getCountries(
        this.pageNo,
        this.pageSize,
        this.sortField,
        this.sortDir,
        filter
      )
      .then((data) => {
        // this.countries = data;
        if (data) {
          this.countries = data.content;
          this.totalRecords = data.totalElements;
        }
      });
  }

  openNew() {
    this.country = {};
    this.submitted = false;
    this.countryDialog = true;
  }

  deleteSelectedCountries() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected Countrys?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.countries = this.countries.filter(
          (val) => !this.selectedCountries.includes(val)
        );
        this.selectedCountries = null;
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Countries Deleted',
          life: 3000,
        });
      },
    });
  }

  editCountry(country: Country) {
    this.country = { ...country };
    this.countryDialog = true;
  }

  deleteCountry(country: Country) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + country.countryName + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.countryService.deleteCountry(country).then((data) => {
          this.countries = this.countries.filter(
            (val) => val.id !== country.id
          );
          this.country = {};
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Country Deleted',
            life: 3000,
          });
        });
      },
    });
  }

  hideDialog() {
    this.countryDialog = false;
    this.submitted = false;
  }

  saveCountry() {
    this.submitted = true;

    if (this.country.countryName?.trim()) {
      if (this.country.id) {
        this.countryService.updateCountry(this.country).then((res: any) => {
          // this.countries.push(res);
          this.countries[this.findIndexById(res.id)] = res;
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Country Updated',
            life: 3000,
          });
        });
      } else {
        this.countryService.createCountry(this.country).then((res: any) => {
          this.countries.push(res);
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Country Created',
            life: 3000,
          });
        });
      }

      this.countries = [...this.countries];
      this.countryDialog = false;
      this.country = {};
    }
  }

  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.countries.length; i++) {
      if (this.countries[i].id === id) {
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
