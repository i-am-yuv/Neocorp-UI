import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { AuthService } from 'src/app/auth/auth.service';
import { BankingService } from 'src/app/banking/banking.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  roles: string = "";
  submitted : boolean =  false;

  allDebitAccount : any[] = [];

  showDemoDashboard : boolean = false;

  constructor(private authS: AuthService ,
    private bankingS : BankingService ,
    private message: MessageService) { }

  ngOnInit(): void {
    // this.roles = this.authService.getRoles();
    this.loadUser();
  }

  loadOtherInfo()
  {
    this.getAllDebitAccounts();
  }

  getAllDebitAccounts()
  {
    this.submitted = true;
    this.bankingS.getAllDebitAccount(this.currentUser).then(
      (res) => {
        console.log(res);
        this.allDebitAccount = res;
        if( this.allDebitAccount.length > 0 )
        {
          this.showDemoDashboard = true ;
        }
          this.submitted = false;
      }
    ).catch(
      (err) => {
        this.submitted = false;
        console.log(err);
        this.message.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error while fetching Debit Account Details',
          life: 3000,
        });
      }
    )
  }

  currentCompany: any = {};
  currentUser: any = {};
  loadUser() {
    this.submitted = true;
    this.authS.getUser().then((res: any) => {
      this.currentCompany = res.comapny;
      this.currentUser = res;
      this.submitted = false;

      this.loadOtherInfo();
    })
      .catch((err) => {
        console.log(err);
        this.submitted = false;
      });
  }


}
