import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  name: string = '';
  email: string = '';
  phone: string = '';
  password: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';
  isLoading = false;
  showOtp = false;
  otpCode = '';
  createdUserId: number | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  register() {
    if (!this.name || !this.email || !this.password) {
      this.errorMessage = 'Please provide your name, email, and password';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    console.log('Starting registration for:', this.email);

    // Use registerStub first (creates user without password)
    this.authService.registerStub(this.email, this.phone).subscribe({
      next: (user) => {
        console.log('RegisterStub response:', user);
        this.isLoading = false;
        if (user && user.id) {
          this.createdUserId = user.id;
          console.log('Sending OTP for userId:', user.id);
          // send OTP
          this.authService.sendSignupOtp(user.id, this.email).subscribe({
            next: (sent) => {
              console.log('SendOTP response:', sent);
              if (sent) {
                console.log('Showing OTP form');
                this.showOtp = true;
              } else {
                this.errorMessage = 'Failed to send verification code. Please try again.';
              }
            },
            error: (error) => {
              console.error('SendOTP error:', error);
              this.errorMessage = 'Failed to send verification code. Please try again.';
            }
          });
        } else {
          this.errorMessage = 'Registration failed. Please try again.';
        }
      },
      error: (error) => {
        console.error('RegisterStub error:', error);
        this.isLoading = false;
        this.errorMessage = 'Registration failed. Please try again.';
      }
    });
  }

  verifyOtp() {
    if (!this.createdUserId || !this.otpCode) {
      this.errorMessage = 'Enter the verification code';
      return;
    }
    this.isLoading = true;
    this.authService.verifySignupOtp(this.createdUserId, this.email, this.otpCode).subscribe(ok => {
      this.isLoading = false;
      if (ok) {
        // OTP verified, now set the password
        if (this.createdUserId) { // TypeScript null check
          this.authService.setUserPassword(this.createdUserId, this.password).subscribe({
            next: (success) => {
              if (success) {
                // Password set successfully, redirect to login page
                this.router.navigate(['/login'], { 
                  queryParams: { 
                    message: 'Registration successful! Please login with your credentials.' 
                  } 
                });
              } else {
                this.errorMessage = 'Failed to set password. Please try again.';
              }
            },
            error: (error) => {
              console.error('SetPassword error:', error);
              this.errorMessage = 'Failed to set password: ' + (error.error?.message || error.message || 'Unknown error');
            }
          });
        } else {
          this.errorMessage = 'User ID not found. Please try registration again.';
        }
      } else {
        this.errorMessage = 'Invalid verification code';
      }
    });
  }
}
