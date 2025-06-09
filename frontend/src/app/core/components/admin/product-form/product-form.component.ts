import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Category } from '../../../models/catalog.model';
import { ActivatedRoute, Router } from '@angular/router';
import { CatalogService } from '../../../../admin/services/catalog.service';

@Component({
  selector: 'app-product-form',
  standalone: false,
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css'
})
export class ProductFormComponent implements OnInit {
  productForm!: FormGroup;
  imagePreviews: string[] = [];
  selectedFiles: File[] = [];
  categories: Category[] = [];
  isEditMode = false;
  productId!: number;
  showToast = false;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private catalogService: CatalogService) {}

  ngOnInit(): void {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      stock: [0, [Validators.required, Validators.min(0)]],
      price: [{ value: 0, disabled: true}, [Validators.required, Validators.min(0)]],
      productCode: ['', Validators.required],
      sku: ['', Validators.required],
      categoryId: [null, Validators.required],
      images: [null]
    });

    this.loadCategories();

    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.isEditMode = true;
        this.productId = +idParam;
        this.loadProduct(this.productId);
      }
    });

    this.productForm.get('stock')?.valueChanges.subscribe(stock => {
      const priceControl = this.productForm.get('price');
      if (stock > 0) {
        priceControl?.enable();
      } else {
        priceControl?.disable();
        priceControl?.setValue(0);
      }
    });
  }

  loadCategories(): void {
    this.catalogService.getCategories().subscribe(res => {
      this.categories = res;
    });
  }

  loadProduct(id: number): void {
    this.catalogService.getProductById(id).subscribe(product => {
      this.productForm.patchValue({
        name: product.name,
        description: product.description,
        stock: product.stock,
        price: product.price,
        productCode: product.productCode,
        sku: product.sku,
        categoryId: product.categoryId
      });
    });
  }

  onImageSelected(event: any): void {
    const files = event.target.files;
    this.selectedFiles = [];
    this.imagePreviews = [];

    for (let i = 0; i < files.length && this.selectedFiles.length < 10; i++) {
      const file = files[i];
      if (['image/jpeg', 'image/png'].includes(file.type)) {
        this.selectedFiles.push(file);
        const reader = new FileReader();
        reader.onload = e => this.imagePreviews.push(reader.result as string);
        reader.readAsDataURL(file);
      }
    }
  }

  onSubmit(): void {
    if (this.productForm.invalid) return;

    const formData = new FormData();
    formData.append('name', this.productForm.value.name);
    formData.append('description', this.productForm.value.description || '');
    formData.append('stock', this.productForm.value.stock.toString());
    formData.append('price', this.productForm.value.price?.toString() || '0');
    formData.append('productCode', this.productForm.value.productCode);
    formData.append('sku', this.productForm.value.sku);
    formData.append('categoryId', this.productForm.value.categoryId.toString());

    this.selectedFiles.forEach(file => {
      formData.append('images', file);
    });

    if (this.isEditMode) {
      this.catalogService.updateProduct(this.productId, formData).subscribe({
        next: () => {
          this.showToast = true;
          this.productForm.reset();
          this.imagePreviews = [];
          this.selectedFiles = [];

          setTimeout(() => {
            this.showToast = false;
            this.router.navigate(['/administration/view-products']);
          }, 3000) // Hide the toast after 3 seconds
        },

        error: err => alert('Update failed: ' + err.message)
      });
    } else {
      this.catalogService.createProduct(formData).subscribe({
        next: () => {
          this.showToast = true;
          this.productForm.reset();
          this.imagePreviews = [];
          this.selectedFiles = [];

          setTimeout(() => {
            this.showToast = false;
            this.router.navigate(['/administration/view-products']);
          }, 3000)
        },
        error: err => alert('Creation failed: ' + err.message)
      });
    }
  }

}
