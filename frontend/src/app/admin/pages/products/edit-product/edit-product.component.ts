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
  productId!: number;
  SelectedFiles: File[] = [];

  constructor(private route: ActivatedRoute, private catalogService: CatalogService, private fb: FormBuilder, private router: Router) {}
 
  ngOnInit(): void {
   this.productId = +this.route.snapshot.paramMap.get('id')!;
   this.initForm();

   this.catalogService.getProductById(this.productId).subscribe(product => {
    this.productForm.patchValue({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      categoryId: product.categoryId
    });
   });
  }

  initForm() {
    this.productForm = this.fb.group({
      name: ['', Validators.required ],
      description: [''],
      price: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      categoryId: [null, Validators.required]
    });
  }

  onFileSelected(event: any): void {
    this.SelectedFiles = Array.from(event.target.files);
  }

 onSubmit(): void {
  const formData = new FormData();
  formData.append('Name', this.productForm.value.name);
  formData.append('Description', this.productForm.value.description);
  formData.append('Price', this.productForm.value.price);
  formData.append('Stock', this.productForm.value.stock);
  formData.append('CategoryId', this.productForm.value.categoryId);
 }

}
