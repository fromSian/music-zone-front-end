import { useAppDispatch, useAppSelector } from "@/states/hooks";
import {
  addOne,
  changePlayingSong,
  playOneAlbum,
  setPlaying,
} from "@/states/playing.slice";
import { AlbumDetail, Song } from "@/types/musicInfo";
import { addPlayRecord, loveOrNotASong } from "@/utils/api";
import { getErrorMessage } from "@/utils/error";
import request from "@/utils/request";
import { joinList2Str } from "@/utils/text";
import { formatSecondsString } from "@/utils/time";
import { Button, Empty, Spin, Tooltip, message } from "antd";
import { AxiosResponse } from "axios";
import classnames from "classnames";
import { useCallback, useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
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
  const queryClient = useQueryClient();

  const [album, setAlbum] = useState<AlbumDetail>();
  const { isLoading, isFetching, isSuccess, data } = useQuery({
    queryKey: ["album", id],
    queryFn: async ({ queryKey }) => {
      try {
        const [_key, id] = queryKey;
        const result: AxiosResponse<AlbumDetail> = await request.get(
          `/albums/${id}/`
        );
        return result.data;
      } catch (err) {
        getErrorMessage(err);
      }
    },
    enabled: !!id,
  });

  useEffect(() => {
    if (data) {
      setAlbum(data);
    }
  }, [data]);

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

  const handlePlayOneSong = useCallback((song: Song) => {
    dispatch(addOne({ song, isPlayNow: true }));
  }, []);

  return (
    <div className={styles.album}>
      {isLoading || isFetching ? (
        <Spin />
      ) : isSuccess && album ? (
        <>
          <div className={styles.album_header} ref={headerRef}>
            <div className={styles.album_image}>
              <img
                src={
                  album.image
                    ? album.image
                    : new URL(
                        "@/asset/images/default/album.JPG",
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
                          dispatch(changePlayingSong(song));
                          dispatch(setPlaying(true));
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
                              onClick={async () => {
                                try {
                                  const res = await loveOrNotASong(
                                    song.id,
                                    false
                                  );
                                  if (res) {
                                    setAlbum((v) => {
                                      if (!v) {
                                        return;
                                      }
                                      const songs = v.songs.map((item) => {
                                        if (item.id === song.id) {
                                          item.isLiked = false;
                                        }
                                        return item;
                                      });
                                      return { ...v, songs };
                                    });
                                    message.success("取消收藏成功！");
                                  } else {
                                    throw new Error("取消收藏失败");
                                  }
                                } catch (err) {
                                  message.error("取消收藏失败");
                                  getErrorMessage(err);
                                }
                              }}
                              className={
                                styles.album_songs_item_content_operator_icon
                              }
                            />
                          ) : (
                            <HeartLineIcon
                              onClick={async () => {
                                try {
                                  const res = await loveOrNotASong(
                                    song.id,
                                    true
                                  );
                                  if (res) {
                                    setAlbum((v) => {
                                      if (!v) {
                                        return;
                                      }
                                      const songs = v.songs.map((item) => {
                                        if (item.id === song.id) {
                                          item.isLiked = true;
                                        }
                                        return item;
                                      });
                                      return { ...v, songs };
                                    });
                                    message.success("收藏成功！");
                                  } else {
                                    throw new Error("手擦失败");
                                  }
                                } catch (err) {
                                  message.error("收藏失败");
                                  getErrorMessage(err);
                                }
                              }}
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
              <Empty />
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
