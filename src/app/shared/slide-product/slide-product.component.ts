import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { BillsService } from 'src/app/bills/bills.service';
import { ProfilepageService } from 'src/app/profile/profilepage.service';

@Component({
  selector: 'app-slide-product',
  templateUrl: './slide-product.component.html',
  styleUrls: ['./slide-product.component.scss']
})
export class SlideProductComponent implements OnInit {

  submitted : boolean = false;
  isOpen : boolean = true;
  productForm !: FormGroup ;
  category : any[] = [];

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
    private profileS : ProfilepageService) { }

  ngOnInit(): void {
    this.initForm();
    this.getAllProductCategories();
  }

  initForm()
  {
    this.productForm = new FormGroup({
      name: new FormControl('', Validators.required), 
      model: new FormControl('', Validators.required),
      description: new FormControl(''),
      searchKey: new FormControl(''),
      skuCode: new FormControl(''),
      barCode: new FormControl(''),
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

  getAllProductCategories()
  {
    
    this.submitted = true;
      this.billS.getAllProductCategory().then(
        (res) => {
          console.log(res);
          //this.poForm.patchValue = { ...res };
          this.submitted = false;
          this.category =  res.content;
        }
      ).catch(
        (err) => {
          console.log(err);
          this.submitted = false;
          this.message.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error While Fetching the product categories',
            life: 3000,
          });
        }
      )
  }

  onSubmitProduct()
  {
    this.productForm.value.taxRate = null;
    this.productForm.value.brand = null;

    //var productFormVal = this.productForm.value;
    this.submitted = true;
    this.profileS.createProduct(this.productForm.value).then(
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

  selectProductCategory(){
  }


}
