import { Component, OnInit } from '@angular/core';
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
  roles: any[] = [];
  error: string = '';

  constructor(private fb: FormBuilder, private adminService: AdminService) {}

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

  passwordsMatchValidator(control: AbstractControl): { [key: string]: any } | null  {
    const group = control as FormGroup;
    const password = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
  
    return password === confirm ? null : { passwordsMismatch: true };
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.error = 'Fill in all the fields correctly.';
      
      return;
    }

    const formData = this.registerForm.value;

    this.adminService.register(formData).subscribe({
      next: () => {
        alert('Registration completed!');
        this.registerForm.reset();
      },
      error: (err) => {
        console.error(err);
        this.error = err.error || 'Error during registration';
      } 
    });
  }
}
