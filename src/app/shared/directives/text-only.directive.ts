import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[TextOnly]'
})
export class TextOnlyDirective {

  constructor(private el: ElementRef) { }

  @HostListener('input', ['$event'])
  onInput(event: KeyboardEvent): void {
    const input = event.target as HTMLInputElement;
    const regex = /^[a-zA-Z]+$/; // Only allow alphabetic characters

    if (!regex.test(input.value)) {
      input.value = input.value.replace(/[^a-zA-Z]/g, ''); // Remove non-alphabetic characters
    }
  }

}
