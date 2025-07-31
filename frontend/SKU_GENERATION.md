# Generazione Automatica SKU

## Panoramica

Il sistema implementa una generazione automatica dello SKU (Stock Keeping Unit) basata sui campi del prodotto inseriti dall'utente. Lo SKU viene generato dinamicamente e rispetta gli standard attuali per garantire unicità e leggibilità.

## Funzionalità Implementate

### 1. Generazione Automatica
- **Trigger**: La generazione si attiva automaticamente quando vengono modificati i campi:
  - Nome del prodotto
  - Categoria
  - Stock
  - Prezzo
- **Debounce**: 500ms di ritardo per evitare generazioni eccessive
- **Modalità**: Solo in modalità "Aggiungi Prodotto" (non in modifica)

### 2. Formato SKU
Il formato generato segue il pattern: `NAME-CAT-STK-PRC-TIME-RND`

- **NAME**: Prime 3 lettere del nome prodotto (maiuscolo, solo alfanumerici)
- **CAT**: Prime 3 lettere della categoria (maiuscolo, solo alfanumerici)
- **STK**: Stock con padding a 3 cifre (es. 001, 050, 999)
- **PRC**: Prezzo intero con padding a 3 cifre (es. 019, 150, 999)
- **TIME**: Ultime 4 cifre del timestamp corrente
- **RND**: 3 caratteri alfanumerici casuali (maiuscolo)

**Esempio**: `IPH-ELC-050-999-1234-ABC`

### 3. Validazione e Unicità
- **Verifica Unicità**: Chiamata API per verificare che lo SKU sia univoco
- **Rigenerazione Automatica**: Se lo SKU è duplicato, viene rigenerato automaticamente
- **Validazione Formato**: Regex `/^[A-Z0-9-]+$/` per caratteri validi
- **Lunghezza**: Min 8, Max 30 caratteri

### 4. Interfaccia Utente
- **Campo Readonly**: Lo SKU è di sola lettura in modalità aggiunta
- **Pulsante Rigenerazione**: Icona di refresh per rigenerare manualmente
- **Indicatori Visivi**: 
  - Verde: SKU univoco e valido
  - Rosso: SKU duplicato
  - Spinner: Verifica in corso
- **Messaggi Dinamici**: Feedback sullo stato di validazione

### 5. Regole di Validazione Aggiornate
```typescript
sku: ['', [
  Validators.required, 
  Validators.minLength(8), 
  Validators.maxLength(30), 
  Validators.pattern(/^[A-Z0-9-]+$/)
]]
```

## API Endpoint

### Verifica Unicità SKU
```
GET /api/catalog/check-sku?sku={sku}&productId={productId}
```

**Parametri:**
- `sku` (obbligatorio): Lo SKU da verificare
- `productId` (opzionale): ID del prodotto in modifica (per escludere se stesso)

**Risposta:**
```json
{
  "isUnique": boolean
}
```

## Flusso di Funzionamento

1. **Inizializzazione**: Setup dei listener sui campi del form
2. **Modifica Campi**: Quando l'utente modifica nome, categoria, stock o prezzo
3. **Debounce**: Attesa di 500ms per evitare chiamate eccessive
4. **Generazione**: Creazione dello SKU basato sui valori correnti
5. **Verifica**: Chiamata API per controllare l'unicità
6. **Feedback**: Aggiornamento dell'interfaccia con lo stato
7. **Rigenerazione**: Se necessario, ripetizione del processo

## Gestione Errori

- **API Non Disponibile**: Lo SKU viene accettato anche se la verifica fallisce
- **Timeout**: Rigenerazione automatica se lo SKU è duplicato
- **Validazione**: Blocco del submit se lo SKU non è valido

## Sicurezza

- **Sanitizzazione**: Rimozione di caratteri speciali dal nome e categoria
- **Padding**: Riempimento con 'X' per nomi troppo corti
- **Randomizzazione**: Suffisso casuale per garantire unicità
- **Timestamp**: Inclusione del tempo per evitare collisioni

## Personalizzazione

Il sistema è facilmente estendibile per:
- Modificare il formato dello SKU
- Aggiungere nuovi campi alla generazione
- Cambiare le regole di validazione
- Implementare logiche di business specifiche

## Note Tecniche

- **RxJS**: Utilizzo di `debounceTime` e `distinctUntilChanged` per performance
- **Reactive Forms**: Integrazione completa con Angular Reactive Forms
- **TypeScript**: Tipizzazione completa per type safety
- **Accessibilità**: Supporto per screen reader e navigazione da tastiera 