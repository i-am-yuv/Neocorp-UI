import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss']
})
export class ConfigurationComponent implements OnInit {

  roles: string = "";

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.roles = this.authService.getRoles();
  }

}
