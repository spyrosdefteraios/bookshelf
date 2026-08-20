import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { BookService } from '../../core/services/book.service';
import { Book } from '../../core/models/models';

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './books.html',
  styleUrl: './books.css'
})
export class Books implements OnInit {
  books: Book[] = [];
  loading = true;
  showAddForm = false;
  statusFilter = '';

  newBook = {
    title: '',
    author: '',
    genre: '',
    description: '',
    pages: undefined as number | undefined,
    year: undefined as number | undefined,
    status: 'wishlist' as 'reading' | 'read' | 'wishlist',
    rating: undefined as number | undefined
  };

  constructor(private bookService: BookService) {}

  ngOnInit() {
    this.loadBooks();
  }

  loadBooks() {
    this.loading = true;
    const filters = this.statusFilter ? { status: this.statusFilter } : {};

    setTimeout(() => { this.loading = false; }, 3000);

    this.bookService.getBooks(filters).subscribe({
      next: (res) => {
        this.books = res.data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  addBook() {
    this.bookService.createBook(this.newBook).subscribe({
      next: () => {
        this.showAddForm = false;
        this.resetForm();
        this.loadBooks();
      }
    });
  }

  deleteBook(id: string) {
    if (confirm('Are you sure you want to delete this book?')) {
      this.bookService.deleteBook(id).subscribe({
        next: () => this.loadBooks()
      });
    }
  }

  resetForm() {
    this.newBook = {
      title: '',
      author: '',
      genre: '',
      description: '',
      pages: undefined,
      year: undefined,
      status: 'wishlist',
      rating: undefined
    };
  }
}