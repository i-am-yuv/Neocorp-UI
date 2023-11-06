import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { ProfilepageService } from '../profilepage.service';
import { ProductCategory } from '../product-category';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  id: string | null = '';
  productCategoryForm!: FormGroup;
  categories: any[] = [];
  createNew: boolean = false;
  submitted: boolean = false;
  currentProductCategory: ProductCategory = {};

  showSaveButton: boolean = true;

  items: MenuItem[] = [];
  home: MenuItem[] = [];

  constructor(private router: Router,
    private message: MessageService,
    private profileS: ProfilepageService,
    private fb: FormBuilder,
    private route: ActivatedRoute ,
    private authS  : AuthService ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');

    this.route.url.subscribe(segments => {
      let lastSegment = segments[segments.length - 1];
      if (lastSegment && lastSegment.path == 'create') {
        this.createNew = true;
      }
      else if (lastSegment && lastSegment.path == this.id) {
        this.createNew = true;
      }
      else {
        this.loadUser();
       
      }
    });

    this.items = [{ label: 'Settings' }, { label: 'Product Category', routerLink: ['/profile/productCategories'] }, { label: 'Create', routerLink: ['/profile/productCategory/create'] }];

    // this.home = { icon:  routerLink: '/profile/productCategory' };

    this.initProductCategoryForm();
    this.loadUser();
    this.getProductCategoryDetails();

  }

  initProductCategoryForm() {
    this.productCategoryForm = new FormGroup({
      searchKey: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      parent: this.fb.group({
        id: this.fb.nonNullable.control('')
      })
    });
  }

  getAllProductCategory() {
    this.profileS.getAllProductCategory(this.currentUser).then(
      (res) => {
        console.log(res);
        this.categories = res;
      }
    ).catch(
      (err) => {
        console.log(err);
        this.message.add({
          severity: 'error',
          summary: 'Product Category',
          detail: 'Error While fetching Product Category',
          life: 3000,
        });
      }
    )
  }

  availableProductCategory() {
    this.submitted = true;
    this.profileS.getAllProductCategory(this.currentUser)
      .then((res: any) => {
        var count = res.length;
        this.submitted = false;

        if (count > 0) {
          this.router.navigate(['/profile/productCategory']);
        } else {
          this.createNew = false;
        }
      })
      .catch((err) => {
        console.log(err);
        this.submitted = false;
      })
  }

  getProductCategoryDetails() {
    if (this.id) {
      this.submitted = true;
      this.profileS.getProductCategoryById(this.id)
        .then((productCategory: ProductCategory) => {
          console.log(productCategory);
          this.currentProductCategory = productCategory;
          this.productCategoryForm.patchValue(productCategory);
          this.submitted = false;
        })
        .catch((err) => {
          console.log(err);
          this.submitted = false;
        })
    }
  }

  onSubmitPC() {
    //this.productCategoryForm.value.parent = null;
    var productCategoryFormVal = this.productCategoryForm.value;
    productCategoryFormVal.id = this.id;
    alert(JSON.stringify(productCategoryFormVal));

    if (productCategoryFormVal.id) {
      this.submitted = true;
      this.profileS.updateProductCategory(productCategoryFormVal)
        .then((res: any) => {
          console.log(res);
          this.productCategoryForm.patchValue = { ...res };
          this.submitted = false;
          this.message.add({
            severity: 'success',
            summary: 'Product Updated',
            detail: 'Product updated',
            life: 3000,
          });
          setTimeout(() => {
            this.router.navigate(['/profile/productCategories']);
          }, 2000);

        })
        .catch(
          (err) => {
            console.log(err);
            this.submitted = false;
            this.message.add({
              severity: 'error',
              summary: 'Sales Order updated Error',
              detail: 'Some Server Error',
              life: 3000,
            });
          })
    } else {
     // console.log(this.productCategoryForm.value);
     productCategoryFormVal.user = this.currentUser ;
      this.profileS.createProductCategory(productCategoryFormVal).then(
        (res) => {
          console.log(res);
          this.message.add({
            severity: 'success',
            summary: 'Product Category Saved',
            detail: 'Product Category Added Successfully',
            life: 3000,
          });
          setTimeout(() => {
            this.router.navigate(['/profile/productCategories']);
          }, 2000);

        })
        .catch((err) => {
          this.message.add({
            severity: 'error',
            summary: 'Product Category',
            detail: 'Error While fetching Product Category',
            life: 3000,
          });
        })
    }
  }

  changeRoute() {

  }

  cancelProductCategory() {
    this.router.navigate(['/profile/productCategories']);
  }

  createPC() { }

  currentCompany : any = {} ;
  currentUser : any = {} ;
  loadUser() {
    this.submitted = true;
    this.authS.getUser().then((res: any) => {
      this.currentCompany = res.comapny;
      this.currentUser  = res ;
      this.submitted = false;
      this.availableProductCategory();
      this.getAllProductCategory();
      
    })
      .catch((err) => {
        console.log(err);
        this.submitted = false;
      });
  }


}
