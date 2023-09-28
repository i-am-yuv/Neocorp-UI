import { Component, OnInit } from '@angular/core';
import { MessageService, ConfirmationService, MenuItem } from 'primeng/api';
import { Setting } from './setting';
import { SettingService } from './setting.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  setting: Setting = {};
  settings: Setting[] = [];
  showSettingForm: boolean = false;
  home!: MenuItem;
  items: MenuItem[] = [];

  constructor(
    private settingService: SettingService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.items = [
		  { label: 'Settings' },
		];
		this.home = { icon: 'pi pi-home', routerLink: '/dashboard' };
    this.getSettings();
  }

  getSettings() {
    this.settingService.getSettings().then((settings: any) => this.settings = settings);
  }

  onSubmit() {
    if (this.setting.id) {
      this.settingService.updateSetting(this.setting).then((setting: any) => {
        this.setting = {};
        this.getSettings();
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Setting Updated' });
      });
    } else {
      this.settingService.createSetting(this.setting).then((setting: any) => {
        this.setting = {};
        this.getSettings();
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Setting Created' });
      });
    }
  }

  addNew() {
    this.setting = {};
  }

  edit(val: any) {

    this.setting = val;

  }

  delete(setting: any) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + setting.settingName + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.settingService.deleteSetting(setting).then((data) => {
          this.settings = this.settings.filter(val => val.id !== setting.id);
          // this.customer = {};
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Setting Deleted', life: 3000 });
        }).catch(() => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Setting Deletion Error, Please refresh and try again', life: 3000 });
        });
      }
    });
  }

}
