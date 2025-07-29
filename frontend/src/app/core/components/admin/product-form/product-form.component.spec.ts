import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';

import { ProductFormComponent } from './product-form.component';
import { CatalogService } from '../../../../admin/services/catalog.service';
import { AnalyticsService } from '../../../services/analytics.service';
import { I18nService } from '../../../services/i18n.service';
import { SecurityService } from '../../../services/security.service';
import { SharedModule } from '../../../shared/shared.module';
import { Nl2brPipe } from '../../../shared/pipes/nl2br.pipe';

describe('ProductFormComponent', () => {
  let component: ProductFormComponent;
  let fixture: ComponentFixture<ProductFormComponent>;
  let catalogService: jasmine.SpyObj<CatalogService>;
  let analyticsService: jasmine.SpyObj<AnalyticsService>;
  let i18nService: jasmine.SpyObj<I18nService>;
  let securityService: jasmine.SpyObj<SecurityService>;

  const mockCategories = [
    { id: 1, name: 'Electronics' },
    { id: 2, name: 'Clothing' }
  ];

  const mockProduct = {
    id: 1,
    name: 'Test Product',
    description: 'Test description',
    stock: 10,
    price: 29.99,
    productCode: 'TEST-CODE-123456',
    sku: 'TESTSKU123456789',
    categoryId: 1,
    images: []
  };

  beforeEach(async () => {
    const catalogServiceSpy = jasmine.createSpyObj('CatalogService', [
      'getCategories', 'getProductById', 'createProduct', 'updateProduct'
    ]);
    const analyticsServiceSpy = jasmine.createSpyObj('AnalyticsService', [
      'trackPageView', 'trackFeatureUsage', 'trackFormInteraction'
    ]);
    const i18nServiceSpy = jasmine.createSpyObj('I18nService', ['translate']);
    const securityServiceSpy = jasmine.createSpyObj('SecurityService', ['validateFile']);

    await TestBed.configureTestingModule({
      declarations: [ProductFormComponent],
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        SharedModule,
        Nl2brPipe
      ],
      providers: [
        { provide: CatalogService, useValue: catalogServiceSpy },
        { provide: AnalyticsService, useValue: analyticsServiceSpy },
        { provide: I18nService, useValue: i18nServiceSpy },
        { provide: SecurityService, useValue: securityServiceSpy }
      ]
    }).compileComponents();

    catalogService = TestBed.inject(CatalogService) as jasmine.SpyObj<CatalogService>;
    analyticsService = TestBed.inject(AnalyticsService) as jasmine.SpyObj<AnalyticsService>;
    i18nService = TestBed.inject(I18nService) as jasmine.SpyObj<I18nService>;
    securityService = TestBed.inject(SecurityService) as jasmine.SpyObj<SecurityService>;

    // Setup default spy returns
    catalogService.getCategories.and.returnValue(of(mockCategories));
    catalogService.getProductById.and.returnValue(of(mockProduct));
    catalogService.createProduct.and.returnValue(of({}));
    catalogService.updateProduct.and.returnValue(of({}));
    i18nService.translate.and.returnValue('Translated text');
    securityService.validateFile.and.returnValue({ isValid: true });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductFormComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    fixture.detectChanges();
    
    expect(component.productForm).toBeDefined();
    expect(component.productForm.get('name')?.value).toBe('');
    expect(component.productForm.get('description')?.value).toBe('');
    expect(component.productForm.get('stock')?.value).toBe(0);
    expect(component.productForm.get('price')?.value).toBe(0);
    expect(component.productForm.get('price')?.disabled).toBe(true);
  });

  it('should load categories on init', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    expect(catalogService.getCategories).toHaveBeenCalled();
    expect(component.categories).toEqual(mockCategories);
    expect(component.loading).toBe(false);
  }));

  it('should track page view on init', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    expect(analyticsService.trackPageView).toHaveBeenCalledWith('add-product');
  }));

  it('should enable price field when stock is greater than 0', () => {
    fixture.detectChanges();
    
    const stockControl = component.productForm.get('stock');
    const priceControl = component.productForm.get('price');
    
    stockControl?.setValue(5);
    
    expect(priceControl?.enabled).toBe(true);
  });

  it('should disable price field when stock is 0', () => {
    fixture.detectChanges();
    
    const stockControl = component.productForm.get('stock');
    const priceControl = component.productForm.get('price');
    
    stockControl?.setValue(0);
    
    expect(priceControl?.disabled).toBe(true);
    expect(priceControl?.value).toBe(0);
  });

  it('should validate description length correctly', () => {
    fixture.detectChanges();
    
    const descriptionControl = component.productForm.get('description');
    
    // Test minimum length
    descriptionControl?.setValue('Short');
    expect(descriptionControl?.errors?.['minlength']).toBeTruthy();
    
    // Test maximum length
    const longDescription = 'a'.repeat(2001);
    descriptionControl?.setValue(longDescription);
    expect(descriptionControl?.errors?.['maxlength']).toBeTruthy();
    
    // Test valid length
    descriptionControl?.setValue('This is a valid description with more than 10 characters');
    expect(descriptionControl?.errors).toBeNull();
  });

  it('should update description length on input', fakeAsync(() => {
    fixture.detectChanges();
    
    const testDescription = 'Test description';
    component.onDescriptionInput({ target: { value: testDescription } });
    tick(300); // Wait for debounce
    
    expect(component.descriptionLength).toBe(testDescription.length);
  }));

  it('should clear description correctly', () => {
    fixture.detectChanges();
    
    const descriptionControl = component.productForm.get('description');
    descriptionControl?.setValue('Test description');
    component.descriptionLength = 18;
    component.suggestions = ['Test suggestion'];
    
    component.clearDescription();
    
    expect(descriptionControl?.value).toBe('');
    expect(component.descriptionLength).toBe(0);
    expect(component.suggestions).toEqual([]);
    expect(analyticsService.trackFeatureUsage).toHaveBeenCalledWith('description_clear', 'form', 'cleared');
  });

  it('should toggle description preview', () => {
    fixture.detectChanges();
    
    expect(component.showDescriptionPreview).toBe(false);
    
    component.toggleDescriptionPreview();
    expect(component.showDescriptionPreview).toBe(true);
    expect(analyticsService.trackFeatureUsage).toHaveBeenCalledWith('description_preview', 'form', 'enabled');
    
    component.toggleDescriptionPreview();
    expect(component.showDescriptionPreview).toBe(false);
    expect(analyticsService.trackFeatureUsage).toHaveBeenCalledWith('description_preview', 'form', 'disabled');
  });

  it('should apply template correctly', fakeAsync(() => {
    fixture.detectChanges();
    
    const template = 'This is a test template';
    component.applyTemplate(template);
    tick(500); // Wait for validation
    
    expect(component.productForm.get('description')?.value).toBe(template);
    expect(component.descriptionLength).toBe(template.length);
    expect(analyticsService.trackFeatureUsage).toHaveBeenCalledWith('description_template', 'form', 'applied');
  }));

  it('should get correct description status', () => {
    fixture.detectChanges();
    
    // Test empty status
    component.descriptionLength = 0;
    expect(component.getDescriptionStatus()).toBe('empty');
    
    // Test too short status
    component.descriptionLength = 5;
    expect(component.getDescriptionStatus()).toBe('too-short');
    
    // Test good status
    component.descriptionLength = 100;
    expect(component.getDescriptionStatus()).toBe('good');
    
    // Test near limit status
    component.descriptionLength = 1900;
    expect(component.getDescriptionStatus()).toBe('near-limit');
    
    // Test over limit status
    component.descriptionLength = 2001;
    expect(component.getDescriptionStatus()).toBe('over-limit');
  });

  it('should get correct status class', () => {
    fixture.detectChanges();
    
    component.descriptionLength = 0;
    expect(component.getDescriptionStatusClass()).toBe('text-muted');
    
    component.descriptionLength = 5;
    expect(component.getDescriptionStatusClass()).toBe('text-warning');
    
    component.descriptionLength = 100;
    expect(component.getDescriptionStatusClass()).toBe('text-success');
    
    component.descriptionLength = 2001;
    expect(component.getDescriptionStatusClass()).toBe('text-danger');
  });

  it('should handle drag and drop events', () => {
    fixture.detectChanges();
    
    const mockEvent = {
      preventDefault: jasmine.createSpy('preventDefault'),
      stopPropagation: jasmine.createSpy('stopPropagation'),
      dataTransfer: {
        files: [
          new File([''], 'test.jpg', { type: 'image/jpeg' })
        ]
      }
    } as any;
    
    component.onDragOver(mockEvent);
    expect(component.isDragOver).toBe(true);
    expect(mockEvent.preventDefault).toHaveBeenCalled();
    
    component.onDragLeave(mockEvent);
    expect(component.isDragOver).toBe(false);
    
    component.onDrop(mockEvent);
    expect(component.isDragOver).toBe(false);
  });

  it('should handle file selection', fakeAsync(() => {
    fixture.detectChanges();
    
    const mockFile = new File([''], 'test.jpg', { type: 'image/jpeg' });
    const mockEvent = {
      target: {
        files: [mockFile]
      }
    };
    
    component.onImageSelected(mockEvent);
    tick(1000); // Wait for upload simulation
    
    expect(component.selectedFiles.length).toBe(1);
    expect(component.imagePreviews.length).toBe(1);
    expect(component.isUploading).toBe(false);
  }));

  it('should remove selected image', () => {
    fixture.detectChanges();
    
    component.selectedFiles = [new File([''], 'test.jpg', { type: 'image/jpeg' })];
    component.imagePreviews = ['data:image/jpeg;base64,test'];
    
    component.removeSelectedImage(0);
    
    expect(component.selectedFiles.length).toBe(0);
    expect(component.imagePreviews.length).toBe(0);
  });

  it('should remove existing image', () => {
    fixture.detectChanges();
    
    component.existingImages = [{ id: 1, url: 'test.jpg' }];
    
    component.removeExistingImage(1);
    
    expect(component.existingImages.length).toBe(0);
    expect(component.deletedImageIds).toContain(1);
  });

  it('should submit form successfully for new product', fakeAsync(() => {
    fixture.detectChanges();
    
    // Fill form with valid data
    component.productForm.patchValue({
      name: 'Test Product',
      description: 'Test description with more than 10 characters',
      stock: 10,
      price: 29.99,
      productCode: 'TEST-CODE-123456',
      sku: 'TESTSKU123456789',
      categoryId: 1
    });
    
    component.onSubmit();
    tick();
    
    expect(catalogService.createProduct).toHaveBeenCalled();
    expect(analyticsService.trackFormInteraction).toHaveBeenCalledWith('product_form', 'submitted');
    expect(component.saving).toBe(false);
  }));

  it('should submit form successfully for existing product', fakeAsync(() => {
    fixture.detectChanges();
    
    // Set edit mode
    component.isEditMode = true;
    component.productId = 1;
    
    // Fill form with valid data
    component.productForm.patchValue({
      name: 'Test Product',
      description: 'Test description with more than 10 characters',
      stock: 10,
      price: 29.99,
      productCode: 'TEST-CODE-123456',
      sku: 'TESTSKU123456789',
      categoryId: 1
    });
    
    component.onSubmit();
    tick();
    
    expect(catalogService.updateProduct).toHaveBeenCalled();
    expect(component.saving).toBe(false);
  }));

  it('should not submit invalid form', () => {
    fixture.detectChanges();
    
    // Leave form empty (invalid)
    component.onSubmit();
    
    expect(catalogService.createProduct).not.toHaveBeenCalled();
    expect(catalogService.updateProduct).not.toHaveBeenCalled();
  });

  it('should handle keyboard shortcuts', () => {
    fixture.detectChanges();
    
    // Test Ctrl+S
    const saveEvent = new KeyboardEvent('keydown', { ctrlKey: true, key: 's' });
    spyOn(component, 'onSubmit');
    component.handleKeyboardEvent(saveEvent);
    expect(component.onSubmit).toHaveBeenCalled();
    
    // Test Ctrl+P
    const previewEvent = new KeyboardEvent('keydown', { ctrlKey: true, key: 'p' });
    spyOn(component, 'toggleDescriptionPreview');
    component.handleKeyboardEvent(previewEvent);
    expect(component.toggleDescriptionPreview).toHaveBeenCalled();
  });

  it('should not trigger shortcuts when typing in form fields', () => {
    fixture.detectChanges();
    
    const mockInputElement = document.createElement('input');
    const event = new KeyboardEvent('keydown', { ctrlKey: true, key: 's' });
    Object.defineProperty(event, 'target', { value: mockInputElement });
    
    spyOn(component, 'onSubmit');
    component.handleKeyboardEvent(event);
    expect(component.onSubmit).not.toHaveBeenCalled();
  });

  it('should validate description quality', fakeAsync(() => {
    fixture.detectChanges();
    
    // Test with short description
    component.validateDescriptionQuality('Short text');
    tick(500);
    expect(component.suggestions.length).toBeGreaterThan(0);
    
    // Test with good description
    component.validateDescriptionQuality('This is a comprehensive description with many words and good keywords like quality and excellent features');
    tick(500);
    expect(component.suggestions.length).toBe(0);
  }));

  it('should auto-save description', fakeAsync(() => {
    fixture.detectChanges();
    
    const testDescription = 'Test description for auto-save';
    component.productForm.get('description')?.setValue(testDescription);
    
    // Trigger auto-save
    component['autoSaveDescription']();
    
    const savedDraft = localStorage.getItem('product-description-draft');
    expect(savedDraft).toBe(testDescription);
  }));

  it('should load draft description', () => {
    fixture.detectChanges();
    
    const testDraft = 'Saved draft description';
    localStorage.setItem('product-description-draft', testDraft);
    
    component['loadDraftDescription']();
    
    expect(component.productForm.get('description')?.value).toBe(testDraft);
    expect(component.descriptionLength).toBe(testDraft.length);
  });

  it('should cleanup on destroy', () => {
    fixture.detectChanges();
    
    // Add some subscriptions
    component['subscriptions'] = [
      { unsubscribe: jasmine.createSpy('unsubscribe') } as any
    ];
    
    // Set up auto-save interval
    component['autoSaveInterval'] = setInterval(() => {}, 1000);
    
    component.ngOnDestroy();
    
    expect(component['subscriptions'][0].unsubscribe).toHaveBeenCalled();
    // Note: We can't easily test clearInterval in this environment
  });

  it('should handle service errors gracefully', fakeAsync(() => {
    catalogService.getCategories.and.returnValue(throwError(() => new Error('Network error')));
    
    fixture.detectChanges();
    tick();
    
    expect(component.loading).toBe(false);
  }));

  it('should handle product loading errors', fakeAsync(() => {
    catalogService.getProductById.and.returnValue(throwError(() => new Error('Product not found')));
    
    // Set edit mode
    component.isEditMode = true;
    component.productId = 1;
    
    fixture.detectChanges();
    tick();
    
    expect(component.loading).toBe(false);
  }));
}); 