import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../../services/admin.service';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm! : FormGroup;
  error = '';
  isLoading = false;

  private fb = inject(FormBuilder);
  private adminService = inject(AdminService);
  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    this.error = '';

    this.adminService.login(this.loginForm.value).subscribe({
      next: (res) => {
        this.authService.setToken(res.token);
        // Login successful

        this.router.navigate(['/administration/dashboard']);

        this.loginForm.reset();
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = err.error || 'Login failed';
        this.isLoading = false;
      }
    });
  }
}
