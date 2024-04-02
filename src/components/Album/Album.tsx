import audio1 from "@/asset/audios/sample1.m4a";
import audio2 from "@/asset/audios/sample2.m4a";
import { useAppDispatch } from "@/states/hooks";
import { addOne, playOneAlbum } from "@/states/playing.slice";
import { AlbumType, SongType } from "@/types/musicInfo";
import { formatSecondsString } from "@/utils/time";
import { Button, Empty, Tooltip } from "antd";
import { useCallback, useRef } from "react";
import {
  AddIcon,
  HeartLineIcon,
  PlayIcon,
  PlayModeOrderIcon,
  PlayModeShuffleIcon,
} from "../Icons/Icons";
import styles from "./Album.module.less";
const Album = () => {
  const dispatch = useAppDispatch();
  const headerRef = useRef<HTMLDivElement | null>(null);
  const albumRef = useRef<AlbumType>({
    id: "1",
    name: "给天王星",
    artist: "郑宜农",
    image: "../../asset/images/albums/561710387733_.pic.jpg",
    songs: [
      {
        name: "2017, 你",
        id: "1-1",
        duration: 7832,
        audio: audio1,
      },
      {
        name: "591",
        id: "1-2",
        duration: 7832,
        audio: audio2,
      },
      {
        name: "2017, 你1",
        id: "1-3",
        duration: 7832,
        audio: audio1,
      },
      {
        name: "5911",
        id: "1-4",
        duration: 7832,
        audio: audio2,
      },
    ],
  });

  const album = albumRef.current;

  /**
   * 顺序播放
   */
  const handlePlayInOrder = useCallback(() => {
    const _list = album.songs.map((item) => ({
      name: item.name,
      audio: item.audio,
      id: item.id,
      artist: album.artist,
      album: album.name,
    }));
    dispatch(playOneAlbum({ songs: _list }));
  }, [album]);

  /**
   * 乱序播放
   */
  const handlePlayShuffle = useCallback(() => {
    const _list = album.songs.map((item) => ({
      name: item.name,
      audio: item.audio,
      id: item.id,
      artist: album.artist,
      album: album.name,
    }));
    dispatch(playOneAlbum({ songs: _list, isShuffle: true }));
  }, [album]);

  /**
   * 加入播放列表
   */
  const addToPlayList = useCallback((song: SongType) => {
    dispatch(addOne(song));
  }, []);
  return (
    <div className={styles.album}>
      <div className={styles.album_header} ref={headerRef}>
        <div className={styles.album_image}>
          <img
            src={new URL(album.image, import.meta.url).href}
            className={styles.album_image_main}
          />
        </div>

        <div className={styles.album_info}>
          <p className={styles.album_info_name}>{album.name}</p>
          <p className={styles.album_info_artist}>{album.artist}</p>
          <div className={styles.album_info_bottom}>
            <p className={styles.album_info_detail}>{`共 ${
              album.songs.length
            } 首，${formatSecondsString(
              album.songs.reduce((prev, cur) => prev + cur.duration, 0)
            )}`}</p>
            <div className={styles.album_info_play_control}>
              <Button
                type="primary"
                icon={<PlayModeOrderIcon />}
                onClick={handlePlayInOrder}
              >
                播放
              </Button>
              <Button
                type="primary"
                icon={<PlayModeShuffleIcon />}
                onClick={handlePlayShuffle}
              >
                乱序播放
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.album_songs}>
        {album.songs && album.songs.length ? (
          <>
            {album.songs.map((song, index) => (
              <li className={styles.album_songs_item} key={song.id}>
                <div className={styles.album_songs_item_content}>
                  <p className={styles.album_songs_item_content_index}>
                    {index + 1}
                  </p>
                  <div className={styles.album_songs_item_content_info}>
                    <p className={styles.album_songs_item_content_name}>
                      {song.name}
                    </p>
                  </div>
                  <div className={styles.album_songs_item_content_operator}>
                    <Tooltip title={"加入播放列表"}>
                      <AddIcon
                        onClick={() => {
                          addToPlayList({
                            name: song.name,
                            id: song.id,
                            audio: song.audio,
                            album: album.name,
                            artist: album.artist,
                          });
                        }}
                        className={
                          styles.album_songs_item_content_operator_icon
                        }
                      />
                    </Tooltip>
                    <Tooltip title={"喜欢"}>
                      <HeartLineIcon
                        className={
                          styles.album_songs_item_content_operator_icon
                        }
                      />
                    </Tooltip>
                    <Tooltip title={"播放"}>
                      <PlayIcon
                        className={
                          styles.album_songs_item_content_operator_icon
                        }
                      />
                    </Tooltip>
                  </div>
                </div>
              </li>
            ))}
          </>
        ) : (
          <Empty />
        )}
      </div>
    </div>
  );
};

export default Album;
