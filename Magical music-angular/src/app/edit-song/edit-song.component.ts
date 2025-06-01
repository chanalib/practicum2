import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { SongService } from '../services/upLoad/song.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-song',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-song.component.html'
})
export class EditSongComponent implements OnInit {
  songForm!: FormGroup;
  songId!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private songService: SongService
  ) {}

  ngOnInit(): void {
    this.songId = Number(this.route.snapshot.paramMap.get('id'));
  
    this.songForm = this.fb.group({
      id: [''],

      name: ['', Validators.required],
      musicStyle: ['', Validators.required],
      songLength: [0, Validators.required],
      s3Url: [''],  // ← שדה נסתר
      key: [''],    // ← שדה נסתר
      creatorId: [0], // ← חובה אם השיר מקושר ליוצר
      artistName: [''],      // אופציונלי
      description: ['']      // אופציונלי
    });
  
    this.songService.getSongById(this.songId).subscribe(song => {
      this.songForm.patchValue(song);
    });
  }
  

  onSubmit(): void {
    if (this.songForm.valid) {
      this.songService.updateSong(this.songId, this.songForm.value).subscribe(() => {
        this.router.navigate(['/songs']);
      });
    }
  }
}
