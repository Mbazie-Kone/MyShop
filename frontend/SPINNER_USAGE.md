# Spinner Component Usage Guide

## Overview

The project includes a reusable spinner component to display loading indicators during asynchronous operations such as loading data from the database.

## Available Components

### 1. SpinnerComponent
Base component to display a rotating loading indicator.

**Usage:**
```html
<app-spinner size="60px"></app-spinner>
```

**Properties:**
- `size`: Spinner size (default: '50px')

### 2. LoadingWrapperComponent
Wrapper component that automatically manages the display of the spinner and content.

**Usage:**
```html
<app-loading-wrapper [loading]="loading" [spinnerSize]="'60px'">
  <!-- Content to display when not loading -->
  <div class="content">
    Your data here...
  </div>
</app-loading-wrapper>
```

**Properties:**
- `loading`: Boolean indicating if data is loading
- `spinnerSize`: Spinner size (default: '60px')
- `minHeight`: Minimum container height (default: '300px')
- `showSpinner`: Boolean to show/hide spinner (default: true)

## Implementation in Components

### Method 1: Direct use of SpinnerComponent

```typescript
// In TypeScript component
export class MyComponent {
  loading: boolean = true;
  data: any[] = [];

  ngOnInit(): void {
    this.loading = true;
    this.dataService.getData().subscribe({
      next: (data) => {
        this.data = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error:', error);
        this.loading = false;
      }
    });
  }
}
```

```html
<!-- In HTML template -->
<div *ngIf="loading" class="d-flex justify-content-center align-items-center" style="min-height: 300px;">
    <app-spinner size="60px"></app-spinner>
</div>

<div *ngIf="!loading">
    <!-- Page content -->
    <div *ngFor="let item of data">
        {{ item.name }}
    </div>
</div>
```

### Method 2: Using LoadingWrapperComponent (Recommended)

```typescript
// In TypeScript component
export class MyComponent {
  loading: boolean = true;
  data: any[] = [];

  ngOnInit(): void {
    this.loading = true;
    this.dataService.getData().subscribe({
      next: (data) => {
        this.data = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error:', error);
        this.loading = false;
      }
    });
  }
}
```

```html
<!-- In HTML template -->
<app-loading-wrapper [loading]="loading" [spinnerSize]="'60px'">
    <!-- Page content -->
    <div *ngFor="let item of data">
        {{ item.name }}
    </div>
</app-loading-wrapper>
```

## Problem Resolution: "Data is still visible during loading"

### Problem
If you still see data when the spinner is active, it might be due to:

1. **Too fast timing**: Data loads so quickly that you don't see the spinner
2. **Incorrect loading logic**: The `loading` property is not managed correctly
3. **Template not updated**: The template doesn't use `*ngIf` directives correctly

### Solutions

#### 1. Add a delay for testing (debug only)
```typescript
ngOnInit(): void {
  this.loading = true;
  
  // Artificial delay to test the spinner
  setTimeout(() => {
    this.dataService.getData().subscribe({
      next: (data) => {
        this.data = data;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
      }
    });
  }, 2000); // 2 second delay
}
```

#### 2. Always use LoadingWrapperComponent
The `LoadingWrapperComponent` automatically manages the display logic:

```html
<app-loading-wrapper [loading]="loading" [spinnerSize]="'60px'">
    <!-- All content here will be hidden during loading -->
    <div class="table-responsive">
        <table class="table">
            <!-- Your data here -->
        </table>
    </div>
</app-loading-wrapper>
```

#### 3. Verify loading logic
Make sure the `loading` property is managed correctly:

```typescript
export class MyComponent {
  loading: boolean = true; // Always start with true
  
  ngOnInit(): void {
    this.loading = true; // Explicitly set to true
    this.dataService.getData().subscribe({
      next: (data) => {
        this.data = data;
        this.loading = false; // Set to false when data is ready
      },
      error: (error) => {
        console.error('Error:', error);
        this.loading = false; // Set to false even in case of error
      }
    });
  }
}
```

#### 4. Test with the test component
Use the `LoadingTestComponent` to verify everything works:

```html
<app-loading-test></app-loading-test>
```

## Practical Examples

### Example 1: Table with database data
```html
<app-loading-wrapper [loading]="loading" [spinnerSize]="'80px'">
    <div class="table-responsive">
        <table class="table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Price</th>
                </tr>
            </thead>
            <tbody>
                <tr *ngFor="let product of products">
                    <td>{{ product.name }}</td>
                    <td>{{ product.price }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</app-loading-wrapper>
```

### Example 2: Card with statistics
```html
<app-card>
    <app-loading-wrapper [loading]="loading" [spinnerSize]="'40px'">
        <div class="card-body">
            <h5>Statistics</h5>
            <p>Total orders: {{ totalOrders }}</p>
            <p>Revenue: €{{ revenue }}</p>
        </div>
    </app-loading-wrapper>
</app-card>
```

### Example 3: Form with validation
```html
<app-loading-wrapper [loading]="saving" [spinnerSize]="'50px'">
    <form [formGroup]="myForm" (ngSubmit)="onSubmit()">
        <input formControlName="name" class="form-control">
        <button type="submit" [disabled]="saving">Save</button>
    </form>
</app-loading-wrapper>
```

## Best Practices

1. **Always handle errors**: Make sure to set `loading = false` even in case of error
2. **Use LoadingWrapperComponent**: It's cleaner and reusable
3. **Appropriate sizes**: Use different sizes for different contexts (40px for cards, 60-80px for full pages)
4. **Visual feedback**: The spinner should appear immediately when an asynchronous operation starts
5. **Accessibility**: The spinner provides visual feedback to users during operations
6. **Loading testing**: Use artificial delays during development to test user experience

## Customization

You can customize the spinner appearance by modifying the CSS file:
```css
/* src/app/shared/spinner/spinner.component.css */
.spinner {
    border: 6px solid #ccc;
    border-top: 6px solid #4e73df; /* Primary color */
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin: auto;
}
```

## Debug and Troubleshooting

### Console Log for Debug
```typescript
ngOnInit(): void {
  this.loading = true;
  console.log('Loading started:', this.loading);
  
  this.dataService.getData().subscribe({
    next: (data) => {
      console.log('Data loaded:', data);
      this.data = data;
      this.loading = false;
      console.log('Loading finished:', this.loading);
    },
    error: (error) => {
      console.error('Error:', error);
      this.loading = false;
      console.log('Loading finished with error:', this.loading);
    }
  });
}
```

### Verify loading state
Add a visual indicator in the template:
```html
<div class="mb-2">
    <small class="text-muted">Loading state: {{ loading ? 'TRUE' : 'FALSE' }}</small>
</div>
``` 