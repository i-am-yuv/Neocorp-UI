import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ProfilepageService } from '../profilepage.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  productCategoryForm!: FormGroup;
  categories: any[] = [];

  constructor(private router: Router,
    private message: MessageService,
    private profileS: ProfilepageService,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    this.productCategoryForm = new FormGroup({
      searchKey: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      parent: this.fb.group({
        id: this.fb.nonNullable.control('')
      })
    });

    this.loadCategory();

  }

  loadCategory()
  {
    this.profileS.getAllCategory().then(
      (res)=>{
         console.log(res);
         this.categories = res.content;
      }
     ).catch(
      (err)=>{
        this.message.add({
          severity: 'error',
          summary: 'Product Category',
          detail: 'Error While fetching Product Category',
          life: 3000,
        });
      }
     )
  }

  onSubmitPC()
  {
     console.log(this.productCategoryForm.value);
     this.profileS.createProductCategory(this.productCategoryForm.value).then(
      (res)=>{
         console.log(res);
         this.message.add({
          severity: 'success',
          summary: 'Product Category Saved',
          detail: 'Product Category Added Successfully',
          life: 3000,
        });
      }
     ).catch(
      (err)=>{
        this.message.add({
          severity: 'error',
          summary: 'Product Category',
          detail: 'Error While fetching Product Category',
          life: 3000,
        });
      }
     )
  }

}
