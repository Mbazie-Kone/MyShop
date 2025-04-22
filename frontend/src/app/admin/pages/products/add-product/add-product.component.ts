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
  imagePreviews: string[] = [];

  constructor(private fb: FormBuilder, private catalogService: CatalogService) {}
  
  ngOnInit(): void {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      price: [null, Validators.required],
      stock: ['', Validators.required],
      categoryId: ['', Validators.required],
      images: [null]
    });

    this.catalogService.getCategories().subscribe(res => this.categories = res);

    this.productForm.get('stock')?.valueChanges.subscribe(value => {
      const priceControl = this.productForm.get('price');
      if (value > 0) {
        priceControl?.enable();
      } else {
        priceControl?.disable();
      }
    });
  }

  onImageSelected(event: any) {
    const files: FileList = event.target.files;
    this.selectedFiles = Array.from(files).slice(0, 10); // max 10

    this.imagePreviews = [];
    for (let file of this.selectedFiles) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) this.imagePreviews.push(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.productForm.invalid) return;

    const formData = new FormData();
    const stock = this.productForm.get('stock')?.value;
    const isAvailable = stock > 0;

    formData.append('name', this.productForm.get('name')?.value);
    formData.append('description', this.productForm.get('description')?.value);
    formData.append('price', this.productForm.get('price')?.value);
    formData.append('stock', stock);
    formData.append('isAvailable', String(isAvailable));
    formData.append('categoryId', this.productForm.get('categoryId')?.value);
    
    for (let file of this.selectedFiles) {
      formData.append('images', file);
    }
    
    this.catalogService.createProduct(formData).subscribe({
      next: () => {
        alert('Product created successfully!');
        this.productForm.reset();
        this.imagePreviews = [];
      },
      error: err => {
        console.error(err);
        alert('Failed to create product.');
      }
    });
  }
}