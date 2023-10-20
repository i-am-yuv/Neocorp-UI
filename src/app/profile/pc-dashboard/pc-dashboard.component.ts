import { Component, OnInit } from '@angular/core';
import { Product } from '../profile-models';
import { ProductCategory } from '../product-category';
import { Router } from '@angular/router';
import { ProfilepageService } from '../profilepage.service';
import { MenuItem } from 'primeng/api';

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

  constructor(private router: Router, private profileService: ProfilepageService) { }

  ngOnInit(): void {

    this.items = [{label: 'Settings'},{ label: 'Product Categories', routerLink: ['/profile/productCategories'] }, { label: 'Dashboard'}];

    this.getAllProductCategories();
  }

  getAllProductCategories(){
    this.submitted = true;
    this.profileService.getAllProductCategory()
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

}
