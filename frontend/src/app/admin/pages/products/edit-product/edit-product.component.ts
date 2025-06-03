import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Category } from '../../../../core/models/catalog.model';
import { ActivatedRoute, Router } from '@angular/router';
import { CatalogService } from '../../../services/catalog.service';
import { PageTitleService } from '../../../../core/services/page-title.service';

@Component({
  selector: 'app-edit-product',
  standalone: false,
  templateUrl: './edit-product.component.html',
  styleUrl: './edit-product.component.css'
})
export class EditProductComponent implements OnInit {
  showToast = false;
  productForm!: FormGroup;
  productId!: number;
  SelectedFiles: File[] = [];
  categories: Category[] = [];
  pageTitle: string = '';

  constructor(private route: ActivatedRoute, 
              private catalogService: CatalogService, 
              private fb: FormBuilder, 
              private router: Router, 
              private pageTitleService: PageTitleService) {}
 
  ngOnInit(): void {
   this.productId = +this.route.snapshot.paramMap.get('id')!;
   this.initForm();

   this.catalogService.getCategories().subscribe(data => {
    this.categories = data;
   });

   this.catalogService.getProductById(this.productId).subscribe(product => {
    this.productForm.patchValue({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      categoryId: product.categoryId,
    });

    const priceControl = this.productForm.get('price');
    const stockControl = this.productForm.get('stock');

    if (product.stock === 0 && priceControl) {
      priceControl.setValue(0);
      priceControl.disable();
    }

    stockControl?.valueChanges.subscribe((stock: number) => {
      if (priceControl) {
        if (stock === 0) {
          priceControl.setValue(0);
          priceControl.disable();
        } else {
          priceControl.enable();
        }
      }
    });
   });

    this.pageTitleService.pageTitle$.subscribe(title => {
    this.pageTitle = title;
   });
  }

  initForm() {
    this.productForm = this.fb.group({
      name: ['', Validators.required ],
      description: [''],
      price: [{ value: null, disabled: true }, [Validators.required, Validators.min(0), Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      stock: ['', [Validators.required, Validators.min(0)]],
      categoryId: [null, Validators.required]
    });
  }

  onFileSelected(event: any): void {
    this.SelectedFiles = Array.from(event.target.files);
  }

  onSubmit(): void {
    if (this.productForm.invalid) return;

    const formValue = { ...this.productForm.getRawValue() };

    const formData = new FormData();
    formData.append('Name', formValue.name);
    formData.append('Description', formValue.description);
    formData.append('Price', formValue.price.toString());
    formData.append('Stock', formValue.stock.toString());
    formData.append('CategoryId', formValue.categoryId.toString());

    for (let file of this.SelectedFiles) {
      formData.append('Images', file);
    }

    this.catalogService.updateProduct(this.productId, formData).subscribe({
      next: () => {
        this.showToast = true;

        setTimeout(() => {
          this.showToast = false;
          this.router.navigate(['/administration/view-products']);
        }, 3000) // Hide the toast after 3 seconds
        
      },
      error: (err) => {
        console.error('Error during update', err);
      } 
    });
  }

}
