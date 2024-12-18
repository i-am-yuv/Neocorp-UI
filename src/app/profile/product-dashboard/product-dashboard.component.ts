import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProfilepageService } from '../profilepage.service';
import { Product } from '../profile-models';
import { MenuItem, MessageService } from 'primeng/api';
import { AuthService } from 'src/app/auth/auth.service';
import { BreadCrumbService } from 'src/app/shared/navbar/bread-crumb.service';

@Component({
  selector: 'app-product-dashboard',
  templateUrl: './product-dashboard.component.html',
  styleUrls: ['./product-dashboard.component.scss']
})
export class ProductDashboardComponent implements OnInit {

  submitted: boolean = false;
  allProducts: any[] = [];
  activeProduct: Product = {};

  totalRecords: number = 0;

  items!: MenuItem[];

  constructor(private router: Router, private profileService: ProfilepageService,
    private authS: AuthService,
    private message: MessageService, private breadCrumbService: BreadCrumbService
  ) { }

  ngOnInit(): void {
    this.breadCrumbService.breadCrumb([{ label: 'Product', routerLink: ['/profile/products'] }, { label: 'Dashboard' }]);

    this.loadUser();
  }

  getAllProducts() {
    this.submitted = true;
    this.profileService.getAllProduct(this.currentUser)
      .then((res: any) => {
        this.allProducts = res;
        if (this.allProducts.length > 0) {
          this.changeProduct(this.allProducts[0]);
        } else {
          this.activeProduct = {};
        }
        this.totalRecords = res.length;
        this.submitted = false;
      })
      .catch((err) => {
        console.log(err);
        this.submitted = false;
        this.message.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error while fetching the all  products',
          life: 3000,
        });
      })
  }

  changeProduct(product: Product) {
    this.activeProduct = product;
  }

  CreateProduct() {
    this.router.navigate(['/profile/product/create']);
  }

  onEditProduct(id: string) {
    this.router.navigate(['profile/product/edit/' + id])
  }

  myFunction(item: any): string {
    return parseFloat(item).toFixed(2);
  }

  searchProduct: any;
  searchProducts(value: any) {
    if (value === null) {
      //alert(value);
      this.getAllProducts();
    }
    else {
      // this.submitted = true;
      this.profileService.searchProduct(value).then(
        (res: any) => {
          console.log(res);
          this.allProducts = res.content;
          if (this.allProducts.length > 0) {
            this.changeProduct(this.allProducts[0]);
          } else {
            this.activeProduct = {};
          }
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

  currentCompany: any = {};
  currentUser: any = {};
  loadUser() {
    this.submitted = true;
    this.authS.getUser().then((res: any) => {
      this.currentCompany = res.comapny;
      this.currentUser = res;
      this.submitted = false;
      this.getAllProducts();
    })
      .catch((err) => {
        console.log(err);
        this.submitted = false;
      });
  }


}
