import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Message } from '../../models/message.model';

@Injectable({ providedIn: 'root' })
export class MessageService {
  private apiUrl = 'https://localhost:7157/api/messages';

  constructor(private http: HttpClient) {}

  getMessages(): Observable<Message[]> {
    return this.http.get<Message[]>(this.apiUrl);
  }
}
