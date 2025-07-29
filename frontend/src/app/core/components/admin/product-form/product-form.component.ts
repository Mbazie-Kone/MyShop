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
  loading: boolean = true; // Loading state for initial data
  saving: boolean = false; // Loading state for form submission

  // Deleting image
  existingImages: { id: number; url: string }[] = [];
  deletedImageIds: number[] = [];

  maxImages = 8;
  isFileInputDisabled = false;

  // Description editor properties
  descriptionLength: number = 0;
  maxDescriptionLength: number = 2000;
  descriptionPlaceholder: string = 'Enter a detailed description of your product...';
  showDescriptionPreview: boolean = false;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private catalogService: CatalogService) {}

  ngOnInit(): void {
    this.productForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [
        Validators.required, 
        Validators.minLength(10), 
        Validators.maxLength(this.maxDescriptionLength)
      ]],
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
      } else {
        this.loading = false; // No product to load, categories will be loaded
      }
    });

    // Monitor description changes for character count
    this.productForm.get('description')?.valueChanges.subscribe(value => {
      this.descriptionLength = value ? value.length : 0;
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
    this.catalogService.getCategories().subscribe({
      next: (res) => {
        this.categories = res;
        if (!this.isEditMode) {
          this.loading = false; // Categories loaded, no product to load
        }
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.loading = false;
      }
    });
  }

  loadProduct(id: number): void {
    this.catalogService.getProductById(id).subscribe({
      next: (product) => {
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
        this.loading = false; // Both categories and product loaded
      },
      error: (error) => {
        console.error('Error loading product:', error);
        this.loading = false;
      }
    });
  }

  // Description editor methods
  onDescriptionInput(event: any): void {
    const value = event.target.value;
    this.descriptionLength = value ? value.length : 0;
  }

  clearDescription(): void {
    this.productForm.get('description')?.setValue('');
    this.descriptionLength = 0;
  }

  toggleDescriptionPreview(): void {
    this.showDescriptionPreview = !this.showDescriptionPreview;
  }

  getDescriptionStatus(): string {
    const length = this.descriptionLength;
    if (length === 0) return 'empty';
    if (length < 10) return 'too-short';
    if (length > this.maxDescriptionLength * 0.9) return 'near-limit';
    if (length > this.maxDescriptionLength) return 'over-limit';
    return 'good';
  }

  getDescriptionStatusClass(): string {
    const status = this.getDescriptionStatus();
    switch (status) {
      case 'empty': return 'text-muted';
      case 'too-short': return 'text-warning';
      case 'near-limit': return 'text-warning';
      case 'over-limit': return 'text-danger';
      default: return 'text-success';
    }
  }

  getDescriptionStatusText(): string {
    const status = this.getDescriptionStatus();
    switch (status) {
      case 'empty': return 'Description is required';
      case 'too-short': return 'Description is too short (minimum 10 characters)';
      case 'near-limit': return 'Approaching character limit';
      case 'over-limit': return 'Exceeded character limit';
      default: return 'Description length is good';
    }
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

    this.saving = true; // Start saving loading state

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
        next: () => {
          this.saving = false;
          this.handleSuccess();
        },
        error: (err) => {
          this.saving = false;
          alert('Update failed: ' + err.message);
        }
      });
    } else {
      this.catalogService.createProduct(formData).subscribe({
        next: () => {
          this.saving = false;
          this.handleSuccess();
        },
        error: (err) => {
          this.saving = false;
          alert('Creation failed: ' + err.message);
        }
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
