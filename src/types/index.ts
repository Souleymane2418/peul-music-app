export interface Artist {
  id: string;
  name: string;
  country: string; // Guinée, Sénégal, Mali, Nigeria, Cameroun, Niger, Burkina Faso...
  generation: string; // "Traditionnelle", "Années 60-70", "Années 80-90", "Moderne 2000+", "Contemporaine"
  bio: string;
  imageUrl: string;
  verified: boolean;
  followers: number;
}

export interface Album {
  id: string;
  title: string;
  artistId: string;
  artistName: string;
  year: number;
  coverUrl: string;
  genre: string; // "Traditionnel", "Griot", "Moderne", "Religieux", "Diaspora"
  songIds: string[];
}

export interface Song {
  id: string;
  title: string;
  artistId: string;
  artistName: string;
  albumId?: string;
  albumTitle?: string;
  duration: number; // secondes
  audioUrl: string;
  coverUrl: string;
  year: number;
  country: string;
  generation: string;
  genre: string;
  language: string; // Pulaar, Fulfulde, Fula, Pular, etc.
  lyrics?: string;
  plays: number;
  isFavorite?: boolean;
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  coverUrl: string;
  songIds: string[];
  isPublic: boolean;
  createdAt: string;
}

export type RootStackParamList = {
  Main: undefined;
  Player: { songId: string };
  ArtistDetail: { artistId: string };
  AlbumDetail: { albumId: string };
  PlaylistDetail: { playlistId: string };
  Search: { query?: string };
};

export type TabParamList = {
  Home: undefined;
  Explore: undefined;
  Library: undefined;
  Profile: undefined;
};
