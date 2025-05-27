import { Routes } from '@angular/router';
import { SongUploadComponent } from './admin/song-upload/song-upload.component';
import { AdminMessagesComponent } from './admin/admin-messages/admin-messages.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },

  { path: 'upload', component: SongUploadComponent },
  { path: 'message', component: AdminMessagesComponent },
  { path: '**', redirectTo: '' }  // ניתוב ברירת מחדל לדף הבית

];
