import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, AbstractControlDirective } from '@angular/forms';

@Component({
  selector: 'error-message',
  templateUrl: './error-message.component.html',
  styleUrls: ['./error-message.component.scss'],
})
export class ErrorMessageComponent {
  errorMsgList: any = [];

  @Input() controlName!: AbstractControl | AbstractControlDirective;

  errorMessage: any = {
    required: (params: any) => 'This field is required',
    // 'maxlength': (params: any) => `Maximum ${params.requiredLength} characters are allowed`,
    // 'minlength': (params: any) => `Minimum ${params.requiredLength} characters are required`,
    maxlength: (params: any) =>
      `Maximum required length for this field is ${params.requiredLength}`,
    minlength: (params: any) =>
      `Minimum required length for this field is ${params.requiredLength}`,
    pattern: (params: any) => 'Invalid format',
    min: (params: any) => `Minimum amount should be ${params.min}`,
    max: (params: any) => `Maximum amount should be ${params.max}`,
    whitespace: (params: any) => 'White spaces are not allowed',
    alphaNumeric: (params: any) => 'Only alphabet and numbers are allowed.',
    digit: 'Only digit are allowed',
    whitespacealpha: (params: any) => 'Only characters are allowed',
    email: (params: any) => 'Enter a valid email',
    confirmedValidator: (params: any) => 'Passwords are not matching',
  };

  listErrors() {
    if (!this.controlName) return [];
    if (this.controlName.errors) {
      this.errorMsgList = [];
      Object.keys(this.controlName.errors).map((error) => {
        if (this.controlName.errors) {
          this.controlName.touched || this.controlName.dirty
            ? this.errorMsgList.push(
                this.errorMessage[error](this.controlName.errors[error])
              )
            : '';
        }
      });
      return this.errorMsgList;
    } else {
      return [];
    }
  }

  ngOnInit() {
    // ReactiveFormConfig.set({
    //   "internationalization": {
    //     "dateFormat": "dmy",
    //     "seperator": "/"
    //   },
    //   "validationMessage": {
    //     "alpha": "Only alphabelts are allowed.",
    //     "alphaNumeric": "Only alphabet and numbers are allowed.",
    //     "compare": "inputs are not matched.",
    //     "contains": "value is not contains in the input",
    //     "creditcard": "creditcard number is not correct",
    //     "digit": "Only digit are allowed",
    //     "email": "email is not valid",
    //     "greaterThanEqualTo": "please enter greater than or equal to the joining age",
    //     "greaterThan": "please enter greater than to the joining age",
    //     "hexColor": "please enter hex code",
    //     "json": "please enter valid json",
    //     "lessThanEqualTo": "please enter less than or equal to the current experience",
    //     "lessThan": "please enter less than or equal to the current experience",
    //     "lowerCase": "Only lowercase is allowed",
    //     "maxLength": "maximum length is {{1}} digit",
    //     "maxNumber": "Enter value less than equal to {{1}}",
    //     "minNumber": "Enter value greater than equal to {{1}}",
    //     "password": "please enter valid password",
    //     "pattern": "please enter valid zipcode",
    //     "range": "please enter age between 18 to 60",
    //     "required": "This field is required",
    //     "time": "Only time format is allowed",
    //     "upperCase": "Only uppercase is allowed",
    //     "url": "Only url format is allowed",
    //     "zipCode": "enter valid zip code",
    //     "minLength": "minimum length is {{1}} digit"
    //   }
    // });
  }
}
