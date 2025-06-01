import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class SongService {
  private baseUrl = 'https://localhost:7157/api';

  constructor(private http: HttpClient) {}

  uploadSong(formData: FormData) {
    return this.http.post(`${this.baseUrl}/s3/upload`, formData);
  }

  deleteSong(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/song/${id}`);
  }

  getAllSongs(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/song`);
  }

  getSongById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/song/${id}`);
  }

  updateSong(id: number, songData: any): Observable<any> {
    console.log('Updating song with:', songData);

    return this.http.put(`${this.baseUrl}/song/${id}`, songData, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
}
