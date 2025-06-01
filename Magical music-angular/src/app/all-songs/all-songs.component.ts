import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';   // <-- ייבוא Router
import { SongService } from '../services/upLoad/song.service';

@Component({
  selector: 'app-all-songs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './all-songs.component.html',
  styleUrls: ['./all-songs.component.css']
})
export class AllSongsComponent implements OnInit {
  songs: any[] = [];

  constructor(
    private songService: SongService,
    private router: Router    // <-- הוספה כאן
  ) {}

  ngOnInit(): void {
    this.loadSongs();
  }

  loadSongs(): void {
    this.songService.getAllSongs().subscribe(data => {
      this.songs = data;
    });
  }

  editSong(id: number) {
    this.router.navigate(['/edit', id]);
  }

  deleteSong(id: number) {
    if (confirm('האם אתה בטוח שברצונך למחוק את השיר?')) {
      this.songService.deleteSong(id).subscribe({
        next: () => {
          this.songs = this.songs.filter(song => song.id !== id);
        },
        error: () => alert('אירעה שגיאה בעת המחיקה')
      });
    }
  }
}
