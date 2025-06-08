import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-product-form',
  standalone: false,
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css'
})
export class ProductFormComponent implements OnInit {
  @Input() isUpdate = false;
  @Output() formSubmitted = new EventEmitter<FormData>();

  productForm!: FormGroup;
  selectedFiles: File[] = [];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
  
  }

}
