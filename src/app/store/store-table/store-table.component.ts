import { StoreTable } from './store-table';
import { FilterBuilder } from 'src/app/utils/FilterBuilder';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService, ConfirmationService, MenuItem, LazyLoadEvent } from 'primeng/api';
import { Table } from 'primeng/table';
import { AuthService } from 'src/app/auth/auth.service';
import { StoreUserService } from '../store-user/store-user.service';
import { StoreTableService } from './store-table.service';

@Component({
  selector: 'app-store-table',
  templateUrl: './store-table.component.html',
  styleUrls: ['./store-table.component.scss']
})
export class StoreTableComponent implements OnInit {

  posmachineDialog!: boolean;

  posmachines!: StoreTable[];

  posmachine: StoreTable = {};
  pageNo: number = 0;
  pageSize: number = 10;
  sortField: string = '';
  sortDir: string = 'DESC';
  search: string = '';

  selectedPosmachines!: any;

  submitted!: boolean;
  home!: MenuItem;
  items: MenuItem[] = [];

  @ViewChild('dt') dt: Table | undefined;
  store: any = {};
  totalRecords: any;
  storeDt: any;

  constructor(
    private storetableService: StoreTableService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private storeUserService: StoreUserService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.items = [
      { label: 'Tables' },
    ];
    this.home = { icon: 'pi pi-home', routerLink: '/dashboard' };
  }

  openNew() {
    this.posmachine = {};
    this.submitted = false;
    this.posmachineDialog = true;
  }

  deleteSelectedPosmachines() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected Posmachines?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        var counter = 0;
        var success = 0;
        var selected = this.selectedPosmachines.length;
        this.selectedPosmachines.forEach((posmachine: any) => {
          this.storetableService.deleteStoreTable(posmachine).then(() => {
            success++;
            if (counter === selected) {
              if (success == selected) {
                this.posmachines = this.posmachines.filter(val => !this.selectedPosmachines.includes(val));
                this.selectedPosmachines = null;
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Posmachines Deleted', life: 3000 });
              } else {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Posmachines Deletion Error, Please refresh and try again', life: 3000 });
              }
            }
          })
          counter++;
        });
      }
    });
  }

  editPosmachine(posmachine: StoreTable) {
    this.posmachine = { ...posmachine };
    this.posmachineDialog = true;
  }

  deletePosmachine(posmachine: StoreTable) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + posmachine.tableName + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.storetableService.deleteStoreTable(posmachine).then((data) => {
          this.posmachines = this.posmachines.filter(val => val.id !== posmachine.id);
          this.posmachine = {};
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Posmachine Deleted', life: 3000 });
        }).catch(() => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Posmachine Deletion Error, Please refresh and try again', life: 3000 });
        });
      }
    });
  }

  hideDialog() {
    this.posmachineDialog = false;
    this.submitted = false;
  }

  savePosmachine() {
    this.submitted = true;
    // Get this dynamically in electron 
    this.posmachine.store = this.store;
    if (this.posmachine.tableCode?.trim()) {
      if (this.posmachine.id) {
        this.storetableService.updateStoreTable(this.posmachine).then((res: any) => {
          // this.posmachines.push(res);
          this.posmachines[this.findIndexById(res.id)] = res;
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Posmachine Updated', life: 3000 });
        });
      }
      else {
        this.storetableService.createStoreTable(this.posmachine).then((res: any) => {
          this.posmachines.push(res);
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Posmachine Created', life: 3000 });
        });

      }

      this.posmachines = [...this.posmachines];
      this.posmachineDialog = false;
      this.posmachine = {};
    }
  }

  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.posmachines.length; i++) {
      if (this.posmachines[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
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
    this.getPosFilter(this.search);
  }
  getPosFilter(searchString: string) {
    this.search = searchString;
    var userId = this.authService.getUserId();
    this.storeUserService.getStore(userId).then(data => {
      this.store = data;
      var filter = '';
      if (this.search !== '') {
        var filtercols = ['tableCode', 'tableName'];
        filter = FilterBuilder.build(filtercols, this.search);
      }
      this.storetableService.getStoreTables(data.id, this.pageNo, this.pageSize, this.sortField, this.sortDir, filter).then(data => {
        this.posmachines = data;
        if (data) {
          this.posmachines = data.content;
          this.totalRecords = data.totalElements;
        }
      });
    });
  }
}
