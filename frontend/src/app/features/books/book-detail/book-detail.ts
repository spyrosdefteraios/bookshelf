import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BookService } from '../../../core/services/book.service';
import { AuthService } from '../../../core/services/auth.service';
import { Book, Review } from '../../../core/models/models';

@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './book-detail.html',
  styleUrl: './book-detail.css'
})
export class BookDetail implements OnInit {
  book: Book | null = null;
  reviews: Review[] = [];
  loading = true;
  editMode = false;

  newReview = { text: '', rating: 5 };

  editData = {
    status: '' as 'reading' | 'read' | 'wishlist',
    rating: undefined as number | undefined
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookService: BookService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadBook(id);
      this.loadReviews(id);
    }
  }

  loadBook(id: string) {
    setTimeout(() => { this.loading = false; }, 3000);
    this.bookService.getBookById(id).subscribe({
      next: (res) => {
        this.book = res.data;
        this.editData.status = res.data.status;
        this.editData.rating = res.data.rating || undefined;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  loadReviews(id: string) {
    this.bookService.getReviews(id).subscribe({
      next: (res) => this.reviews = res.data
    });
  }

  updateBook() {
    if (!this.book) return;
    this.bookService.updateBook(this.book.id, this.editData).subscribe({
      next: (res) => {
        this.book = res.data;
        this.editMode = false;
      }
    });
  }

  addReview() {
    if (!this.book) return;
    this.bookService.createReview(this.book.id, this.newReview).subscribe({
      next: () => {
        this.newReview = { text: '', rating: 5 };
        this.loadReviews(this.book!.id);
      }
    });
  }

  deleteReview(reviewId: string) {
    this.bookService.deleteReview(reviewId).subscribe({
      next: () => this.loadReviews(this.book!.id)
    });
  }

  goBack() {
    this.router.navigate(['/books']);
  }
}