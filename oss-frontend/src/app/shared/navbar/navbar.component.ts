import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit, OnDestroy {
  
  isMenuOpen = false;
  cartCount = 0;
  isAuthenticated = false;
  user: any = null;
  searchQuery = '';
  
  private subscriptions = new Subscription();

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.subscriptions.add(
      this.cartService.cart$.subscribe(cart => {
        this.cartCount = this.cartService.getCartCount();
      })
    );

    this.subscriptions.add(
      this.authService.currentUser$.subscribe(user => {
        this.user = user;
        this.isAuthenticated = !!user;
      })
    );

    this.cartCount = this.cartService.getCartCount();
    this.isAuthenticated = this.authService.isAuthenticated();
    this.user = this.authService.getCurrentUser();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
    this.closeMenu();
  }

  search() {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/products'], { queryParams: { search: this.searchQuery } });
      this.searchQuery = '';
      this.closeMenu();
    }
  }
}
