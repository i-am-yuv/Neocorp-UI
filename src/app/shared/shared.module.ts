import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { MenubarModule } from 'primeng/menubar';
import { DutchModule } from '../dutch/dutch.module';

@NgModule({
  exports: [SidebarComponent,NavbarComponent],
  declarations: [
    SidebarComponent,NavbarComponent
  ],
  imports: [
    CommonModule,
    MenubarModule,
    DutchModule
  ]
})
export class SharedModule { }
