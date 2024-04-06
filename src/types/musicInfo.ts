/**
 * List 查询分页
 */
export interface Links {
  next: string;
  previous: any;
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
  image: any;
  description: string;
}

/**
 * playlist add/remove song 传参
 */
export interface PlaylistEditSong {
  song: string;
}

/**
 * play record List 查询结果
 */
export interface PlayRecordList {
  id: string;
  createTime: string;
  updateTime: string;
  type: PlayRecordType;
  target_id: string;
  count: number;
  description: string;
  detail: PlaylistListItem | AlbumListItem | ArtistDetial | Song | null;
}

/**
 * play record type
 */
export type PlayRecordType = "PLAYLIST" | "ALBUM" | "SONG" | "ARTIST";

/**
 * play record add one record 传参
 */
export interface playRecordEdit {
  type: PlayRecordType;
  target_id: string;
  description: string;
}

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
