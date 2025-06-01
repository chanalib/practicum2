import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SongUploadComponent } from './admin/song-upload/song-upload.component';
import { AdminMessagesComponent } from './admin/admin-messages/admin-messages.component';
import { HeaderComponent } from './header/header.component';
import { AllSongsComponent } from './all-songs/all-songs.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ReactiveFormsModule, RouterOutlet,HeaderComponent, AllSongsComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'client-angular';
}
