import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Category } from '../../../../core/models/catalog.model';
import { ActivatedRoute, Router } from '@angular/router';
import { CatalogService } from '../../../services/catalog.service';

@Component({
  selector: 'app-edit-product',
  standalone: false,
  templateUrl: './edit-product.component.html',
  styleUrl: './edit-product.component.css'
})
export class EditProductComponent implements OnInit {
  productForm!: FormGroup;
  categories: Category[] = [];
  SelectedFiles: File[] = [];
  productId!: number;
  existingImages: string[] = [];

  constructor(private route: ActivatedRoute, private catalogService: CatalogService, private fb: FormBuilder, private router: Router) {}
 
  ngOnInit(): void {
   this.productId = +this.route.snapshot.paramMap.get('id')!;
   this.loadCategories();
   this.loadProduct();
   this.initForm();
  }

  initForm() {
    this.productForm = this.fb.group({
      name: ['', Validators.required ],
      description: [''],
      price: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      categoryId: [null, Validators.required],
      Images: [null]
    });
  }

}
