import { Component, OnInit } from '@angular/core';
import { MenuItem, Message } from 'primeng/api';
import { AuthService } from 'src/app/auth/auth.service';
import { NotificationsService } from './notifications.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {

  notifications: Notification[] = [];
  msgs: Message[] = [];
  home!: MenuItem;
  items: MenuItem[] = [];

  constructor(
    private authService: AuthService,
    private notificationService: NotificationsService
  ) { }

  ngOnInit(): void {
    var userId = this.authService.getUserId();
    this.notificationService.getByUser(userId).then((res: any) => {
      this.notifications = res;
      res.forEach((el: any) => {
        this.msgs.push({ severity: res.severity, summary: res.summary, detail: res.detail })
      });
    });
    this.items = [
      { label: 'Notifications'},
    ];
    this.home = {icon: 'pi pi-home', routerLink: '/dashboard'};
  }

}
