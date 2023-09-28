import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss'],
})
export class VerifyEmailComponent implements OnInit {
  token: string | null = '';
  

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    
  }

  items = [
    {
      label: 'Logo',
      icon: 'pi pi-home',
      routerLink: ['/home'], // Replace with your logo's link
      styleClass: 'logo-item' // Custom class for logo item
    },
    {
      label: 'Button 1',
      icon: 'pi pi-star',
      routerLink: ['/button1'] // Replace with your button's link
    },
    {
      label: 'Button 2',
      icon: 'pi pi-search',
      routerLink: ['/button2'] // Replace with your button's link
    },
    // Add more buttons as needed
  ];

}
