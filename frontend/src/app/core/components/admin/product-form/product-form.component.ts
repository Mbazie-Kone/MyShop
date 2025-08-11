import { Component, OnInit, OnDestroy, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Category } from '../../../models/catalog.model';
import { ActivatedRoute, Router } from '@angular/router';
import { CatalogService } from '../../../../admin/services/catalog.service';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { AnalyticsService } from '../../../services/analytics.service';
import { SharedModule } from '../../../../shared/shared.module';
import { Nl2brPipe } from '../../../../shared/pipes/nl2br.pipe';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SharedModule, Nl2brPipe],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css'
})
export class ProductFormComponent implements OnInit, OnDestroy {
  productForm!: FormGroup;
  imagePreviews: string[] = [];
  selectedFiles: File[] = [];
  categories: Category[] = [];
  isEditMode = false;
  productId!: number;
  showToast = false;
  loading = true; // Loading state for initial data
  saving = false; // Loading state for form submission

  // Deleting image
  existingImages: { id: number; url: string }[] = [];
  deletedImageIds: number[] = [];

  maxImages = 8;
  isFileInputDisabled = false;

  // Description editor properties
  descriptionLength = 0;
  maxDescriptionLength = 2000;
  descriptionPlaceholder = 'Enter a detailed description of your product...';
  showDescriptionPreview = false;

  // Auto-save properties
  private autoSaveInterval: number | undefined;
  private destroy$ = new Subject<void>();

  // Drag & drop properties
  isDragOver = false;

  // Description templates
  descriptionTemplates: { name: string; template: string }[] = [
    { name: 'Electronics', template: 'This high-quality electronic device features advanced technology and superior performance. Perfect for both personal and professional use, it offers exceptional reliability and user-friendly operation.' },
    { name: 'Clothing', template: 'Made from premium materials, this garment offers exceptional comfort and style. Designed with attention to detail, it provides a perfect fit and lasting durability for everyday wear.' },
    { name: 'Books', template: 'This engaging book provides readers with valuable insights and knowledge. Written by experts in the field, it offers comprehensive coverage of the subject matter in an accessible format.' },
    { name: 'Home & Garden', template: 'This essential home and garden product enhances your living space with both functionality and aesthetic appeal. Built to last, it combines practical design with beautiful craftsmanship.' }
  ];

  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private catalogService = inject(CatalogService);
  private analyticsService = inject(AnalyticsService);

  // SKU Generation
  private skuGenerationInProgress = false;

  ngOnInit(): void {
    // Track page visit
    this.analyticsService.trackUserJourney('form_opened', this.isEditMode ? 'edit_product' : 'add_product');
    
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
    this.setupAutoSave();

    this.route.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.isEditMode = true;
        this.productId = +idParam;
        this.loadProduct(this.productId);
      } else {
        this.loading = false; // No product to load, categories will be loaded
        this.loadDraftDescription();
      }
      this.analyticsService.trackUserJourney('form_opened', this.isEditMode ? 'edit_product' : 'add_product');
    });

    // Monitor description changes with debounce for better performance
    const descriptionSubscription = this.productForm.get('description')?.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(value => {
      this.descriptionLength = value ? value.length : 0;
    });

    if (descriptionSubscription) {
      this.subscriptions.push(descriptionSubscription);
    }

    this.productForm.get('stock')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(stock => {
        const priceControl = this.productForm.get('price');
        if (stock > 0) {
          priceControl?.enable();
      } else {
          priceControl?.disable();
          priceControl?.setValue(0);
      }
    });

    // Setup SKU Generation
    this.setupSkuGeneration();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.clearAutoSave();
  }

  // Auto-save functionality
  private setupAutoSave(): void {
    this.autoSaveInterval = window.setInterval(() => {
      this.autoSaveDescription();
    }, 30000); // Auto-save every 30 seconds
  }

  private autoSaveDescription(): void {
    const description = this.productForm.get('description')?.value;
    if (description && description.length > 0) {
      localStorage.setItem('product-description-draft', description);
      // Description auto-saved
    }
  }

  private loadDraftDescription(): void {
    const draft = localStorage.getItem('product-description-draft');
    if (draft) {
      this.productForm.get('description')?.setValue(draft);
      this.descriptionLength = draft.length;
    }
  }

  private clearAutoSave(): void {
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
    }
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
  onDescriptionInput(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    const value = target.value;
    this.descriptionLength = value ? value.length : 0;
    this.analyticsService.trackFormInteraction('product_form', 'description_input', 'description');
  }

  clearDescription(): void {
    this.productForm.get('description')?.setValue('');
    this.descriptionLength = 0;
    localStorage.removeItem('product-description-draft');
    this.analyticsService.trackFeatureUsage('description_clear');
  }

  toggleDescriptionPreview(): void {
    this.showDescriptionPreview = !this.showDescriptionPreview;
    this.analyticsService.trackFeatureUsage(`description_preview_${this.showDescriptionPreview ? 'show' : 'hide'}`);
  }

  // Template methods
  applyTemplate(template: string): void {
    this.productForm.get('description')?.setValue(template);
    this.descriptionLength = template.length;
    this.analyticsService.trackFeatureUsage('description_template_applied');
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

  // Dynamic validation methods for all fields
  getFieldStatus(fieldName: string): string {
    const control = this.productForm.get(fieldName);
    if (!control) return 'valid';
    
    if (control.invalid && control.touched) {
      if (control.errors?.['required']) return 'required';
      if (control.errors?.['minlength']) return 'too-short';
      if (control.errors?.['maxlength']) return 'too-long';
      if (control.errors?.['pattern']) return 'invalid-format';
      if (control.errors?.['min']) return 'too-low';
      return 'invalid';
    }
    
    if (control.valid && control.touched) return 'valid';
    return 'empty';
  }

  getFieldStatusClass(fieldName: string): string {
    const status = this.getFieldStatus(fieldName);
    switch (status) {
      case 'empty': return 'text-muted';
      case 'required': return 'text-danger';
      case 'too-short': return 'text-warning';
      case 'too-long': return 'text-warning';
      case 'invalid-format': return 'text-danger';
      case 'too-low': return 'text-danger';
      case 'invalid': return 'text-danger';
      case 'valid': return 'text-success';
      default: return 'text-muted';
    }
  }

  getFieldStatusText(fieldName: string): string {
    const status = this.getFieldStatus(fieldName);
    const control = this.productForm.get(fieldName);
    
    switch (status) {
      case 'empty': 
        return this.getFieldHelperText(fieldName);
      case 'required': 
        return this.getFieldRequiredText(fieldName);
      case 'too-short': 
        return this.getFieldMinLengthText(fieldName, control);
      case 'too-long': 
        return this.getFieldMaxLengthText(fieldName, control);
      case 'invalid-format': 
        return this.getFieldFormatText(fieldName);
      case 'too-low': 
        return this.getFieldMinValueText(fieldName, control);
      case 'invalid': 
        return this.getFieldInvalidText(fieldName);
      case 'valid': 
        return this.getFieldValidText(fieldName);
      default: 
        return this.getFieldHelperText(fieldName);
    }
  }

  private getFieldHelperText(fieldName: string): string {
    const helpers: { [key: string]: string } = {
      'name': 'Enter a descriptive name for your product',
      'productCode': '16 characters, uppercase letters, numbers, and dashes only',
      'sku': '16 characters, uppercase letters and numbers only',
      'categoryId': 'Choose the most appropriate category for your product',
      'stock': 'Enter the available quantity',
      'price': 'Enter the price in euros (e.g., 29.99)'
    };
    return helpers[fieldName] || '';
  }

  private getFieldRequiredText(fieldName: string): string {
    const requiredTexts: { [key: string]: string } = {
      'name': 'Product name is required',
      'productCode': 'Product code is required',
      'sku': 'SKU is required',
      'categoryId': 'Category is required',
      'stock': 'Stock is required',
      'price': 'Price is required'
    };
    return requiredTexts[fieldName] || 'This field is required';
  }

  private getFieldMinLengthText(fieldName: string, control: any): string {
    const minLength = control?.errors?.['minlength']?.requiredLength;
    const fieldNames: { [key: string]: string } = {
      'productCode': 'Product code',
      'sku': 'SKU'
    };
    const fieldNameText = fieldNames[fieldName] || fieldName;
    return `${fieldNameText} must be at least ${minLength} characters`;
  }

  private getFieldMaxLengthText(fieldName: string, control: any): string {
    const maxLength = control?.errors?.['maxlength']?.requiredLength;
    const fieldNames: { [key: string]: string } = {
      'productCode': 'Product code',
      'sku': 'SKU'
    };
    const fieldNameText = fieldNames[fieldName] || fieldName;
    return `${fieldNameText} must be no more than ${maxLength} characters`;
  }

  private getFieldFormatText(fieldName: string): string {
    const formatTexts: { [key: string]: string } = {
      'productCode': 'Only uppercase letters, numbers and dashes are allowed',
      'sku': 'SKU must contain only uppercase letters and numbers',
      'price': 'Price must be a valid Euro amount (e.g. 10.99)'
    };
    return formatTexts[fieldName] || 'Invalid format';
  }

  private getFieldMinValueText(fieldName: string, control: any): string {
    const minValue = control?.errors?.['min']?.min;
    const fieldNames: { [key: string]: string } = {
      'stock': 'Stock',
      'price': 'Price'
    };
    const fieldNameText = fieldNames[fieldName] || fieldName;
    return `${fieldNameText} must be ${minValue} or greater`;
  }

  private getFieldInvalidText(fieldName: string): string {
    const invalidTexts: { [key: string]: string } = {
      'name': 'Invalid product name',
      'productCode': 'Invalid product code format',
      'sku': 'Invalid SKU format',
      'categoryId': 'Invalid category',
      'stock': 'Invalid stock value',
      'price': 'Invalid price format'
    };
    return invalidTexts[fieldName] || 'Invalid value';
  }

  private getFieldValidText(fieldName: string): string {
    const validTexts: { [key: string]: string } = {
      'name': 'Product name is valid',
      'productCode': 'Product code is valid',
      'sku': 'SKU is valid',
      'categoryId': 'Category is valid',
      'stock': 'Stock is valid',
      'price': 'Price is valid'
    };
    return validTexts[fieldName] || 'Field is valid';
  }

  // Drag & drop methods
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
    
    const files = event.dataTransfer?.files;
    if (files) {
      this.handleDroppedFiles(files);
      this.analyticsService.trackFeatureUsage('image_drag_drop');
    }
  }

  private handleDroppedFiles(files: FileList): void {
    for (const file of files) {
      const totalImages = this.selectedFiles.length + this.existingImages.length;
      if (totalImages >= this.maxImages) break;
    
      if (['image/jpeg', 'image/png'].includes(file.type)) {
        this.selectedFiles.push(file);
        const reader = new FileReader();
        reader.onload = () => {
          this.imagePreviews.push(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
    this.updateFileInputState();
  }

  onImageSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    const files: FileList | null = target.files;

    if (!files || files.length === 0) return;

    this.analyticsService.trackFeatureUsage('image_upload');
    this.analyticsService.trackFormInteraction('product_form', 'image_selected', 'images');

    for (const file of files) {
      const totalImages = this.selectedFiles.length + this.existingImages.length;
      if (totalImages >= this.maxImages) break;
    
      if (['image/jpeg', 'image/png'].includes(file.type)) {
        this.selectedFiles.push(file);
        const reader = new FileReader();
        reader.onload = () => {
          this.imagePreviews.push(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }

    // Update input disabled state
    this.updateFileInputState();

    // Reset input to allow identical subsequent selections
    target.value = '';
  }

  updateFileInputState(): void {
    const total = this.selectedFiles.length + this.existingImages.length;
    this.isFileInputDisabled = total >= this.maxImages;
  }

  onSubmit(): void {
    if (this.productForm.invalid) return;

    this.saving = true; // Start saving loading state
    this.analyticsService.trackFormInteraction('product_form', 'submit', this.isEditMode ? 'edit' : 'create');

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
    localStorage.removeItem('product-description-draft');

    this.analyticsService.trackUserJourney('form_submitted_success', this.isEditMode ? 'edit_product' : 'add_product');

    setTimeout(() => {
      this.showToast = false;
      this.router.navigate(['/administration/view-products']);
    }, 3000); // Hide the toast after 3 seconds
  }

  // Keyboard shortcuts
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    // Ctrl+S to save
    if (event.ctrlKey && event.key === 's') {
      event.preventDefault();
      if (!this.productForm.invalid && !this.saving) {
        this.onSubmit();
      }
    }
    
    // Ctrl+P to toggle preview
    if (event.ctrlKey && event.key === 'p') {
      event.preventDefault();
      this.toggleDescriptionPreview();
    }
    
    // Ctrl+Shift+C to clear description
    if (event.ctrlKey && event.shiftKey && event.key === 'C') {
      event.preventDefault();
      this.clearDescription();
    }
    
    // Ctrl+Shift+T to apply template (first one)
    if (event.ctrlKey && event.shiftKey && event.key === 'T') {
      event.preventDefault();
      if (this.descriptionTemplates.length > 0) {
        this.applyTemplate(this.descriptionTemplates[0].template);
      }
    }
    
    // Escape to close preview
    if (event.key === 'Escape' && this.showDescriptionPreview) {
      this.toggleDescriptionPreview();
    }
  }

  // SKU Generation
  private setupSkuGeneration(): void {
    // Get form controls
    const nameControl = this.productForm.get('name');
    const categoryControl = this.productForm.get('categoryId');

    if (nameControl && categoryControl) {
      // Generate SKU when name changes
      const nameSubscription = nameControl.valueChanges.pipe(
        debounceTime(500), // Wait 500ms before generating SKU
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      ).subscribe(() => {
        this.generateSkuIfReady()
      });

      const categorySubscription = categoryControl.valueChanges.pipe(
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      ).subscribe(() => {
        this.generateSkuIfReady();
      });

      this.subscriptions.push(nameSubscription, categorySubscription);
    }
  }

  // Generate SKU if ready
  private generateSkuIfReady(): void {
    if (this.isEditMode || this.skuGenerationInProgress) {
      return;
    }

    const productName = this.productForm.get('name')?.value;
    const categoryId = this.productForm.get('categoryId')?.value;

    if (productName && productName.trim().length >= 3 && categoryId) {
      this.generateSku(categoryId, productName.trim());
    }
  }

  // Generate SKU
  private generateSku(categoryId: number, productName: string): void {
    this.skuGenerationInProgress = true;

    this.catalogService.generateSku(categoryId, productName).subscribe({
      next: (response) => {
        this.productForm.get('sku')?.setValue(response.sku);
        this.skuGenerationInProgress = false;
      },
      error: (error) => {
        console.error('Error generating SKU:', error);
        this.skuGenerationInProgress = false;
      }
    });
  }

  // Manually generate SKU
  manuallyGenerateSku(): void {
    const productName = this.productForm.get('name')?.value;
    const categoryId = this.productForm.get('categoryId')?.value;

    if (productName && categoryId) {
      this.generateSku(categoryId, productName.trim());
    }
  }

  // Check if SKU can be generated
  canGenerateSku(): boolean {
    const productName = this.productForm.get('name')?.value;
    const categoryId = this.productForm.get('categoryId')?.value;

    return !!(productName && productName.trim().length >= 3 && categoryId && !this.skuGenerationInProgress);
  }
}
