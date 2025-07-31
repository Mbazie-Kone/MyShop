import { Component, OnInit, inject } from '@angular/core';
import { AbstractControl, AbstractControlOptions, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  roles: Record<string, unknown>[] = [];
  error = '';
  isLoading = false;

  private fb = inject(FormBuilder);
  private adminService = inject(AdminService);

  ngOnInit(): void {
    const options: AbstractControlOptions = {
      validators: this.passwordsMatchValidator
    };

    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      roleId: ['', Validators.required]
    }, options);

    this.adminService.getRoles().subscribe({
      next: (res) => this.roles = res,
      error: () => this.error = 'error loading roles'
    });
  }

  passwordsMatchValidator(control: AbstractControl): Record<string, unknown> | null  {
    const group = control as FormGroup;
    const password = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
  
    return password === confirm ? null : { passwordsMismatch: true };
  }

  onSubmit(): void {
    if (this.registerForm.invalid) return;
    
    this.isLoading = true;
    this.error = '';
    
    const formData = this.registerForm.value;

    this.adminService.register(formData).subscribe({
      next: () => {
        alert('Registration completed!');
        this.registerForm.reset();
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = err.error || 'Error during registration';
        this.isLoading = false;
      } 
    });
  }
}
