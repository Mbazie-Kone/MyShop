import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-products',
  standalone: false,
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {
  productForm!: FormGroup;
  selectedFiles: File[] = [];
  categories: any[] = [];

  constructor(private fb: FormBuilder, private http: HttpClient) {}
  
  ngOnInit() {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      price: [0, Validators.required],
      stock: [0, Validators.required],
      isAvailable: [true],
      categoryId: [null, Validators.required]
    });

    /*
    this.http.get<any[]>('http://localhost:5000/api/catalog/categories')
      .subscribe(res => this.categories = res);
    */
  }

  onFileSelected(event: any) {
    this.selectedFiles = Array.from(event.target.files);
  }

  onSubmit() {
    const formData = new FormData();
    Object.entries(this.productForm.value).forEach(([key, value]) => {
      formData.append(key, value as string);
    });
    this.selectedFiles.forEach(file => {
      formData.append('Images', file);
    })

    /*
    this.http.post('http://localhost:5000/api/catalog/add-product', formData)
      .subscribe(() => alert("Product added!"));
    */
  }

}
