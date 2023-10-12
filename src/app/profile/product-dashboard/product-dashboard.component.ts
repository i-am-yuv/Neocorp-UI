import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProfilepageService } from '../profilepage.service';
import { Product } from '../profile-models';

@Component({
  selector: 'app-product-dashboard',
  templateUrl: './product-dashboard.component.html',
  styleUrls: ['./product-dashboard.component.scss']
})
export class ProductDashboardComponent implements OnInit {

  submitted: boolean = false;
  allProducts: any[] = [];
  activeProduct : Product = {};

  totalRecords : number = 0;

  constructor(private router: Router, private profileService: ProfilepageService) { }

  ngOnInit(): void {
    this.getAllProducts();
  }

  getAllProducts() {
    this.submitted = true;
    this.profileService.getAllProduct()
      .then((res: any) => {
        this.allProducts = res.content;
        this.totalRecords = res.totalElements
        this.submitted = false;
      })
      .catch((err) => {
        console.log(err);
        this.submitted = false;
      })
  }

  changeProduct(product: Product){
    this.activeProduct = product;
  }

  CreateProduct() {
    this.router.navigate(['/profile/product/create']);
  }

  onEditProduct(id: string){
    this.router.navigate(['profile/product/edit/' + id])
  }

}
