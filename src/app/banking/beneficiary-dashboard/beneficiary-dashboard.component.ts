import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { BankingService } from '../banking.service';
import { Beneficiary } from 'src/app/profile/profile-models';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-beneficiary-dashboard',
  templateUrl: './beneficiary-dashboard.component.html',
  styleUrls: ['./beneficiary-dashboard.component.scss']
})
export class BeneficiaryDashboardComponent implements OnInit {

  submitted: boolean = false;
  totalRecords: number = 0;

  allBeneficairy: any[] = [];

  activeBeneficiary: Beneficiary = {};

  items!: MenuItem[];

  constructor(private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private message: MessageService,
    private authS: AuthService,
    private bankingS: BankingService) { }

  ngOnInit(): void {
    this.items = [{ label: 'Banking' }, { label: 'Beneficiary' }, { label: 'Dashbaord' }];

    this.loadUser();
  }

  getAllBeneficiary() {
    this.submitted = true;
    this.bankingS.getAllBeneficairy(this.currentUser).then(
      (res: any) => {
        console.log(res);
        this.allBeneficairy = res.filter((beneficairy: Beneficiary) => beneficairy.beneficaryName !== null);
        if (this.allBeneficairy.length > 0) {
          this.changeBeneficiary(this.allBeneficairy[0]);
        } else {
          this.activeBeneficiary = {};
        }
        this.totalRecords = this.allBeneficairy.length;
        this.submitted = false;
      }
    ).catch(
      (err) => {
        console.log(err);
        this.submitted = false;
      }
    )
  }

  changeBeneficiary(beneficairy: Beneficiary) {
    this.activeBeneficiary = beneficairy;
  }

  onEditB(beneficiaryId: any) {
    this.router.navigate(['/banking/beneficiary/edit/' + beneficiaryId]);
  }

  CreateNewBeneficiary() {
    this.router.navigate(['/banking/beneficiary/create']);
  }


  searchBN: any;
  searchBNs(value: any) {
    if (value == null) {
      //alert("Came");
      this.getAllBeneficiary();
    }
    else {
      // this.submitted = true;
      this.bankingS.searchBeneficiary(value).then(
        (res: any) => {
          console.log(res);
          //this.allBeneficairy = res.content;
          this.allBeneficairy = res.content.filter((beneficairy: Beneficiary) => beneficairy.beneficaryName !== null);
          if (this.allBeneficairy.length > 0) {
            this.changeBeneficiary(this.allBeneficairy[0]);
          } else {
            this.activeBeneficiary = {};
          }
          this.totalRecords = this.allBeneficairy.length;
          this.submitted = false;
        }
      ).catch(
        (err) => {
          console.log(err);
          this.submitted = false;
        }
      )
    }
  }
  
  currentCompany: any = {};
  currentUser: any = {};
  loadUser() {
    this.submitted = true;
    this.authS.getUser().then((res: any) => {
      this.currentCompany = res.comapny;
      this.currentUser = res;
      this.submitted = false;
      this.getAllBeneficiary();
    })
      .catch((err) => {
        console.log(err);
        this.submitted = false;
      });
  }

}
