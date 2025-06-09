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

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private catalogService: CatalogService) {}

  ngOnInit(): void {
  
  }

}
