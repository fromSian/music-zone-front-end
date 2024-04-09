/**
 * List 查询分页
 */
export interface Links {
  next: string | null;
  previous: string | null;
}

/**
 * List 查询结果
 */
export interface ListResult<T> {
  links: Links;
  count: number;
  results: T[];
}

/**
 * Artist List 查询结果对象
 */
export interface ArtistListItem {
  id: string;
  createTime: string;
  updateTime: string;
  name: string;
  image: string;
  description: string;
}

/**
 * Artist Detail 查询结果对象
 */
export interface ArtistDetial {
  id: string;
  albums: AlbumListItem[];
  createTime: string;
  updateTime: string;
  name: string;
  image: string;
  description: string;
}

/**
 * Album List 查询结果对象
 */
export interface AlbumListItem {
  id: string;
  artist: ArtistListItem[];
  createTime: string;
  updateTime: string;
  name: string;
  image: string;
  description: string;
}

/**
 * Album Detail 查询结果对象
 */
export interface AlbumDetail {
  id: string;
  artist: ArtistListItem[];
  songs: Song[];
  createTime: string;
  updateTime: string;
  name: string;
  image: string;
  description: string;
}

/**
 * Song 查询结果对象
 */
export interface Song {
  id: string;
  artist: ArtistListItem[];
  album: AlbumListItem;
  createTime: string;
  updateTime: string;
  name: string;
  audio: string;
  track: number;
  description: string;
  duration: number;
  isLiked: boolean;
  image?: string;
}

/**
 * playlist List 查询结果对象
 */
export interface PlaylistListItem {
  id: string;
  createTime: string;
  updateTime: string;
  name: string;
  image: string | null;
  description: string;
}

/**
 * playlist add/remove song 传参
 */
export interface PlaylistEditSong {
  song: string;
}

type PlayRecordAlbum = {
  type: "ALBUMS";
  detail: AlbumListItem;
};
type PlayRecordArtist = {
  type: "ARTISTS";
  detail: ArtistListItem;
};

type PlayRecordSong = {
  type: "SONGS";
  detail: Song;
};

type PlayRecordPlayList = {
  type: "PLAYLISTS";
  detail: PlaylistListItem;
};

/**
 * play record List 查询结果
 */
export type PlayRecordList = {
  id: string;
  createTime: string;
  updateTime: string;
  target_id: string;
  count: number;
  description: string;
} & (
  | PlayRecordAlbum
  | PlayRecordArtist
  | PlayRecordSong
  | PlayRecordPlayList
  | null
);

/**
 * play record type
 */
export type PlayRecordType = "PLAYLISTS" | "ALBUMS" | "SONGS" | "ARTISTS";

/**
 * play record add one record 传参
 */
export interface playRecordEdit {
  type: PlayRecordType;
  target_id: string;
  description: string;
}

export interface SearchResult {
  total: number;
  songs: Songs[];
  albums: Albums[];
  playlists: Playlists[];
}

export interface Playlists {
  id: string;
  name: string;
  description: string;
}

export interface Albums {
  id: string;
  name: string;
  description: string;
}

export interface Songs {
  id: string;
  name: string;
  description: string;
  album: string;
}
