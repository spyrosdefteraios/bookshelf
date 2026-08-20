import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Book, Review, BookStats, ApiResponse } from '../models/models';

@Injectable({ providedIn: 'root' })
export class BookService {
  constructor(private http: HttpClient) {}

  getBooks(filters?: { status?: string; genre?: string }): Observable<ApiResponse<Book[]>> {
    let url = `${environment.apiUrl}/books`;
    if (filters?.status) url += `?status=${filters.status}`;
    if (filters?.genre) url += `${filters.status ? '&' : '?'}genre=${filters.genre}`;
    return this.http.get<ApiResponse<Book[]>>(url);
  }

  getBookById(id: string): Observable<ApiResponse<Book>> {
    return this.http.get<ApiResponse<Book>>(`${environment.apiUrl}/books/${id}`);
  }

  createBook(data: Partial<Book>): Observable<ApiResponse<Book>> {
    return this.http.post<ApiResponse<Book>>(`${environment.apiUrl}/books`, data);
  }

  updateBook(id: string, data: Partial<Book>): Observable<ApiResponse<Book>> {
    return this.http.put<ApiResponse<Book>>(`${environment.apiUrl}/books/${id}`, data);
  }

  deleteBook(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/books/${id}`);
  }

  getStats(): Observable<ApiResponse<BookStats>> {
    return this.http.get<ApiResponse<BookStats>>(`${environment.apiUrl}/books/stats`);
  }

  getReviews(bookId: string): Observable<ApiResponse<Review[]>> {
    return this.http.get<ApiResponse<Review[]>>(`${environment.apiUrl}/books/${bookId}/reviews`);
  }

  createReview(bookId: string, data: { text: string; rating: number }): Observable<ApiResponse<Review>> {
    return this.http.post<ApiResponse<Review>>(`${environment.apiUrl}/books/${bookId}/reviews`, data);
  }

  deleteReview(reviewId: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/reviews/${reviewId}`);
  }
}