import { Component, OnInit } from '@angular/core';
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

  // Deleting image
  existingImages: { id: number; url: string }[] = [];
  deletedImageIds: number[] = [];

  maxImages = 8;
  isFileInputDisabled = false;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private catalogService: CatalogService) {}

  ngOnInit(): void {
    this.productForm = this.fb.group({
      name: ['', [Validators.required]],
      description: [''],
      stock: [0, [Validators.required, Validators.min(0)]],
      price: [{ value: 0, disabled: true}, [Validators.required, Validators.min(0), Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      productCode: ['', [Validators.required, Validators.minLength(16), Validators.maxLength(16), Validators.pattern(/^[A-Z0-9-]+$/)]],
      sku: ['', [Validators.required, Validators.minLength(16), Validators.maxLength(16), Validators.pattern(/^[A-Z0-9]+$/)]],
      categoryId: [null, [Validators.required]],
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

      this.existingImages = product.images;
    });
  }

  onImageSelected(event: any): void {
    const files: FileList = event.target.files;

    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const totalImages = this.selectedFiles.length + this.existingImages.length;
      if (totalImages >= this.maxImages) break;
    
      const file = files[i];
      if (['image/jpeg', 'image/png'].includes(file.type)) {
        this.selectedFiles.push(file);
        const reader = new FileReader();
        reader.onload = e => {
          this.imagePreviews.push(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }

    // Update input disabled state
    this.updateFileInputState();

    // Reset input to allow identical subsequent selections
    event.target.value = '';
  }

  updateFileInputState(): void {
    const total = this.selectedFiles.length + this.existingImages.length;
    this.isFileInputDisabled = total >= this.maxImages;
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
      this.deletedImageIds.forEach(id => {
        formData.append('deletedImageIds', id.toString());
      });

      this.catalogService.updateProduct(this.productId, formData).subscribe({
        next: () => this.handleSuccess(),
        error: err => alert('Update failed: ' + err.message)
      });
    } else {
      this.catalogService.createProduct(formData).subscribe({
        next: () => this.handleSuccess(),
        error: err => alert('Creation failed: ' + err.message)
      });
    }
  }

  removeExistingImage(id: number): void {
    this.existingImages = this.existingImages.filter(img => img.id !== id);
    this.deletedImageIds.push(id);
    this.updateFileInputState();
  }

  removeSelectedImage(index: number): void {
    this.selectedFiles.splice(index, 1);
    this.imagePreviews.splice(index, 1);
    this.updateFileInputState();
  }

  private handleSuccess(): void {
    this.showToast = true;
    this.productForm.reset();
    this.imagePreviews = [];
    this.selectedFiles = [];

    setTimeout(() => {
      this.showToast = false;
      this.router.navigate(['/administration/view-products']);
    }, 3000); // Hide the toast after 3 seconds
  }

}
