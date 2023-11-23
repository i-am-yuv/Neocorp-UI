import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PanelModule } from 'primeng/panel';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { LayoutComponent } from './layout/layout.component';
import { MenubarModule } from 'primeng/menubar';
import { MenuModule } from 'primeng/menu';
import { SharedModule } from 'primeng/api';
import { DispatcherComponent } from './dispatcher/dispatcher.component';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { CalendarModule } from 'primeng/calendar';
import { SliderModule } from 'primeng/slider';
import { MultiSelectModule } from 'primeng/multiselect';
import { ContextMenuModule } from 'primeng/contextmenu';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { ProgressBarModule } from 'primeng/progressbar';
import { FileUploadModule } from 'primeng/fileupload';
import { ToolbarModule } from 'primeng/toolbar';
import { RatingModule } from 'primeng/rating';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CheckboxModule } from 'primeng/checkbox';
import { TabMenuModule } from 'primeng/tabmenu';
import { ListboxModule } from 'primeng/listbox';
import { OrderListModule } from 'primeng/orderlist';
import { DividerModule } from 'primeng/divider';
import { SidebarModule } from 'primeng/sidebar';
import { DockModule } from 'primeng/dock';
import { DataViewModule } from 'primeng/dataview';
import { ErrorMessageComponent } from './error-message/error-message.component';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { SlideMenuModule } from 'primeng/slidemenu';
import { TagModule } from 'primeng/tag';
import { PickListModule } from 'primeng/picklist';
import { CarouselModule } from 'primeng/carousel';
import { TabViewModule } from 'primeng/tabview';
import { MessageModule } from 'primeng/message';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SplitButtonModule } from 'primeng/splitbutton';
import { InputSwitchModule } from 'primeng/inputswitch';
import { NgxPrintModule } from 'ngx-print';
import { QrCodeModule } from 'ng-qrcode';
import { FieldsetModule } from 'primeng/fieldset';
import { AddRowDirective } from './directives/add-row.directive';
import { ChartModule } from 'primeng/chart';
import { TimelineModule } from 'primeng/timeline';
import { BlockUIModule } from 'primeng/blockui';
import { NumbersOnlyDirective } from './directives/numbers-only.directive';
import { PasswordModule } from 'primeng/password';
import { KeyFilterModule } from 'primeng/keyfilter';
import { BlueLayoutComponent } from './blue-layout/blue-layout.component';
import { NgPipesModule } from 'ngx-pipes';
import { DebounceKeyupDirective } from './directives/debounce.directive';
import { BlockCopyPasteDirective } from './directives/block-copy-paste.directive';



@NgModule({
  declarations: [
    LayoutComponent,
    DispatcherComponent,
    ErrorMessageComponent,
    AddRowDirective,
    NumbersOnlyDirective,
    BlueLayoutComponent,
    DebounceKeyupDirective,
    BlockCopyPasteDirective
  ],
  imports: [
    CommonModule,
    MenubarModule,
    MenuModule,
    InputTextModule,
    SharedModule,
    ToastModule,
    ConfirmDialogModule,
    ToolbarModule
  ],
  exports: [
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
    DebounceKeyupDirective
  ]
})
export class DutchModule { }
