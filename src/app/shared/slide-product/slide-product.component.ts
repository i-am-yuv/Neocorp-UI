import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/auth/auth.service';
import { BillsService } from 'src/app/bills/bills.service';
import { ProductCategory } from 'src/app/profile/product-category';
import { Product } from 'src/app/profile/profile-models';
import { ProfilepageService } from 'src/app/profile/profilepage.service';

@Component({
  selector: 'app-slide-product',
  templateUrl: './slide-product.component.html',
  styleUrls: ['./slide-product.component.scss']
})
export class SlideProductComponent implements OnInit {

  submitted: boolean = false;
  isOpen: boolean = true;
  productForm !: FormGroup;
  category: Product[] = [];
  currentCategory: ProductCategory = {};

  productType: any = [
    {
      "id": "1",
      "name": "ITEM"
    },
    {
      "id": "2",
      "name": "SERVICE"
    }
  ];

  constructor(private router: Router,
    private route: ActivatedRoute,
    private message: MessageService,
    private fb: FormBuilder,
    private billS: BillsService,
    private profileS: ProfilepageService, private authS: AuthService) { }

  ngOnInit(): void {
    this.initForm();
    this.loadUser();
  }

  initForm() {
    this.productForm = new FormGroup({
      name: new FormControl('', Validators.required),
      model: new FormControl('', Validators.required),
      description: new FormControl(''),
      searchKey: new FormControl('', Validators.required),
      skuCode: new FormControl(''),
      barCode: new FormControl('', Validators.required),
      thumbnail: new FormControl(''),
      help: new FormControl(''),//
      hsnCode: new FormControl(''),
      imageName: new FormControl(''),
      imagePath: new FormControl(''),
      mrp: new FormControl('', Validators.required),
      productType: new FormControl('', Validators.required),
      category: this.fb.group({
        id: this.fb.nonNullable.control('', Validators.required)
      }),
      taxRate: new FormControl(''),
      brand: new FormControl('')
    });
  }

  loadCategories() {
    this.submitted = true;
    this.profileS.getAllProductCategory(this.currentUser).then(
      (res) => {
        this.category = res;
        console.log(res);
        this.submitted = false;
      }
    ).catch(
      (err) => {
        console.log(err);
        this.submitted = false;
        this.message.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error while fetching the product categories',
          life: 3000,
        });
      }
    )
  }

  onSubmitProduct() {
    this.productForm.value.taxRate = null;
    this.productForm.value.brand = null;

    var productFormVal = this.productForm.value;
    productFormVal.user = this.currentUser;

    //var productFormVal = this.productForm.value;
    this.submitted = true;
    this.profileS.createProduct(productFormVal).then(
      (res) => {
        console.log(res);
        this.submitted = false;
        this.message.add({
          severity: 'success',
          summary: 'Product Saved',
          detail: 'Product Added Successfully',
          life: 3000,
        });
        this.productForm.reset();
      }
    ).catch(
      (err) => {
        this.submitted = false;
        this.message.add({
          severity: 'error',
          summary: 'Product error',
          detail: 'Product server error',
          life: 3000,
        });
      })
  }

  selectProductCategory() {
  }

  currentCompany: any = {};
  currentUser: any = {};
  loadUser() {
    this.submitted = true;
    this.authS.getUser().then((res: any) => {
      this.currentCompany = res.comapny;
      this.currentUser = res;
      this.submitted = false;

      this.loadCategories();
      // this.loadOtherInfo();
    })
      .catch((err) => {
        console.log(err);
        this.submitted = false;
      });
  }


}
