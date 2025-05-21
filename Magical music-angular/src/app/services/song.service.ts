import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class SongService {
  private apiUrl = 'http://localhost:5191/api/s3/upload'; // ← נתיב נכון מהשרת

  constructor(private http: HttpClient) {}

  uploadSong(formData: FormData) {
    return this.http.post(this.apiUrl, formData);
  }
}
