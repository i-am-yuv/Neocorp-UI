import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { FormBuilder } from '@angular/forms';
import { PaymentService } from '../payment.service';
import { AuthService } from 'src/app/auth/auth.service';
import { PayModelsPI, PayModelsSI } from '../pay-models';

@Component({
  selector: 'app-make-payment',
  templateUrl: './make-payment.component.html',
  styleUrls: ['./make-payment.component.scss']
})
export class MakePaymentComponent implements OnInit {

  id: any;
  choosedM: any;
  submitted: boolean = false;
  paymentMethods: any = [
    {
      "id": "1",
      "name": "COD"
    },
    {
      "id": "2",
      "name": "CASH"
    },
    {
      "id": "3",
      "name": "UPI"
    },
    {
      "id": "4",
      "name": "CARD"
    },
    {
      "id": "5",
      "name": "NETBANKING"
    }
  ];

  payPI: PayModelsPI = {};

  paySI: PayModelsSI = {};

  enteredAmount: any;

isClass1Applied = true; // Class 1 is initially not applied
isClass2Applied = true; // Class 2 is initially not applied

  constructor(private router: Router,
    private route: ActivatedRoute,
    private message: MessageService,
    private fb: FormBuilder,
    private payS: PaymentService,
    private authS: AuthService) { }

  ngOnInit(): void {

    this.id = this.route.snapshot.paramMap.get('id');

  }
  rightPart() {
    // make the right part enable here
    this.isClass2Applied = !this.isClass2Applied;
  }

  // toggleClass2() {
  //   this.isClass2Applied = !this.isClass2Applied; // Toggle the class2 state
  // }

  makePayment() {

    this.route.url.subscribe(segments => {
      let lastSegment = segments[segments.length - 2];
      if (lastSegment && lastSegment.path == 'pi') {

        this.payPI.amount = this.enteredAmount;
        this.payPI.invoiceId = this.id;
        this.payPI.vendorId = this.authS.getUserId()+'' ;
       // this.payM.vendorId = '0afa0a7c-8abb-1049-818a-bc563cb1001d';
        this.payPI.paymentType = this.choosedM;
        this.payPI.paymentRequest = null;

        alert(JSON.stringify(this.payPI));

        this.payS.makePaymentPI(this.payPI).then(
          (res) => {
            console.log(res);
            this.message.add({
              severity: 'success',
              summary: 'payment Done',
              detail: 'Payment Done',
              life: 3000,
            });
          }
        ).catch(
          (err) => {
            console.log(err);
            this.message.add({
              severity: 'error',
              summary: err.error.message,
              detail: err.error.message,
              life: 3000,
            });
          }
        )

      }
      else if (lastSegment && lastSegment.path == 'si') {

        this.paySI.amount = this.enteredAmount;
        this.paySI.invoiceId = this.id;
        this.paySI.customerId = this.authS.getUserId()+'' ;

       // this.payM.vendorId = '0afa0a7c-8abb-1049-818a-bc563cb1001d';

        this.paySI.paymentType = this.choosedM;

        alert(JSON.stringify(this.paySI));

        this.payS.makePaymentSI(this.paySI).then(
          (res) => {
            console.log(res);
            this.message.add({
              severity: 'success',
              summary: 'payment Done',
              detail: 'Payment Done',
              life: 3000,
            });
          }
        ).catch(
          (err) => {
            console.log(err);
            this.message.add({
              severity: 'error',
              summary: err.error.message,
              detail: err.error.message,
              life: 3000,
            });
          }
        )

      }
    });


  }
}


