import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Category } from '../../../models/catalog.model';
import { ActivatedRoute, Router } from '@angular/router';
import { CatalogService } from '../../../../admin/services/catalog.service';
import { AnalyticsService } from '../../../services/analytics.service';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-product-form',
  standalone: false,
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

  // Auto-save properties
  private autoSaveInterval: any;
  private descriptionChanges$ = new Subject<string>();
  private subscriptions: Subscription[] = [];

  // Upload progress
  uploadProgress: number = 0;
  isUploading: boolean = false;

  // Drag & drop
  isDragOver: boolean = false;

  // Suggestions
  suggestions: string[] = [];

  // Templates
  descriptionTemplates = [
    { name: 'Electronics', template: 'This high-quality electronic device features advanced technology and innovative design. Perfect for modern users who demand reliability and performance.' },
    { name: 'Clothing', template: 'Made from premium materials, this garment offers exceptional comfort and style. Designed with attention to detail for the fashion-conscious individual.' },
    { name: 'Books', template: 'This engaging book provides readers with valuable insights and knowledge. Written by experts in the field, it offers comprehensive coverage of the subject matter.' },
    { name: 'Home & Garden', template: 'Transform your living space with this beautifully crafted home accessory. Combining functionality with elegant design, it enhances any room decor.' }
  ];

  constructor(
    private fb: FormBuilder, 
    private route: ActivatedRoute, 
    private router: Router, 
    private catalogService: CatalogService,
    private analyticsService: AnalyticsService
  ) {}

  ngOnInit(): void {
    // Track page view
    this.analyticsService.trackPageView(this.isEditMode ? 'edit-product' : 'add-product');

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
    this.setupSmartValidation();

    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.isEditMode = true;
        this.productId = +idParam;
        this.loadProduct(this.productId);
      } else {
        this.loading = false; // No product to load, categories will be loaded
        this.loadDraftDescription();
      }
    });

    // Monitor description changes for character count with debounce
    const descriptionSubscription = this.descriptionChanges$.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(value => {
      this.descriptionLength = value ? value.length : 0;
      this.validateDescriptionQuality(value);
    });

    this.subscriptions.push(descriptionSubscription);

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

  ngOnDestroy(): void {
    // Cleanup subscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());
    
    // Clear auto-save interval
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
    }
  }

  // Auto-save functionality
  private setupAutoSave(): void {
    this.autoSaveInterval = setInterval(() => {
      this.autoSaveDescription();
    }, 30000); // Auto-save every 30 seconds
  }

  private autoSaveDescription(): void {
    const description = this.productForm.get('description')?.value;
    if (description && description.length > 0) {
      localStorage.setItem('product-description-draft', description);
      console.log('Description auto-saved');
    }
  }

  private loadDraftDescription(): void {
    const draft = localStorage.getItem('product-description-draft');
    if (draft) {
      this.productForm.get('description')?.setValue(draft);
      this.descriptionLength = draft.length;
    }
  }

  // Smart validation
  private setupSmartValidation(): void {
    const validationSubscription = this.productForm.get('description')?.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(value => {
      this.validateDescriptionQuality(value);
    });

    if (validationSubscription) {
      this.subscriptions.push(validationSubscription);
    }
  }

  private validateDescriptionQuality(text: string): void {
    if (!text) {
      this.suggestions = [];
      return;
    }

    const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
    const hasKeywords = this.checkForKeywords(text);
    const readability = this.calculateReadability(text);
    
    this.suggestions = [];
    
    if (wordCount < 20) {
      this.suggestions.push('Consider adding more details to make your description more comprehensive');
    }
    if (!hasKeywords) {
      this.suggestions.push('Include relevant keywords to improve search visibility');
    }
    if (readability < 0.6) {
      this.suggestions.push('Consider simplifying the language for better readability');
    }
    if (text.length < 100) {
      this.suggestions.push('A longer description (100+ characters) typically performs better');
    }
  }

  private checkForKeywords(text: string): boolean {
    const commonKeywords = ['quality', 'premium', 'best', 'excellent', 'perfect', 'amazing', 'great'];
    return commonKeywords.some(keyword => text.toLowerCase().includes(keyword));
  }

  private calculateReadability(text: string): number {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = text.split(/\s+/).filter(w => w.length > 0);
    const syllables = this.countSyllables(text);
    
    if (sentences.length === 0 || words.length === 0) return 0;
    
    // Flesch Reading Ease formula
    const fleschScore = 206.835 - (1.015 * (words.length / sentences.length)) - (84.6 * (syllables / words.length));
    return Math.max(0, Math.min(1, fleschScore / 100));
  }

  private countSyllables(text: string): number {
    const words = text.toLowerCase().split(/\s+/);
    return words.reduce((count, word) => {
      return count + this.countWordSyllables(word);
    }, 0);
  }

  private countWordSyllables(word: string): number {
    word = word.toLowerCase();
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
    word = word.replace(/^y/, '');
    const matches = word.match(/[aeiouy]{1,2}/g);
    return matches ? matches.length : 1;
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
    this.descriptionChanges$.next(value);
  }

  clearDescription(): void {
    this.productForm.get('description')?.setValue('');
    this.descriptionLength = 0;
    this.suggestions = [];
    localStorage.removeItem('product-description-draft');
    this.analyticsService.trackFeatureUsage('description_clear', 'form', 'cleared');
  }

  toggleDescriptionPreview(): void {
    this.showDescriptionPreview = !this.showDescriptionPreview;
    this.analyticsService.trackFeatureUsage('description_preview', 'form', this.showDescriptionPreview ? 'enabled' : 'disabled');
  }

  // Template methods
  applyTemplate(template: string): void {
    this.productForm.get('description')?.setValue(template);
    this.descriptionLength = template.length;
    this.validateDescriptionQuality(template);
    this.analyticsService.trackFeatureUsage('description_template', 'form', 'applied');
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
    }
  }

  private handleDroppedFiles(files: FileList): void {
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
    this.updateFileInputState();
  }

  onImageSelected(event: any): void {
    const files: FileList = event.target.files;

    if (!files || files.length === 0) return;

    this.isUploading = true;
    this.uploadProgress = 0;

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

    // Simulate upload progress
    const interval = setInterval(() => {
      this.uploadProgress += 10;
      if (this.uploadProgress >= 100) {
        clearInterval(interval);
        this.isUploading = false;
        this.uploadProgress = 0;
      }
    }, 100);

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
    this.analyticsService.trackFormInteraction('product_form', 'submitted');

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
    this.suggestions = [];
    localStorage.removeItem('product-description-draft');

    setTimeout(() => {
      this.showToast = false;
      this.router.navigate(['/administration/view-products']);
    }, 3000); // Hide the toast after 3 seconds
  }

  // Keyboard shortcuts
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    // Prevent shortcuts when typing in form fields
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
      return;
    }

    if (event.ctrlKey && event.key === 's') {
      event.preventDefault();
      this.onSubmit();
    }
    if (event.ctrlKey && event.key === 'p') {
      event.preventDefault();
      this.toggleDescriptionPreview();
    }
  }

}
