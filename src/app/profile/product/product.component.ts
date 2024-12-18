import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { ProfilepageService } from '../profilepage.service';
import { Product } from '../profile-models';
import { ProductCategory } from '../product-category';
import { AuthService } from 'src/app/auth/auth.service';
import { BreadCrumbService } from 'src/app/shared/navbar/bread-crumb.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

  id: string | null = '';
  submitted: boolean = false;
  productForm!: FormGroup;
  createNew: boolean = false;
  currentCategory: ProductCategory = {};

  category: Product[] = [];

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

  chooseProductTypeId: any;
  currentProduct: Product = {};
  items!: MenuItem[];

  constructor(private router: Router,
    private route: ActivatedRoute,
    private message: MessageService,
    private fb: FormBuilder,
    private profileS: ProfilepageService,
    private authS: AuthService, private breadCrumbService: BreadCrumbService) { }

  ngOnInit(): void {
    this.initForm();
    this.loadUser();
  }

  loadOtherInfo() {
    this.id = this.route.snapshot.paramMap.get('id');

    if (this.id === null) {
      this.breadCrumbService.breadCrumb([{ label: 'Product', routerLink: ['/profile/products'] }, { label: 'Create' }]);
    }
    else {
      this.breadCrumbService.breadCrumb([{ label: 'Product', routerLink: ['/profile/products'] }, { label: 'Edit' }]);
    }

    this.route.url.subscribe(segments => {
      let lastSegment = segments[segments.length - 1];
      if (lastSegment && lastSegment.path == 'create') {
        this.createNew = true;
      }
      else if (lastSegment && lastSegment.path == this.id) {
        this.createNew = true;
      }
      else {
        this.availableProducts();
      }
    });

    // this.initForm();
    this.loadCategories();
    this.getProductDetails();
  }

  // Product Init Form
  initForm() {
    this.productForm = new FormGroup({
      name: new FormControl('', Validators.required),
      model: new FormControl('', Validators.required),
      description: new FormControl(''),
      searchKey: new FormControl('', Validators.required),
      skuCode: new FormControl(''),
      barCode: new FormControl('', Validators.required),
      thumbnail: new FormControl(''),
      help: new FormControl(''),
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

  // Submit Product Function
  onSubmitProduct() {
    // this.productForm.value.taxRate = null;
    // this.productForm.value.brand = null;

    console.log(this.productForm);
    var productFormVal = this.productForm.value;
    productFormVal.id = this.id;

    if (productFormVal.id) {
      this.submitted = true;
      this.profileS.updateProduct(productFormVal).then((res: any) => {
        console.log(res);
        this.productForm.patchValue = { ...res };
        this.submitted = false;
        this.message.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Product updated',
          life: 3000,
        });
        setTimeout(() => {
          this.router.navigate(['/profile/products']);
        }, 2000);

      })
        .catch((err) => {
          console.log(err);
          this.submitted = false;
          this.message.add({
            severity: 'error',
            summary: 'Error',
            detail: err.error.message,
            life: 3000,
          });
        })
    }
    else {
      productFormVal.user = this.currentUser;
      this.profileS.createProduct(productFormVal).then((res) => {
        console.log(res);
        this.message.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Product Added Successfully',
          life: 3000,
        });
        setTimeout(() => {
          this.router.navigate(['/profile/products']);
        }, 2000);

      })
        .catch((err) => {
          this.message.add({
            severity: 'error',
            summary: 'Error',
            detail: err.error.message,
            life: 3000,
          });
        })
    }
  }

  // Function For Choose the Product Type 
  chooseProductType() {
    if (this.chooseProductTypeId == 1) {
      this.productForm.value.productType = this.productType.find(
        (t: any) => t.id === this.chooseProductTypeId
      ).name;
    }
    else if (this.chooseProductTypeId == 2) {
      this.productForm.value.productType = this.productType.find(
        (t: any) => t.id === this.chooseProductTypeId
      ).name;
    }
  }

  // Load Available Function
  availableProducts() {
    this.submitted = true;
    this.profileS.getAllProduct(this.currentUser).then((res: any) => {
      var count = res.length;
      this.submitted = false;

      if (count > 0) {
        this.router.navigate(['/profile/products']);
      }
      else {
        this.createNew = false;
      }

    })
      .catch((err) => {
        console.log(err);
        this.submitted = false;
      })
  }

  // Patch The Values in the exsting fields
  getProductDetails() {
    if (this.id) {
      this.submitted = true;
      this.profileS.getProductById(this.id)
        .then((product: Product) => {
          console.log(product);
          this.currentProduct = product;
          this.productForm.patchValue(product);
          this.submitted = false;
        })
        .catch((err) => {
          console.log(err);
          this.submitted = false;
        })
    }
  }

  selectProductCategory() {
  }

  loadCategories() {
    this.submitted = true;
    this.profileS.getAllProductCategory(this.currentUser).then((res) => {
      this.category = res;
      console.log(res);
      this.submitted = false;
    })
      .catch((err) => {
        console.log(err);
        this.submitted = false;
        this.message.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error while fetching the product categories',
          life: 3000,
        });
      })
  }

  // Cancel Product
  cancelProduct() {
    this.router.navigate(['/profile/products']);
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

  createProduct() {
    this.router.navigate(['/profile/product/create']);
  }

}
