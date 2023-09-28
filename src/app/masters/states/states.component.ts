import { Component, OnInit, ViewChild } from '@angular/core';
import {
  MessageService,
  ConfirmationService,
  MenuItem,
  LazyLoadEvent,
} from 'primeng/api';
import { Table } from 'primeng/table';
import { FilterBuilder } from 'src/app/utils/FilterBuilder';
import { State } from './state';
import { StateService } from './state.service';

@Component({
  selector: 'app-states',
  templateUrl: './states.component.html',
  styleUrls: ['./states.component.scss'],
})
export class StatesComponent implements OnInit {
  stateDialog!: boolean;

  states!: State[];

  state!: State;

  selectedStates!: any;

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
    private stateService: StateService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.items = [{ label: 'States' }];
    this.home = { icon: 'pi pi-home', routerLink: '/dashboard' };
    // this.stateService.getStates().then(data => this.states = data);
  }

  openNew() {
    this.state = {};
    this.submitted = false;
    this.stateDialog = true;
  }

  deleteSelectedStates() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected States?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.states = this.states.filter(
          (val) => !this.selectedStates.includes(val)
        );
        this.selectedStates = null;
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'States Deleted',
          life: 3000,
        });
      },
    });
  }

  editState(state: State) {
    this.state = { ...state };
    this.stateDialog = true;
  }

  deleteState(state: State) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + state.stateName + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.stateService.deleteState(state).then((data) => {
          this.states = this.states.filter((val) => val.id !== state.id);
          this.state = {};
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'State Deleted',
            life: 3000,
          });
        });
      },
    });
  }

  hideDialog() {
    this.stateDialog = false;
    this.submitted = false;
  }

  saveState() {
    this.submitted = true;

    if (this.state.stateName?.trim()) {
      if (this.state.id) {
        this.stateService.updateState(this.state).then((res: any) => {
          // this.states.push(res);
          this.states[this.findIndexById(res.id)] = res;
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'State Updated',
            life: 3000,
          });
        });
      } else {
        this.stateService.createState(this.state).then((res: any) => {
          this.states.push(res);
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'State Created',
            life: 3000,
          });
        });
      }

      this.states = [...this.states];
      this.stateDialog = false;
      this.state = {};
    }
  }

  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.states.length; i++) {
      if (this.states[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
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

  loadPage(event: LazyLoadEvent) {
    this.pageNo = event.first! / 10;
    this.pageSize = event.rows!;
    if (event.sortField) {
      this.sortField = event.sortField;
    }
    this.sortDir = event.sortOrder! > 0 ? 'ASC' : 'DESC';
    this.getFilter('');
  }

  getFilter(searchString: string) {
    this.search = searchString;
    var filter = '';
    if (this.search !== '') {
      var filtercols = ['stateName', 'stateCode'];
      filter = FilterBuilder.build(filtercols, this.search);
    }
    this.stateService
      .getStatesData(
        this.pageNo,
        this.pageSize,
        this.sortField,
        this.sortDir,
        filter
      )
      .then((data) => {
        if (data) {
          this.states = data.content;
          this.totalRecords = data.totalElements;
        }
      });
  }
  // applyFilterGlobal($event: any, stringVal: any) {
  //
  //   this.dt?.filterGlobal(($event.target as HTMLInputElement).value, 'contains');
  // }
}
