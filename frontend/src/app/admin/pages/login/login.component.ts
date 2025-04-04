import { Component, OnInit } from '@angular/core';
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
  error: string = '';

  constructor(private fb: FormBuilder, private adminService: AdminService, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.adminService.login(this.loginForm.value).subscribe({
      next: (res) => {
        this.authService.setToken(res.token);
        console.log('Login successful!', res);

        this.router.navigate(['/administration/dashboard']);

        this.loginForm.reset();
      },
      error: (err) => {
        console.error(err);
        this.error = err.error || 'Login failed';
      }
    });
  }
}
