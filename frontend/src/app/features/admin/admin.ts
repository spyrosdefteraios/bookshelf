import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { User, ApiResponse } from '../../core/models/models';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css'
})
export class Admin implements OnInit {
  users: User[] = [];
  stats: any = null;
  loading = true;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadUsers();
    this.loadStats();
  }

  loadUsers() {
    setTimeout(() => { this.loading = false; }, 3000);
    this.http.get<ApiResponse<User[]>>(`${environment.apiUrl}/admin/users`).subscribe({
      next: (res) => {
        this.users = res.data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  loadStats() {
    this.http.get<any>(`${environment.apiUrl}/admin/stats`).subscribe({
      next: (res) => this.stats = res.data
    });
  }

  deleteUser(id: string) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.http.delete(`${environment.apiUrl}/admin/users/${id}`).subscribe({
        next: () => this.loadUsers()
      });
    }
  }
}