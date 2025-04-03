import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm! : FormGroup;
  error: string = '';

  constructor(private fb: FormBuilder, private adminService: AdminService) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: [''],
      password: ['']
    })
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.adminService.login(this.loginForm.value).subscribe({
      next: (res) => {
        console.log('Login succes', res);
      }
    })
  }
}
