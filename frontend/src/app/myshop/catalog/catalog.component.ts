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
    
    // Simula una chiamata API (qui dovresti chiamare il tuo service reale)
    // this.catalogService.getProducts().subscribe({
    //   next: (data) => {
    //     this.catalogData = data;
    //     this.loading = false;
    //   },
    //   error: (error) => {
    //     console.error('Error loading catalog:', error);
    //     this.loading = false;
    //   }
    // });

    // Per ora usiamo dati di esempio
    setTimeout(() => {
      this.catalogData = [
        { id: 1, name: 'Prodotto 1', price: 29.99 },
        { id: 2, name: 'Prodotto 2', price: 39.99 },
        { id: 3, name: 'Prodotto 3', price: 49.99 }
      ];
      this.loading = false;
    }, 1000); // Simula 1 secondo di caricamento
  }
}
