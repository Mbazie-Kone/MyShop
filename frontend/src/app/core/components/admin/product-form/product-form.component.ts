import { Component, Input, OnInit } from '@angular/core';
import { ProductFormData } from '../../../models/product-form-data.model';

@Component({
  selector: 'app-product-form',
  standalone: false,
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css'
})
export class ProductFormComponent implements OnInit {
  @Input() initialData?: ProductFormData;

  ngOnInit(): void {
    
  }

}
