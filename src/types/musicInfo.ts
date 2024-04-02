export type BasicSongType = {
  name: string;
  audio: string;
  id: number | string;
};

export type SongType = BasicSongType & {
  album: string;
  artist: string;
};

export type ArtistType = {};

export type AlbumSongType = BasicSongType & { duration: number };
export type AlbumType = {
  id: number | string;
  name: string;
  image: string;
  artist: string;
  songs: AlbumSongType[];
};
