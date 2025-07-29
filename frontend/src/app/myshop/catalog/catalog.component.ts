import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-catalog',
  standalone: false,
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.css'
})
export class CatalogComponent implements OnInit {
  loading: boolean = true; // Proprietà per gestire lo stato di caricamento
  catalogData: any[] = []; // Dati del catalogo

  ngOnInit(): void {
    // Simula il caricamento dei dati dal database
    this.loading = true;
    
    // Simula una chiamata API
    setTimeout(() => {
      this.catalogData = [
        { id: 1, name: 'Prodotto 1', price: 29.99 },
        { id: 2, name: 'Prodotto 2', price: 39.99 },
        { id: 3, name: 'Prodotto 3', price: 49.99 }
      ];
      this.loading = false;
    }, 2000); // Simula 2 secondi di caricamento
  }
}
