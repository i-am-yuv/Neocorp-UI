import { Component, OnInit } from '@angular/core';
import { Product } from '../profile-models';
import { ProductCategory } from '../product-category';
import { Router } from '@angular/router';
import { ProfilepageService } from '../profilepage.service';
import { MenuItem } from 'primeng/api';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-pc-dashboard',
  templateUrl: './pc-dashboard.component.html',
  styleUrls: ['./pc-dashboard.component.scss']
})
export class PcDashboardComponent implements OnInit {

  submitted: boolean = false;
  allProductCategories: any[] = [];
  activeProductCategory : ProductCategory = {};

  totalRecords : number = 0;

  items!: MenuItem[];

  searchProductCategory : any ;

  constructor(private router: Router, private profileService: ProfilepageService ,
    private authS : AuthService) { }

  ngOnInit(): void {

    this.items = [{label: 'Settings'},{ label: 'Product Category', routerLink: ['/profile/productCategories'] }, { label: 'Dashboard'}];

    this.getAllProductCategories();
  }

  getAllProductCategories(){
    this.submitted = true;
    this.profileService.getAllProductCategory(this.currentUser)
    .then((res: any) =>{
      this.allProductCategories = res.content;
      this.totalRecords = res.totalElements;
      this.submitted = false;
    })
    .catch((err) => {
      console.log(err);
      this.submitted = false;
    })
  }

  changeProductCategory(productCategory: ProductCategory){
    this.activeProductCategory = productCategory;
  }

  CreateProductCategory() {
    this.router.navigate(['/profile/productCategory/create']);
  }

  onEditProductCategory(id: string){
    this.router.navigate(['profile/productCategory/edit/' + id]);
  }

  searchCategories( pc : ProductCategory)
  {
      if (pc === null) {
        //alert(value);
        this.getAllProductCategories();
      }
      else{
       // this.submitted = true;
        this.profileService.searchProductCategory(pc).then(
          (res: any) => {
            console.log(res);
            this.allProductCategories = res.content;
            // if (this.allProductCategories.length > 0) {
            //   this.changeProductCategory(this.allProductCategories[0]);
            // } else {
            //   this.activeProductCategory = {};
            // }
            this.totalRecords = res.totalElements;
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

  currentCompany : any = {} ;
  currentUser : any = {} ;
  loadUser() {
    this.submitted = true;
    this.authS.getUser().then((res: any) => {
      this.currentCompany = res.comapny;
      this.currentUser  = res ;
      this.submitted = false;
    })
      .catch((err) => {
        console.log(err);
        this.submitted = false;
      });
  }


}
