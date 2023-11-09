import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { MenubarModule } from 'primeng/menubar';
import { LayoutComponent } from './layout/layout.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QrCodeModule } from 'ng-qrcode';
import { NgPipesModule } from 'ngx-pipes';
import { NgxPrintModule } from 'ngx-print';
import { BlockUIModule } from 'primeng/blockui';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { CarouselModule } from 'primeng/carousel';
import { ChartModule } from 'primeng/chart';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ContextMenuModule } from 'primeng/contextmenu';
import { DataViewModule } from 'primeng/dataview';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { DockModule } from 'primeng/dock';
import { DropdownModule } from 'primeng/dropdown';
import { FieldsetModule } from 'primeng/fieldset';
import { FileUploadModule } from 'primeng/fileupload';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { KeyFilterModule } from 'primeng/keyfilter';
import { ListboxModule } from 'primeng/listbox';
import { MenuModule } from 'primeng/menu';
import { MessageModule } from 'primeng/message';
import { MultiSelectModule } from 'primeng/multiselect';
import { OrderListModule } from 'primeng/orderlist';
import { PanelModule } from 'primeng/panel';
import { PasswordModule } from 'primeng/password';
import { PickListModule } from 'primeng/picklist';
import { ProgressBarModule } from 'primeng/progressbar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RatingModule } from 'primeng/rating';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SidebarModule } from 'primeng/sidebar';
import { SlideMenuModule } from 'primeng/slidemenu';
import { SliderModule } from 'primeng/slider';
import { SplitButtonModule } from 'primeng/splitbutton';
import { TableModule } from 'primeng/table';
import { TabMenuModule } from 'primeng/tabmenu';
import { TabViewModule } from 'primeng/tabview';
import { TagModule } from 'primeng/tag';
import { TimelineModule } from 'primeng/timeline';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { DispatcherComponent } from './dispatcher/dispatcher.component';
import { ErrorMessageComponent } from './error-message/error-message.component';
import { AddRowDirective } from './directives/add-row.directive';
import { NumbersOnlyDirective } from './directives/numbers-only.directive';
import { DebounceKeyupDirective } from './directives/debounce.directive';
import { SlideProductComponent } from './slide-product/slide-product.component';
import { SlideAccountComponent } from './slide-account/slide-account.component';


@NgModule({
  declarations: [
    SidebarComponent,NavbarComponent, LayoutComponent
    ,DispatcherComponent,
    ErrorMessageComponent,
    AddRowDirective,
    NumbersOnlyDirective,
    DebounceKeyupDirective,
    SlideProductComponent,
    SlideAccountComponent
  ],
  imports: [
    CommonModule,
    MenubarModule,
    FormsModule,
    DropdownModule,
    BlockUIModule,
    ToastModule,
    SidebarModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    MultiSelectModule,
    BreadcrumbModule,
    SlideMenuModule,
    SelectButtonModule
  ],
  exports:[
    SlideProductComponent,
    SlideAccountComponent,
    FormsModule,
    ReactiveFormsModule,
    ErrorMessageComponent,
    PanelModule,
    InputTextModule,
    ButtonModule,
    CardModule,
    PanelModule,
    MenuModule,
    TableModule,
    ToastModule,
    CalendarModule,
    SliderModule,
    MultiSelectModule,
    ContextMenuModule,
    DialogModule,
    ConfirmDialogModule,
    DropdownModule,
    DialogModule,
    ProgressBarModule,
    MultiSelectModule,
    FileUploadModule,
    ToolbarModule,
    RadioButtonModule,
    RatingModule,
    InputNumberModule,
    InputTextareaModule,
    CheckboxModule,
    TabMenuModule,
    ListboxModule,
    OrderListModule,
    DividerModule,
    SidebarModule,
    DockModule,
    DataViewModule,
    BreadcrumbModule,
    SlideMenuModule,
    TagModule,
    PickListModule,
    CarouselModule,
    TabViewModule,
    MessageModule,
    SelectButtonModule,
    SplitButtonModule,
    TabViewModule,
    InputSwitchModule,
    NgxPrintModule,
    QrCodeModule,
    FieldsetModule,
    AddRowDirective,
    ChartModule,
    TimelineModule,
    BlockUIModule,
    NumbersOnlyDirective,
    PasswordModule,
    KeyFilterModule,
    NgPipesModule,
    DebounceKeyupDirective,
    
    
  ]
})
export class SharedModule { }
