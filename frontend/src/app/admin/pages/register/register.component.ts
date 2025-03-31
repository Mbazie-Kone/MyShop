import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      roleId: ['', Validators.required]
    }, 
    { validators: this.passwordsMatchValidator }
  );

    this.adminService.getRoles().subscribe({
      next: (res) => this.roles = res,
      error: () => this.error = 'error loading roles'
    })
  }

  passwordsMatchValidator(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;

    return password === confirm ? null : { passwordsMismatch: true };
  }

  onSubmit(): void {
    if (this.registerForm.invalid) return;

    this.adminService.register(this.registerForm.value).subscribe({
      next: () => alert('Registration completed!'),
      error: (err) => this.error = err.error || 'Error during registration'
    });
  }
}
