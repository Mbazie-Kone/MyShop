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

  constructor(private fb: FormBuilder, private catalogService: CatalogService) { }

  ngOnInit(): void {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      stock: ['', [Validators.required, Validators.min(0)]],
      price: [{ value: null, disabled: true }, [Validators.required, Validators.min(0), Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      categoryId: [this.categories[0]?.id || null, Validators.required],
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
      next: (res) => {
        this.categories = res;
        if (this.categories.length > 0) {
          this.productForm.patchValue({
            categoryId: this.categories[0].id
          });
        }
      },
      error: () => console.error('Error loading categories')
    });
  }

  get isPriceDisabled(): boolean {
    return (this.productForm.get('stock')?.value || 0) < 1;
  }

  onImageSelected(event: any): void {
    const files: FileList = event.target.files;
    const allowedTypes = ['image/jpeg', 'image/png'];
    this.selectedFiles = [];
    this.imagePreviews = [];

    for (let i = 0; i < files.length && this.selectedFiles.length < 10; i++) {
      const file = files[i];
      if (allowedTypes.includes(file.type)) {
        this.selectedFiles.push(file);

        const reader = new FileReader();
        reader.onload = () => {
          if (reader.result) this.imagePreviews.push(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        alert(`File "${file.name}" is not a valid image. only JPG and PNG are allowes.`);
      }
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