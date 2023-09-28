import { AbstractControl } from '@angular/forms';

export function whitespacealpha(control: AbstractControl) {
    var regEx = /^[a-zA-Z]+$/;
    if (!control.value.match(regEx)) {
        return { whitespacealpha: true };
    }
    return null;
}

export function whitespace(control: AbstractControl) {
    var regEx = /^[0-9a-zA-Z]+$/;
    if (!control.value.match(regEx)) {
        return { whitespace: true };
    }
    return null;
}

export function alphaNumeric(control: AbstractControl) {
    var regEx = /^[0-9a-zA-Z]+$/;
    if (!control.value.match(regEx)) {
        return { alphaNumeric: true };
    }
    return null;
}

export function digit(control: AbstractControl) {
    var regEx = /^[0-9]+$/;
    if (!control.value.match(regEx)) {
        return { digit: true };
    }
    return null;
}