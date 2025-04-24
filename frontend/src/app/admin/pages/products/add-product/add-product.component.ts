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
      stock: [0, [Validators.required, Validators.min(0)]],
      price: [{ value: null, disabled: true }, [Validators.required, Validators.min(0)]],
      categoryId: [null, Validators.required],
      images: [null]
    });

    this.loadCategories();

    // Dynamically enable/disable the price field
    this.productForm.get('stock')?.valueChanges.subscribe(value => {
      if (value >= 1) {
        this.productForm.get('price')?.enable();
      } else {
        this.productForm.get('price')?.disable();
        this.productForm.get('price')?.reset();
      }
    });
  }

  loadCategories(): void {
    this.catalogService.getCategories().subscribe({
      next: (res) => this.categories = res,
      error: () => console.error('Error loading categories')
    });
  }

  onImageSelected(event: any): void {
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
    formData.append('name', this.productForm.value.name);
    formData.append('description', this.productForm.value.description || '');
    formData.append('stock', this.productForm.value.stock);
    formData.append('price', this.productForm.get('price')?.value || 0);
    formData.append('categoryId', this.productForm.value.categoryId);

    this.selectedFiles.forEach(file => formData.append('images', file));
    
    this.catalogService.createProduct(formData).subscribe({
      next: () => {
        alert('Product created successfully!');
        this.productForm.reset();
        this.imagePreviews = [];
        this.selectedFiles = [];
      },
      error: err => {
        console.error(err);
        alert('Error adding product.');
      }
    });
  }
}