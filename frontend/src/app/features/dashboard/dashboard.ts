import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BookService } from '../../core/services/book.service';
import { AuthService } from '../../core/services/auth.service';
import { BookStats, Book } from '../../core/models/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  stats: BookStats | null = null;
  recentBooks: Book[] = [];
  loading = true;

  constructor(
    private bookService: BookService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.loading = true;

    this.bookService.getBooks().subscribe({
      next: (res) => {
        this.recentBooks = res.data.slice(0, 4);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });

    this.bookService.getStats().subscribe({
      next: (res) => {
        this.stats = res.data;
      },
      error: () => {}
    });
  }
}