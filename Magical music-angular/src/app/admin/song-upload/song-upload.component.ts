import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SongService } from '../../services/song.service';

@Component({
  selector: 'app-song-upload',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './song-upload.component.html',
  styleUrls: ['./song-upload.component.css']
})
export class SongUploadComponent {
  uploadForm: FormGroup;
  selectedFile: File | null = null;
  isSubmitting = false;  // מצב שליחה


  constructor(private fb: FormBuilder, private songService: SongService) {
    this.uploadForm = this.fb.group({
      name: [''],
      musicStyle: [''],
      songLength: [0],  // טיפוס מספרי
      releaseDate: [''],
      creatorId: [0],   // טיפוס מספרי
    });
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  // פונקציה להמרת שניות למספר דקות ושניות במחרוזת
  formatSongLength(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' + s : s}`;
  }

  onSubmit() {
    if (!this.selectedFile) {
      alert('יש לבחור קובץ!');
      return;
    }
    if (this.isSubmitting) {
      return; // מונע שליחה כפולה
    }
  
    this.isSubmitting = true; // מתחילים שליחה
  
    const formData = new FormData();
    formData.append('file', this.selectedFile);
  
    const song = this.uploadForm.value;
    formData.append('name', song.name);
    formData.append('musicStyle', song.musicStyle);
    formData.append('songLength', song.songLength.toString());
    formData.append('releaseDate', song.releaseDate);
    formData.append('creatorId', song.creatorId.toString());
  
    this.songService.uploadSong(formData).subscribe({
      next: () => {
        alert('השיר הועלה בהצלחה!');
        this.isSubmitting = false; // סיימנו
      },
      error: err => {
        console.error('שגיאה בהעלאה:', err);
        this.isSubmitting = false; // סיימנו גם במקרה של שגיאה
      }
    });
  }
  
}
