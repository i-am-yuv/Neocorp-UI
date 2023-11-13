import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { ProfilepageService } from '../profilepage.service';
import { ProductCategory } from '../product-category';
import { AuthService } from 'src/app/auth/auth.service';
import { BreadCrumbService } from 'src/app/shared/navbar/bread-crumb.service';

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
    private route: ActivatedRoute,
    private authS: AuthService, private breadCrumbService: BreadCrumbService) { }

  ngOnInit(): void {

    this.initProductCategoryForm();
    this.loadUser();
  }

  loadOtherInfo() {
    this.id = this.route.snapshot.paramMap.get('id');

    if (this.id === null) {
      this.breadCrumbService.breadCrumb([{ label: 'Product Category', routerLink: ['/profile/productCategories'] }, { label: 'Create' }]);
    } else {
      this.breadCrumbService.breadCrumb([{ label: 'Product Category', routerLink: ['/profile/productCategories'] }, { label: 'Edit' }]);
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
        this.availableProductCategory();
      }
    });

    // this.initProductCategoryForm();
    this.getAllProductCategory();
    this.getProductCategoryDetails();
  }

  initProductCategoryForm() {
    this.productCategoryForm = new FormGroup({
      id: this.fb.nonNullable.control(''),
      searchKey: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
      description: new FormControl(''),
      parent: this.fb.group({
        id: this.fb.nonNullable.control('')
      })
    });
  }

  getAllProductCategory() {
    this.submitted = true;
    this.profileS.getAllProductCategory(this.currentUser).then(
      (res) => {
        console.log(res);
        if (this.id != null) {
          this.categories = res.filter((pi: ProductCategory) => pi.id != this.id);
        }
        else {
          this.categories = res;
        }
        this.submitted = false;
      }
    ).catch(
      (err) => {
        console.log(err);
        this.submitted = false;
        this.message.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error While fetching All Product Category',
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
          this.router.navigate(['/profile/productCategories']);
        } else {
          this.createNew = false;
        }
      })
      .catch((err) => {
        console.log(err);
        this.submitted = false;
        this.message.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error While fetching this Product Category',
          life: 3000,
        });
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

    if (this.productCategoryForm.value.parent == null || this.productCategoryForm.value.parent.id == "") {
      this.productCategoryForm.value.parent = null;
    }
    else {

    }
    var productCategoryFormVal = this.productCategoryForm.value;
    productCategoryFormVal.id = this.id;

    if (productCategoryFormVal.id) {
      this.submitted = true;
      this.profileS.updateProductCategory(productCategoryFormVal)
        .then((res: any) => {
          console.log(res);
          this.productCategoryForm.patchValue = { ...res };
          this.submitted = false;
          this.message.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Product Category updated Successfully',
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
              summary: 'Error',
              detail: 'Error while updating the product category',
              life: 3000,
            });
          })
    } else {

      productCategoryFormVal.user = this.currentUser;
      this.profileS.createProductCategory(productCategoryFormVal).then(
        (res) => {
          console.log(res);
          this.message.add({
            severity: 'success',
            summary: 'Sucess',
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
            summary: 'Error',
            detail: 'Error While Adding the Product Category',
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

  createProductCategory() {
    this.router.navigate(['/profile/productCategory/create']);
  }


}
