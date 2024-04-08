import { useAppDispatch, useAppSelector } from "@/states/hooks";
import { addOne, playOneAlbum, setPlaying } from "@/states/playing.slice";
import { AlbumDetail, Song } from "@/types/musicInfo";
import { addPlayRecord } from "@/utils/api";
import { getErrorMessage } from "@/utils/error";
import request from "@/utils/request";
import { joinList2Str } from "@/utils/text";
import { formatSecondsString } from "@/utils/time";
import { Button, Empty, Spin, Tooltip } from "antd";
import { AxiosResponse } from "axios";
import classnames from "classnames";
import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import {
  AddIcon,
  HeartFullIcon,
  HeartLineIcon,
  PlayModeOrderIcon,
  PlayModeShuffleIcon,
} from "../Icons/Icons";
import PlayStatus from "../PlayStatus/PlayStatus";
import styles from "./Album.module.less";

const Album = () => {
  const { id, song_id } = useParams();
  const { playingSong, isPlaying } = useAppSelector((state) => state.playing);
  const dispatch = useAppDispatch();
  const headerRef = useRef<HTMLDivElement | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [album, setAlbum] = useState<AlbumDetail>();

  const query = useCallback(async () => {
    try {
      setIsLoading(true);
      const result: AxiosResponse<AlbumDetail> = await request.get(
        `/albums/${id}/`
      );
      if (result && result.data) {
        setAlbum(result.data);
      }
    } catch (err) {
      getErrorMessage(err);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    query();
  }, [query]);

  /**
   * 顺序播放
   */
  const handlePlayInOrder = useCallback(() => {
    if (!album) {
      return;
    }
    dispatch(playOneAlbum({ songs: album.songs }));
    addPlayRecord("ALBUMS", album.id);
  }, [album]);

  /**
   * 乱序播放
   */
  const handlePlayShuffle = useCallback(() => {
    if (!album) {
      return;
    }
    dispatch(playOneAlbum({ songs: album.songs, isShuffle: true }));
    addPlayRecord("ALBUMS", album.id);
  }, [album]);

  /**
   * 加入播放列表
   */
  const addToPlayList = useCallback((song: Song) => {
    dispatch(addOne({ song }));
  }, []);

  return (
    <div className={styles.album}>
      {isLoading ? (
        <Spin />
      ) : album ? (
        <>
          <div className={styles.album_header} ref={headerRef}>
            <div className={styles.album_image}>
              <img
                src={
                  album.image
                    ? album.image
                    : new URL(
                        "@/asset/images/default/albums.JPG",
                        import.meta.url
                      ).href
                }
                className={styles.album_image_main}
              />
            </div>

            <div className={styles.album_info}>
              <p className={styles.album_info_name}>{album.name}</p>
              <p className={styles.album_info_artist}>
                {joinList2Str(album.artist, "name")}
              </p>
              <div className={styles.album_info_bottom}>
                <p className={styles.album_info_detail}>{`共 ${
                  album.songs.length
                } 首，${formatSecondsString(
                  album.songs.reduce((prev, cur) => prev + cur.duration, 0)
                )}`}</p>
                {album.songs.length ? (
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
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
          <div className={styles.album_songs}>
            {album.songs && album.songs.length ? (
              <>
                {album.songs.map((song) => (
                  <li
                    className={classnames(styles.album_songs_item, {
                      [styles.album_songs_item_active]: song_id === song.id,
                    })}
                    key={song.id}
                  >
                    <div className={styles.album_songs_item_content}>
                      <p className={styles.album_songs_item_content_index}>
                        {song.track}
                      </p>
                      <PlayStatus
                        playingSong={playingSong}
                        isPlaying={isPlaying}
                        item={song}
                        handlePlay={() => {
                          dispatch(addOne({ song, isPlayNow: true }));
                        }}
                        handlePause={() => {
                          dispatch(setPlaying(false));
                        }}
                      />
                      <div className={styles.album_songs_item_content_info}>
                        <p className={styles.album_songs_item_content_name}>
                          {song.name}
                        </p>
                      </div>
                      <div className={styles.album_songs_item_content_operator}>
                        <Tooltip title={"加入播放列表"}>
                          <AddIcon
                            onClick={() => {
                              addToPlayList(song);
                            }}
                            className={
                              styles.album_songs_item_content_operator_icon
                            }
                          />
                        </Tooltip>
                        <Tooltip title={"喜欢"}>
                          {song?.isLiked ? (
                            <HeartFullIcon
                              onClick={async () => {}}
                              className={
                                styles.album_songs_item_content_operator_icon
                              }
                            />
                          ) : (
                            <HeartLineIcon
                              onClick={async () => {}}
                              className={
                                styles.album_songs_item_content_operator_icon
                              }
                            />
                          )}
                        </Tooltip>
                        {/* <Tooltip title={"播放"}>
                          <PlayIcon
                            onClick={() => handlePlayOneSong(song)}
                            className={
                              styles.album_songs_item_content_operator_icon
                            }
                          />
                        </Tooltip> */}
                      </div>
                    </div>
                  </li>
                ))}
              </>
            ) : (
              <Empty description={"无歌曲"} />
            )}
          </div>
        </>
      ) : (
        <Empty />
      )}
    </div>
  );
};

export default Album;
