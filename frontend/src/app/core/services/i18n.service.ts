import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type LanguageMessages = Record<string, string>;

export interface I18nConfig {
  defaultLanguage: string;
  supportedLanguages: string[];
  messages: Record<string, LanguageMessages>;
}

@Injectable({
  providedIn: 'root'
})
export class I18nService {
  private currentLanguageSubject = new BehaviorSubject<string>('en');
  public currentLanguage$ = this.currentLanguageSubject.asObservable();

  private config: I18nConfig = {
    defaultLanguage: 'en',
    supportedLanguages: ['en', 'it'],
    messages: {
      en: {
        // Form labels
        'product.name': 'Product Name',
        'product.description': 'Product Description',
        'product.code': 'Product Code',
        'product.sku': 'Product SKU',
        'product.category': 'Category',
        'product.stock': 'Stock',
        'product.price': 'Regular Price',
        'product.images': 'Product Gallery',

        // Help text
        'help.name': 'Enter a descriptive name for your product',
        'help.description': 'Enter a detailed description of your product...',
        'help.code': '16 characters, uppercase letters, numbers, and dashes only',
        'help.sku': '16 characters, uppercase letters and numbers only',
        'help.category': 'Choose the most appropriate category for your product',
        'help.stock': 'Enter the available quantity',
        'help.price': 'Enter the price in euros (e.g., 29.99)',
        'help.submit': 'All required fields must be completed before saving',

        // Validation messages
        'validation.required': 'This field is required',
        'validation.minLength': 'Must be at least {0} characters',
        'validation.maxLength': 'Must be no more than {0} characters',
        'validation.pattern': 'Invalid format',
        'validation.min': 'Value must be {0} or greater',
        'validation.description.required': 'Description is required',
        'validation.description.tooShort': 'Description is too short (minimum 10 characters)',
        'validation.description.nearLimit': 'Approaching character limit',
        'validation.description.overLimit': 'Exceeded character limit',
        'validation.description.good': 'Description length is good',

        // Status messages
        'status.empty': 'Description is required',
        'status.tooShort': 'Description is too short (minimum 10 characters)',
        'status.nearLimit': 'Approaching character limit',
        'status.overLimit': 'Exceeded character limit',
        'status.good': 'Description length is good',

        // Buttons
        'button.add': 'Add Product',
        'button.update': 'Update Product',
        'button.save': 'Save',
        'button.cancel': 'Cancel',
        'button.clear': 'Clear',
        'button.preview': 'Show Preview',
        'button.hidePreview': 'Hide Preview',
        'button.edit': 'Edit',

        // Templates
        'templates.title': 'Quick Templates',
        'templates.electronics': 'Electronics',
        'templates.clothing': 'Clothing',
        'templates.books': 'Books',
        'templates.homeGarden': 'Home & Garden',

        // Upload
        'upload.dragDrop': 'Drag & drop images here or click to select',
        'upload.supported': 'Supports JPG, PNG (max 8 images)',
        'upload.progress': 'Uploading images...',
        'upload.preview': 'Image Preview',

        // Success/Error messages
        'success.added': 'Product added successfully!',
        'success.updated': 'Product updated successfully!',
        'error.creation': 'Creation failed: {0}',
        'error.update': 'Update failed: {0}',

        // Suggestions
        'suggestions.title': 'Suggestions to improve your description:',
        'suggestions.moreDetails': 'Consider adding more details to make your description more comprehensive',
        'suggestions.keywords': 'Include relevant keywords to improve search visibility',
        'suggestions.readability': 'Consider simplifying the language for better readability',
        'suggestions.length': 'A longer description helps customers understand your product better',

        // Categories
        'category.select': 'Select a category',
        'category.electronics': 'Electronics',
        'category.clothing': 'Clothing',
        'category.books': 'Books',
        'category.homeGarden': 'Home & Garden',

        // Keyboard shortcuts
        'shortcuts.save': 'Ctrl+S to save',
        'shortcuts.preview': 'Ctrl+P to toggle preview',
        'shortcuts.clear': 'Ctrl+Shift+C to clear description',
        'shortcuts.template': 'Ctrl+Shift+T to apply template',
        'shortcuts.escape': 'Escape to close preview'
      },
      it: {
        // Form labels
        'product.name': 'Nome Prodotto',
        'product.description': 'Descrizione Prodotto',
        'product.code': 'Codice Prodotto',
        'product.sku': 'SKU Prodotto',
        'product.category': 'Categoria',
        'product.stock': 'Scorte',
        'product.price': 'Prezzo Regolare',
        'product.images': 'Galleria Prodotti',

        // Help text
        'help.name': 'Inserisci un nome descrittivo per il tuo prodotto',
        'help.description': 'Inserisci una descrizione dettagliata del tuo prodotto...',
        'help.code': '16 caratteri, lettere maiuscole, numeri e trattini',
        'help.sku': '16 caratteri, solo lettere maiuscole e numeri',
        'help.category': 'Scegli la categoria più appropriata per il tuo prodotto',
        'help.stock': 'Inserisci la quantità disponibile',
        'help.price': 'Inserisci il prezzo in euro (es. 29,99)',
        'help.submit': 'Tutti i campi obbligatori devono essere completati prima del salvataggio',

        // Validation messages
        'validation.required': 'Questo campo è obbligatorio',
        'validation.minLength': 'Deve essere di almeno {0} caratteri',
        'validation.maxLength': 'Non deve superare {0} caratteri',
        'validation.pattern': 'Formato non valido',
        'validation.min': 'Il valore deve essere {0} o maggiore',
        'validation.description.required': 'La descrizione è obbligatoria',
        'validation.description.tooShort': 'La descrizione è troppo corta (minimo 10 caratteri)',
        'validation.description.nearLimit': 'Avvicinandosi al limite di caratteri',
        'validation.description.overLimit': 'Superato il limite di caratteri',
        'validation.description.good': 'La lunghezza della descrizione è buona',

        // Status messages
        'status.empty': 'La descrizione è obbligatoria',
        'status.tooShort': 'La descrizione è troppo corta (minimo 10 caratteri)',
        'status.nearLimit': 'Avvicinandosi al limite di caratteri',
        'status.overLimit': 'Superato il limite di caratteri',
        'status.good': 'La lunghezza della descrizione è buona',

        // Buttons
        'button.add': 'Aggiungi Prodotto',
        'button.update': 'Aggiorna Prodotto',
        'button.save': 'Salva',
        'button.cancel': 'Annulla',
        'button.clear': 'Cancella',
        'button.preview': 'Mostra Anteprima',
        'button.hidePreview': 'Nascondi Anteprima',
        'button.edit': 'Modifica',

        // Templates
        'templates.title': 'Template Rapidi',
        'templates.electronics': 'Elettronica',
        'templates.clothing': 'Abbigliamento',
        'templates.books': 'Libri',
        'templates.homeGarden': 'Casa e Giardino',

        // Upload
        'upload.dragDrop': 'Trascina e rilascia le immagini qui o clicca per selezionare',
        'upload.supported': 'Supporta JPG, PNG (max 8 immagini)',
        'upload.progress': 'Caricamento immagini...',
        'upload.preview': 'Anteprima Immagini',

        // Success/Error messages
        'success.added': 'Prodotto aggiunto con successo!',
        'success.updated': 'Prodotto aggiornato con successo!',
        'error.creation': 'Creazione fallita: {0}',
        'error.update': 'Aggiornamento fallito: {0}',

        // Suggestions
        'suggestions.title': 'Suggerimenti per migliorare la tua descrizione:',
        'suggestions.moreDetails': 'Considera di aggiungere più dettagli per rendere la descrizione più completa',
        'suggestions.keywords': 'Includi parole chiave rilevanti per migliorare la visibilità nei motori di ricerca',
        'suggestions.readability': 'Considera di semplificare il linguaggio per una migliore leggibilità',
        'suggestions.length': 'Una descrizione più lunga aiuta i clienti a capire meglio il tuo prodotto',

        // Categories
        'category.select': 'Seleziona una categoria',
        'category.electronics': 'Elettronica',
        'category.clothing': 'Abbigliamento',
        'category.books': 'Libri',
        'category.homeGarden': 'Casa e Giardino',

        // Keyboard shortcuts
        'shortcuts.save': 'Ctrl+S per salvare',
        'shortcuts.preview': 'Ctrl+P per alternare l\'anteprima',
        'shortcuts.clear': 'Ctrl+Shift+C per cancellare la descrizione',
        'shortcuts.template': 'Ctrl+Shift+T per applicare il template',
        'shortcuts.escape': 'Escape per chiudere l\'anteprima'
      }
    }
  };

  constructor() {
    this.loadLanguagePreference();
  }

  private loadLanguagePreference(): void {
    const savedLanguage = localStorage.getItem('preferred_language');
    const browserLanguage = navigator.language.split('-')[0];
    
    let language = savedLanguage || browserLanguage;
    
    if (!this.config.supportedLanguages.includes(language)) {
      language = this.config.defaultLanguage;
    }
    
    this.setLanguage(language);
  }

  setLanguage(language: string): void {
    if (this.config.supportedLanguages.includes(language)) {
      this.currentLanguageSubject.next(language);
      localStorage.setItem('preferred_language', language);
      document.documentElement.lang = language;
    }
  }

  getCurrentLanguage(): string {
    return this.currentLanguageSubject.value;
  }

  getSupportedLanguages(): string[] {
    return this.config.supportedLanguages;
  }

  translate(key: string, params?: string[]): string {
    const currentLang = this.getCurrentLanguage();
    const messages = this.config.messages[currentLang] || this.config.messages[this.config.defaultLanguage];
    
    let message = messages[key] || key;
    
    if (params && params.length > 0) {
      params.forEach((param, index) => {
        message = message.replace(`{${index}}`, String(param));
      });
    }
    
    return message;
  }

  translateAsync(key: string, params?: string[]): Observable<string> {
    return new Observable(observer => {
      const translation = this.translate(key, params);
      observer.next(translation);
      observer.complete();
    });
  }

  getLanguageName(languageCode: string): string {
    const languageNames: Record<string, string> = {
      'en': 'English',
      'it': 'Italiano'
    };
    
    return languageNames[languageCode] || languageCode;
  }

  isRTL(language: string): boolean {
    // Add RTL languages here if needed
    const rtlLanguages = ['ar', 'he', 'fa'];
    return rtlLanguages.includes(language);
  }

  getDateFormat(language: string): string {
    const dateFormats: Record<string, string> = {
      'en': 'MM/DD/YYYY',
      'it': 'DD/MM/YYYY'
    };
    
    return dateFormats[language] || 'YYYY-MM-DD';
  }

  getNumberFormat(language: string): Intl.NumberFormat {
    const locales: Record<string, string> = {
      'en': 'en-US',
      'it': 'it-IT'
    };
    
    return new Intl.NumberFormat(locales[language] || 'en-US');
  }

  getCurrencyFormat(language: string): Intl.NumberFormat {
    const currencyFormats: Record<string, string> = {
      'en': 'en-US',
      'it': 'it-IT'
    };
    
    return new Intl.NumberFormat(currencyFormats[language] || 'en-US', {
      style: 'currency',
      currency: 'EUR'
    });
  }
} 