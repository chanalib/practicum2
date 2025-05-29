// songService.ts

import axios from 'axios';

// טיפוס השיר
export interface Song {
  id: number
  name: string
  musicStyle: string
  songLength: number
  creatorId: number
  S3Url: string
  key: string
  artistName: string
  description: string
}

// שליפת כל השירים
export const getAllSongs = async (): Promise<Song[]> => {
  const response = await axios.get<Song[]>('/api/songs');
  return response.data;
};

// שליפת שירים לפי זמר
export const getSongsByCreator = async (creatorId: string): Promise<Song[]> => {
  const response = await axios.get<Song[]>(`/api/songs/creator/${creatorId}`);
  return response.data;
};
