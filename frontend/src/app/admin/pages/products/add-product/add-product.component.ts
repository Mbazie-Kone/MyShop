import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CatalogService } from '../../../services/catalog.service';
import { Category } from '../../../../core/models/catalog.model';

@Component({
  selector: 'app-add-product',
  standalone: false,
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css'
})
export class AddProductComponent implements OnInit {
  productForm!: FormGroup;
  selectedFiles: File[] = [];
  categories: Category[] = [];

  constructor(private fb: FormBuilder, private catalogService: CatalogService) {}
  
  ngOnInit(): void {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      price: [{ value: '', disabled: true}, Validators.required],
      stock: [0, [Validators.required, Validators.min(0)]],
      categoryId: ['', Validators.required],
      images: [null]
    });

    this.catalogService.getCategories().subscribe(categories => this.categories = categories);

    this.productForm.get('stock')?.valueChanges.subscribe(value => {
      const isAvailable = value > 0;
      this.productForm.get('isAvailable')?.setValue(isAvailable);
      const priceControl = this.productForm.get('price');
      isAvailable ? priceControl?.enable() : priceControl?.disable();
    });
  }

  onFileSelected(event: any) {
    this.selectedFiles = Array.from(event.target.files);
  }

  onSubmit() {
    const formData = new FormData();
    Object.entries(this.productForm.value).forEach(([key, value]) => {
      formData.append(key, value as string);
    });
    this.selectedFiles.forEach(file => {
      formData.append('Images', file);
    })

  }

}
