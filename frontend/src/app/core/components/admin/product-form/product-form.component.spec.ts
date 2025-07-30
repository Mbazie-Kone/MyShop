import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { ProductFormComponent } from './product-form.component';
import { CatalogService } from '../../../../admin/services/catalog.service';
import { AnalyticsService } from '../../../services/analytics.service';
import { SharedModule } from '../../../../shared/shared.module';
import { Nl2brPipe } from '../../../../shared/pipes/nl2br.pipe';

describe('ProductFormComponent', () => {
  let component: ProductFormComponent;
  let fixture: ComponentFixture<ProductFormComponent>;
  let catalogService: jasmine.SpyObj<CatalogService>;
  let analyticsService: jasmine.SpyObj<AnalyticsService>;

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
      'trackUserJourney', 'trackFormInteraction', 'trackFeatureUsage'
    ]);

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
        { provide: AnalyticsService, useValue: analyticsServiceSpy }
      ]
    }).compileComponents();

    catalogService = TestBed.inject(CatalogService) as jasmine.SpyObj<CatalogService>;
    analyticsService = TestBed.inject(AnalyticsService) as jasmine.SpyObj<AnalyticsService>;
  });

  beforeEach(() => {
    catalogService.getCategories.and.returnValue(of(mockCategories));
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
  });

  it('should load categories on init', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    expect(catalogService.getCategories).toHaveBeenCalled();
    expect(component.categories).toEqual(mockCategories);
    expect(analyticsService.trackUserJourney).toHaveBeenCalledWith('form_opened', 'add_product');
  }));

  it('should load product data in edit mode', fakeAsync(() => {
    spyOn(component['route'].paramMap, 'subscribe').and.callFake((callback) => {
      callback({ get: () => '1' });
    });

    catalogService.getProductById.and.returnValue(of(mockProduct));
    component.isEditMode = true;
    component.productId = 1;

    fixture.detectChanges();
    tick();

    expect(catalogService.getProductById).toHaveBeenCalledWith(1);
    expect(component.productForm.get('name')?.value).toBe('Test Product');
    expect(component.productForm.get('description')?.value).toBe('Test description');
  }));

  it('should validate description length correctly', () => {
    fixture.detectChanges();

    const descriptionControl = component.productForm.get('description');
    
    // Test minimum length
    descriptionControl?.setValue('Short');
    expect(component.getDescriptionStatus()).toBe('too-short');
    
    // Test maximum length
    const longDescription = 'a'.repeat(2001);
    descriptionControl?.setValue(longDescription);
    expect(component.getDescriptionStatus()).toBe('over-limit');
    
    // Test good length
    const goodDescription = 'This is a good description with more than 10 characters';
    descriptionControl?.setValue(goodDescription);
    expect(component.getDescriptionStatus()).toBe('good');
  });

  it('should apply template correctly', () => {
    fixture.detectChanges();
    
    const template = 'This is a test template';
    component.applyTemplate(template);
    
    expect(component.productForm.get('description')?.value).toBe(template);
    expect(component.descriptionLength).toBe(template.length);
    expect(analyticsService.trackFeatureUsage).toHaveBeenCalledWith('description_template_applied');
  });

  it('should clear description correctly', () => {
    fixture.detectChanges();
    
    component.productForm.get('description')?.setValue('Some description');
    component.clearDescription();
    
    expect(component.productForm.get('description')?.value).toBe('');
    expect(component.descriptionLength).toBe(0);
    expect(component.suggestions).toEqual([]);
    expect(analyticsService.trackFeatureUsage).toHaveBeenCalledWith('description_clear');
  });

  it('should toggle description preview', () => {
    fixture.detectChanges();
    
    expect(component.showDescriptionPreview).toBe(false);
    
    component.toggleDescriptionPreview();
    expect(component.showDescriptionPreview).toBe(true);
    expect(analyticsService.trackFeatureUsage).toHaveBeenCalledWith('description_preview_show');
    
    component.toggleDescriptionPreview();
    expect(component.showDescriptionPreview).toBe(false);
    expect(analyticsService.trackFeatureUsage).toHaveBeenCalledWith('description_preview_hide');
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
    } as DragEvent;

    component.onDragOver(mockEvent);
    expect(component.isDragOver).toBe(true);
    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(mockEvent.stopPropagation).toHaveBeenCalled();

    component.onDragLeave(mockEvent);
    expect(component.isDragOver).toBe(false);

    component.onDrop(mockEvent);
    expect(component.isDragOver).toBe(false);
    expect(analyticsService.trackFeatureUsage).toHaveBeenCalledWith('image_drag_drop');
  });

  it('should handle image selection', fakeAsync(() => {
    fixture.detectChanges();
    
    const mockFile = new File([''], 'test.jpg', { type: 'image/jpeg' });
    const mockEvent = {
      target: {
        files: [mockFile]
      }
    };

    component.onImageSelected(mockEvent);
    
    expect(component.isUploading).toBe(true);
    expect(component.uploadProgress).toBe(0);
    expect(analyticsService.trackFeatureUsage).toHaveBeenCalledWith('image_upload');
    expect(analyticsService.trackFormInteraction).toHaveBeenCalledWith('product_form', 'image_selected', 'images');

    tick(1000); // Wait for upload simulation
    expect(component.isUploading).toBe(false);
    expect(component.uploadProgress).toBe(0);
  }));

  it('should validate form correctly', () => {
    fixture.detectChanges();
    
    const form = component.productForm;
    
    // Initially invalid
    expect(form.valid).toBe(false);
    
    // Set valid values
    form.patchValue({
      name: 'Test Product',
      description: 'This is a valid description with more than 10 characters',
      stock: 10,
      price: 29.99,
      productCode: 'TEST-CODE-123456',
      sku: 'TESTSKU123456789',
      categoryId: 1
    });
    
    expect(form.valid).toBe(true);
  });

  it('should handle form submission successfully', fakeAsync(() => {
    fixture.detectChanges();
    
    // Set valid form data
    component.productForm.patchValue({
      name: 'Test Product',
      description: 'Valid description',
      stock: 10,
      price: 29.99,
      productCode: 'TEST-CODE-123456',
      sku: 'TESTSKU123456789',
      categoryId: 1
    });

    catalogService.createProduct.and.returnValue(of({}));
    
    component.onSubmit();
    
    expect(component.saving).toBe(true);
    expect(analyticsService.trackFormInteraction).toHaveBeenCalledWith('product_form', 'submit', 'create');
    
    tick();
    
    expect(catalogService.createProduct).toHaveBeenCalled();
    expect(component.saving).toBe(false);
    expect(analyticsService.trackUserJourney).toHaveBeenCalledWith('form_submitted_success', 'add_product');
  }));

  it('should handle form submission error', fakeAsync(() => {
    fixture.detectChanges();
    
    // Set valid form data
    component.productForm.patchValue({
      name: 'Test Product',
      description: 'Valid description',
      stock: 10,
      price: 29.99,
      productCode: 'TEST-CODE-123456',
      sku: 'TESTSKU123456789',
      categoryId: 1
    });

    const error = new Error('Creation failed');
    catalogService.createProduct.and.returnValue(throwError(() => error));
    
    spyOn(window, 'alert');
    
    component.onSubmit();
    
    tick();
    
    expect(catalogService.createProduct).toHaveBeenCalled();
    expect(component.saving).toBe(false);
    expect(window.alert).toHaveBeenCalledWith('Creation failed: Creation failed');
  }));

  it('should provide correct status text', () => {
    fixture.detectChanges();
    
    expect(component.getDescriptionStatusText()).toBe('Description is required');
    
    component.productForm.get('description')?.setValue('Short');
    expect(component.getDescriptionStatusText()).toBe('Description is too short (minimum 10 characters)');
    
    const longDescription = 'a'.repeat(2001);
    component.productForm.get('description')?.setValue(longDescription);
    expect(component.getDescriptionStatusText()).toBe('Exceeded character limit');
  });

  it('should provide correct status class', () => {
    fixture.detectChanges();
    
    expect(component.getDescriptionStatusClass()).toBe('text-muted');
    
    component.productForm.get('description')?.setValue('Short');
    expect(component.getDescriptionStatusClass()).toBe('text-warning');
    
    const goodDescription = 'This is a good description with more than 10 characters';
    component.productForm.get('description')?.setValue(goodDescription);
    expect(component.getDescriptionStatusClass()).toBe('text-success');
  });

  it('should validate description quality and provide suggestions', fakeAsync(() => {
    fixture.detectChanges();
    
    // Test with short description
    component.productForm.get('description')?.setValue('Short description');
    tick(500); // Wait for debounce
    
    expect(component.suggestions.length).toBeGreaterThan(0);
    expect(component.suggestions.some(s => s.includes('more details'))).toBe(true);
  }));

  it('should handle keyboard shortcuts', () => {
    fixture.detectChanges();
    
    // Test Ctrl+P for preview toggle
    const ctrlPEvent = new KeyboardEvent('keydown', {
      ctrlKey: true,
      key: 'p'
    });
    
    spyOn(ctrlPEvent, 'preventDefault');
    component.handleKeyboardEvent(ctrlPEvent);
    
    expect(ctrlPEvent.preventDefault).toHaveBeenCalled();
    expect(component.showDescriptionPreview).toBe(true);
  });

  it('should auto-save description', fakeAsync(() => {
    fixture.detectChanges();
    
    const description = 'Test description for auto-save';
    component.productForm.get('description')?.setValue(description);
    
    // Trigger auto-save
    component['autoSaveDescription']();
    
    const saved = localStorage.getItem('product-description-draft');
    expect(saved).toBe(description);
  }));

  it('should load draft description on init', () => {
    const draftDescription = 'Draft description';
    localStorage.setItem('product-description-draft', draftDescription);
    
    spyOn(component['route'].paramMap, 'subscribe').and.callFake((callback) => {
      callback({ get: () => null }); // No product ID = add mode
    });
    
    fixture.detectChanges();
    
    expect(component.productForm.get('description')?.value).toBe(draftDescription);
    expect(component.descriptionLength).toBe(draftDescription.length);
  });

  it('should clean up resources on destroy', () => {
    fixture.detectChanges();
    
    spyOn(component['destroy$'], 'next');
    spyOn(component['destroy$'], 'complete');
    spyOn(component, 'clearAutoSave');
    
    component.ngOnDestroy();
    
    expect(component['destroy$'].next).toHaveBeenCalled();
    expect(component['destroy$'].complete).toHaveBeenCalled();
    expect(component.clearAutoSave).toHaveBeenCalled();
  });
}); 