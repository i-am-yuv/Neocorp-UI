import { Component, OnInit, ViewChild } from '@angular/core';
import {
  MessageService,
  ConfirmationService,
  MenuItem,
  LazyLoadEvent,
} from 'primeng/api';
import { Table } from 'primeng/table';
import { AuthService } from 'src/app/auth/auth.service';
import { FilterBuilder } from 'src/app/utils/FilterBuilder';
import { StoreUserService } from '../store-user/store-user.service';
import { Posmachine } from './posmachine';
import { PosmachineService } from './posmachine.service';

@Component({
  selector: 'app-posmachine',
  templateUrl: './posmachine.component.html',
  styleUrls: ['./posmachine.component.scss'],
})
export class PosmachineComponent implements OnInit {
  posmachineDialog!: boolean;

  posmachines!: Posmachine[];

  posmachine: Posmachine = {};
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
    private posmachineService: PosmachineService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private storeUserService: StoreUserService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // var userId = this.authService.getUserId();
    // this.storeUserService.getStore(userId).then(data => {
    //   this.store = data;
    //   this.posmachineService.getPosMachines(data.id, 0, 10, undefined, 'ASC').then(data => {
    //     this.posmachines = data;
    //
    //   });
    // });
    this.items = [{ label: 'POS Machines' }];
    this.home = { icon: 'pi pi-home', routerLink: '/dashboard' };
  }

  // loadPage(params : any) {
  //
  //
  //   this.posmachineService.pagination(params).then((data : any)=>{
  //
  //     this.posmachines = data.content;
  //
  //     this.totalRecords = data.totalElements;
  //   })
  // }
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
          this.posmachineService.deletePosmachine(posmachine).then(() => {
            success++;
            if (counter === selected) {
              if (success == selected) {
                this.posmachines = this.posmachines.filter(
                  (val) => !this.selectedPosmachines.includes(val)
                );
                this.selectedPosmachines = null;
                this.messageService.add({
                  severity: 'success',
                  summary: 'Successful',
                  detail: 'Posmachines Deleted',
                  life: 3000,
                });
              } else {
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail:
                    'Posmachines Deletion Error, Please refresh and try again',
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

  editPosmachine(posmachine: Posmachine) {
    this.posmachine = { ...posmachine };
    this.posmachineDialog = true;
  }

  deletePosmachine(posmachine: Posmachine) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + posmachine.name + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.posmachineService
          .deletePosmachine(posmachine)
          .then((data) => {
            this.posmachines = this.posmachines.filter(
              (val) => val.id !== posmachine.id
            );
            this.posmachine = {};
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Posmachine Deleted',
              life: 3000,
            });
          })
          .catch(() => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Posmachine Deletion Error, Please refresh and try again',
              life: 3000,
            });
          });
      },
    });
  }

  hideDialog() {
    this.posmachineDialog = false;
    this.submitted = false;
  }

  savePosmachine() {
    this.submitted = true;
    // Get this dynamically in electron
    this.posmachine.deviceId = '9999999';
    this.posmachine.store = this.store;
    if (this.posmachine.name?.trim()) {
      if (this.posmachine.id) {
        this.posmachineService
          .updatePosmachine(this.posmachine)
          .then((res: any) => {
            // this.posmachines.push(res);
            this.posmachines[this.findIndexById(res.id)] = res;
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Posmachine Updated',
              life: 3000,
            });
          });
      } else {
        this.posmachineService
          .createPosmachine(this.posmachine)
          .then((res: any) => {
            this.posmachines.push(res);
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Posmachine Created',
              life: 3000,
            });
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
    this.storeUserService.getStore(userId).then((data) => {
      this.store = data;
      var filter = '';
      if (this.search !== '') {
        var filtercols = ['searchKey', 'name'];
        filter = FilterBuilder.build(filtercols, this.search);
      }
      this.posmachineService
        .getPosMachines(
          data.id,
          this.pageNo,
          this.pageSize,
          this.sortField,
          this.sortDir,
          filter
        )
        .then((data) => {
          this.posmachines = data;
          if (data) {
            this.posmachines = data.content;
            this.totalRecords = data.totalElements;
          }
        });
    });
  }
}
