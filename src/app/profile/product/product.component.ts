import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ProfilepageService } from '../profilepage.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

  productForm!: FormGroup;

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

  chooseProductTypeId : any;

  constructor(private router: Router,
    private message: MessageService,
    private profileS : ProfilepageService) { }

  ngOnInit(): void {
    this.productForm = new FormGroup({
      name : new FormControl('', Validators.required), //
      model : new FormControl('' , Validators.required),//
      description : new FormControl('' , Validators.required), //
      searchKey : new FormControl('' , Validators.required),//
      skuCode : new FormControl('' , Validators.required),//
      barCode : new FormControl('' , Validators.required),//
      thumbnail : new FormControl(''),//
      help : new FormControl(''),//
      hsnCode : new FormControl('' , Validators.required),//
      imageName : new FormControl(''),//
      imagePath : new FormControl(''),//
      mrp : new FormControl('' , Validators.required),
      productType : new FormControl('' ),//
      category : new FormControl('' ),//
      taxRate : new FormControl(''),//
      brand : new FormControl(''),//
      uom : new FormControl('')//
    });
  }

  onSubmitProduct()
{
  this.productForm.value.category = null ;
  this.productForm.value.taxRate = null ;
  this.productForm.value.brand = null ;
  this.productForm.value.uom = null ;
   console.log( this.productForm) ;
   this.profileS.createProduct(this.productForm.value).then(
    (res)=>{
       console.log(res);
       this.message.add({
        severity: 'success',
        summary: 'Product Saved',
        detail: 'Product Added',
        life: 3000,
      });
    }
   ).catch(
    (err)=>{
      this.message.add({
        severity: 'error',
        summary: 'Product error',
        detail: 'Product server error',
        life: 3000,
      });
    }
   )
}

chooseProductType()
{
  if( this.chooseProductTypeId == 1 )
  {
    this.productForm.value.productType = this.productType.find(
      (t:any) => t.id === this.chooseProductTypeId
    ).name;
  }
  else if(this.chooseProductTypeId == 2 ){
    this.productForm.value.productType = this.productType.find(
      (t:any) => t.id === this.chooseProductTypeId
    ).name;
  }
}

}
