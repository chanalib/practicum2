import { Routes } from '@angular/router';
import { SongUploadComponent } from './admin/song-upload/song-upload.component';
import { AdminMessagesComponent } from './admin/admin-messages/admin-messages.component';
import { HomeComponent } from './home/home.component';
import { AllSongsComponent } from './all-songs/all-songs.component';
import { EditSongComponent } from './edit-song/edit-song.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },

  { path: 'upload', component: SongUploadComponent },
  { path: 'message', component: AdminMessagesComponent },
  { path: 'songs', component: AllSongsComponent }, // ← זה החדש
  { path: 'edit/:id', component: EditSongComponent },

  { path: '**', redirectTo: '' }  // ניתוב ברירת מחדל לדף הבית

];
