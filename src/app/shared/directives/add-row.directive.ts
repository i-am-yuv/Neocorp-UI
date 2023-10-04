import { Directive, Input, HostListener } from '@angular/core';
import { Table } from 'primeng/table';

@Directive({
    selector: '[pAddRow]'
})
export class AddRowDirective {
    @Input() table!: Table;
    @Input() newRow: any;
    @Input() inProgress: boolean = false;

    @HostListener('click', ['$event'])
    onClick(event: Event) {

        // Insert a new row
        this.table.value.unshift(this.newRow);

        // Set the new row in edit mode
        this.table.initRowEdit(this.newRow);

        event.preventDefault();
    }
}