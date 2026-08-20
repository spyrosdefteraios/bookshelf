import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  menuOpen = false;

  constructor(public authService: AuthService) {}

  logout() {
    this.authService.logout();
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
}