import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface LanguageMessages {
  [key: string]: {
    [key: string]: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class I18nService {
  private currentLanguage = new BehaviorSubject<string>('en');
  private messages: LanguageMessages = {
    en: {
      // Product Form
      'product.name': 'Product Name',
      'product.name.help': 'Enter a descriptive name for your product',
      'product.name.required': 'Product name is required',
      'product.description': 'Product Description',
      'product.description.help': 'Enter a detailed description of your product...',
      'product.description.required': 'Description is required',
      'product.description.too_short': 'Description is too short (minimum 10 characters)',
      'product.description.near_limit': 'Approaching character limit',
      'product.description.over_limit': 'Exceeded character limit',
      'product.description.good': 'Description length is good',
      'product.description.empty': 'Description is required',
      'product.code': 'Product Code',
      'product.code.required': 'Product code is required',
      'product.code.min_length': 'Must be at least 16 characters',
      'product.code.max_length': 'Must be no more than 16 characters',
      'product.code.pattern': 'Only uppercase letters, numbers and dashes are allowed',
      'product.sku': 'Product SKU',
      'product.sku.required': 'SKU is required',
      'product.sku.min_length': 'SKU must be at least 16 characters',
      'product.sku.max_length': 'SKU must be no more than 16 characters',
      'product.sku.pattern': 'SKU must contain only uppercase letters and numbers',
      'product.category': 'Category',
      'product.category.required': 'Category is required',
      'product.stock': 'Stock',
      'product.stock.negative': 'Stock cannot be negative',
      'product.price': 'Regular Price',
      'product.price.required': 'Price is required',
      'product.price.min': 'Price must be 0 or greater',
      'product.price.pattern': 'Price must be a valid Euro amount (e.g. 10.99)',
      'product.images': 'Product Image (max 8)',
      'product.images.uploading': 'Uploading images...',
      'product.images.drag_drop': 'Drag & drop images here or click to browse',
      'product.images.drop_here': 'Drop images here to upload',
      'product.images.supported': 'Supported formats: JPG, PNG. Maximum 8 images.',
      'product.images.preview': 'Image Preview',
      'product.images.remove': 'Remove image',
      'product.images.remove_preview': 'Remove preview image',

      // Actions
      'action.add_product': 'Add Product',
      'action.update_product': 'Update Product',
      'action.save': 'Save',
      'action.saving': 'Saving...',
      'action.clear': 'Clear',
      'action.edit': 'Edit',
      'action.preview': 'Preview',
      'action.hide_preview': 'Hide Preview',
      'action.show_preview': 'Show Preview',

      // Templates
      'templates.quick_templates': 'Quick Templates',
      'templates.electronics': 'Electronics',
      'templates.clothing': 'Clothing',
      'templates.books': 'Books',
      'templates.home_garden': 'Home & Garden',

      // Suggestions
      'suggestions.title': 'Suggestions to improve your description:',
      'suggestions.more_details': 'Consider adding more details to make your description more comprehensive',
      'suggestions.keywords': 'Include relevant keywords to improve search visibility',
      'suggestions.readability': 'Consider simplifying the language for better readability',
      'suggestions.length': 'A longer description (100+ characters) typically performs better',

      // Keyboard shortcuts
      'shortcuts.title': 'Keyboard shortcuts:',
      'shortcuts.preview': 'Ctrl+P: Toggle preview',
      'shortcuts.save': 'Ctrl+S: Save product',

      // Messages
      'message.success_add': 'Product added successfully!',
      'message.success_update': 'Product updated successfully!',
      'message.error_update': 'Update failed: ',
      'message.error_create': 'Creation failed: ',

      // Common
      'common.characters': 'characters',
      'common.of': 'of',
      'common.required': 'required',
      'common.optional': 'optional',
      'common.loading': 'Loading...',
      'common.error': 'Error',
      'common.success': 'Success',
      'common.warning': 'Warning',
      'common.info': 'Information'
    },
    it: {
      // Product Form
      'product.name': 'Nome Prodotto',
      'product.name.help': 'Inserisci un nome descrittivo per il tuo prodotto',
      'product.name.required': 'Il nome del prodotto è obbligatorio',
      'product.description': 'Descrizione Prodotto',
      'product.description.help': 'Inserisci una descrizione dettagliata del tuo prodotto...',
      'product.description.required': 'La descrizione è obbligatoria',
      'product.description.too_short': 'La descrizione è troppo corta (minimo 10 caratteri)',
      'product.description.near_limit': 'Avvicinandosi al limite di caratteri',
      'product.description.over_limit': 'Superato il limite di caratteri',
      'product.description.good': 'La lunghezza della descrizione è buona',
      'product.description.empty': 'La descrizione è obbligatoria',
      'product.code': 'Codice Prodotto',
      'product.code.required': 'Il codice prodotto è obbligatorio',
      'product.code.min_length': 'Deve essere di almeno 16 caratteri',
      'product.code.max_length': 'Non deve superare i 16 caratteri',
      'product.code.pattern': 'Solo lettere maiuscole, numeri e trattini sono consentiti',
      'product.sku': 'SKU Prodotto',
      'product.sku.required': 'Lo SKU è obbligatorio',
      'product.sku.min_length': 'Lo SKU deve essere di almeno 16 caratteri',
      'product.sku.max_length': 'Lo SKU non deve superare i 16 caratteri',
      'product.sku.pattern': 'Lo SKU deve contenere solo lettere maiuscole e numeri',
      'product.category': 'Categoria',
      'product.category.required': 'La categoria è obbligatoria',
      'product.stock': 'Scorte',
      'product.stock.negative': 'Le scorte non possono essere negative',
      'product.price': 'Prezzo Regolare',
      'product.price.required': 'Il prezzo è obbligatorio',
      'product.price.min': 'Il prezzo deve essere 0 o maggiore',
      'product.price.pattern': 'Il prezzo deve essere un importo Euro valido (es. 10,99)',
      'product.images': 'Immagine Prodotto (max 8)',
      'product.images.uploading': 'Caricamento immagini...',
      'product.images.drag_drop': 'Trascina e rilascia le immagini qui o clicca per sfogliare',
      'product.images.drop_here': 'Rilascia le immagini qui per caricarle',
      'product.images.supported': 'Formati supportati: JPG, PNG. Massimo 8 immagini.',
      'product.images.preview': 'Anteprima Immagini',
      'product.images.remove': 'Rimuovi immagine',
      'product.images.remove_preview': 'Rimuovi anteprima immagine',

      // Actions
      'action.add_product': 'Aggiungi Prodotto',
      'action.update_product': 'Aggiorna Prodotto',
      'action.save': 'Salva',
      'action.saving': 'Salvataggio...',
      'action.clear': 'Cancella',
      'action.edit': 'Modifica',
      'action.preview': 'Anteprima',
      'action.hide_preview': 'Nascondi Anteprima',
      'action.show_preview': 'Mostra Anteprima',

      // Templates
      'templates.quick_templates': 'Template Rapidi',
      'templates.electronics': 'Elettronica',
      'templates.clothing': 'Abbigliamento',
      'templates.books': 'Libri',
      'templates.home_garden': 'Casa e Giardino',

      // Suggestions
      'suggestions.title': 'Suggerimenti per migliorare la tua descrizione:',
      'suggestions.more_details': 'Considera di aggiungere più dettagli per rendere la descrizione più completa',
      'suggestions.keywords': 'Includi parole chiave rilevanti per migliorare la visibilità nei motori di ricerca',
      'suggestions.readability': 'Considera di semplificare il linguaggio per una migliore leggibilità',
      'suggestions.length': 'Una descrizione più lunga (100+ caratteri) tipicamente funziona meglio',

      // Keyboard shortcuts
      'shortcuts.title': 'Scorciatoie da tastiera:',
      'shortcuts.preview': 'Ctrl+P: Attiva/disattiva anteprima',
      'shortcuts.save': 'Ctrl+S: Salva prodotto',

      // Messages
      'message.success_add': 'Prodotto aggiunto con successo!',
      'message.success_update': 'Prodotto aggiornato con successo!',
      'message.error_update': 'Aggiornamento fallito: ',
      'message.error_create': 'Creazione fallita: ',

      // Common
      'common.characters': 'caratteri',
      'common.of': 'di',
      'common.required': 'obbligatorio',
      'common.optional': 'opzionale',
      'common.loading': 'Caricamento...',
      'common.error': 'Errore',
      'common.success': 'Successo',
      'common.warning': 'Avviso',
      'common.info': 'Informazione'
    }
  };

  constructor() {
    // Load saved language preference
    const savedLanguage = localStorage.getItem('preferred_language');
    if (savedLanguage && this.messages[savedLanguage]) {
      this.currentLanguage.next(savedLanguage);
    }
  }

  /**
   * Get current language
   */
  getCurrentLanguage(): Observable<string> {
    return this.currentLanguage.asObservable();
  }

  /**
   * Get current language value
   */
  getCurrentLanguageValue(): string {
    return this.currentLanguage.value;
  }

  /**
   * Set language
   */
  setLanguage(language: string): void {
    if (this.messages[language]) {
      this.currentLanguage.next(language);
      localStorage.setItem('preferred_language', language);
    }
  }

  /**
   * Get translation
   */
  translate(key: string): string {
    const currentLang = this.currentLanguage.value;
    const langMessages = this.messages[currentLang];
    
    if (langMessages && langMessages[key]) {
      return langMessages[key];
    }
    
    // Fallback to English if translation not found
    const fallbackMessages = this.messages['en'];
    return fallbackMessages[key] || key;
  }

  /**
   * Get translation with parameters
   */
  translateWithParams(key: string, params: { [key: string]: string | number }): string {
    let translation = this.translate(key);
    
    Object.keys(params).forEach(param => {
      translation = translation.replace(`{${param}}`, params[param].toString());
    });
    
    return translation;
  }

  /**
   * Get available languages
   */
  getAvailableLanguages(): string[] {
    return Object.keys(this.messages);
  }

  /**
   * Get language display names
   */
  getLanguageDisplayNames(): { [key: string]: string } {
    return {
      'en': 'English',
      'it': 'Italiano'
    };
  }
} 