import { useAppDispatch, useAppSelector } from "@/states/hooks";
import { addOne, playOneAlbum, setPlaying } from "@/states/playing.slice";
import { ListResult, PlaylistListItem, Song } from "@/types/musicInfo";
import { getErrorMessage } from "@/utils/error";
import request from "@/utils/request";
import { Button, Divider, Empty, Spin, Tooltip } from "antd";
import { AxiosResponse } from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useParams } from "react-router-dom";
import {
  AddIcon,
  HeartLineIcon,
  PlayModeOrderIcon,
  PlayModeShuffleIcon,
} from "../Icons/Icons";
import PlayStatus from "../PlayStatus/PlayStatus";
import styles from "./PlayList.module.less";

const size = 10;
const PlayList = () => {
  const { id } = useParams();
  const { playingSong, isPlaying } = useAppSelector((state) => state.playing);
  const dispatch = useAppDispatch();
  const headerRef = useRef<HTMLDivElement | null>(null);

  const [data, setData] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);

  const [total, setTotal] = useState<number | undefined>(undefined);

  const controllerRef = useRef<AbortController>();
  const pageRef = useRef(1);

  const [isLoading, setIsLoading] = useState(false);

  const [playlist, setPlaylist] = useState<PlaylistListItem>();

  const queryPlaylist = useCallback(async () => {
    try {
      setIsLoading(true);
      const result: AxiosResponse<PlaylistListItem> = await request.get(
        `/playlists/${id}/`
      );
      if (result && result.data) {
        setPlaylist(result.data);
      } else {
        setPlaylist(undefined);
      }
    } catch (err) {
      getErrorMessage(err);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    queryPlaylist();
  }, [queryPlaylist]);

  const loadMoreData = useCallback(async (page: number, size: number) => {
    if (loading) {
      return;
    }
    try {
      setLoading(true);
      if (controllerRef.current) {
        controllerRef.current.abort();
        controllerRef.current = undefined;
      }

      controllerRef.current = new AbortController();
      const result: AxiosResponse<ListResult<Song>> = await request.get(
        `/playlists/${id}/query_songs/?page=${page}&size=${size}`,
        {
          signal: controllerRef.current.signal,
        }
      );
      if (result && result.data) {
        setData((data) => [...data, ...result.data.results]);
        setLoading(false);
        pageRef.current = pageRef.current + 1;
        setTotal(result.data.count);
      }
    } catch (err) {
      setLoading(false);
      getErrorMessage(err);
    }
  }, []);

  useEffect(() => {
    loadMoreData(1, size);
  }, []);

  /**
   * 顺序播放
   */
  const handlePlayInOrder = useCallback(() => {
    if (!data) {
      return;
    }
    dispatch(playOneAlbum({ songs: data }));
  }, [data]);

  /**
   * 乱序播放
   */
  const handlePlayShuffle = useCallback(() => {
    if (!data) {
      return;
    }
    dispatch(playOneAlbum({ songs: data, isShuffle: true }));
  }, [data]);

  /**
   * 加入播放列表
   */
  const addToPlayList = useCallback((song: Song) => {
    dispatch(addOne({ song }));
  }, []);

  return (
    <div className={styles.playlist}>
      {isLoading ? (
        <Spin />
      ) : playlist ? (
        <>
          <div className={styles.playlist_header} ref={headerRef}>
            <div className={styles.playlist_image}>
              <img
                src={
                  playlist.image
                    ? playlist.image
                    : new URL(
                        "@/asset/images/default/playlist.JPG",
                        import.meta.url
                      ).href
                }
                className={styles.playlist_image_main}
              />
            </div>

            <div className={styles.playlist_info}>
              <p className={styles.playlist_info_name}>{playlist.name}</p>
              <p className={styles.playlist_info_description}>
                {playlist.description}
              </p>
              <div className={styles.playlist_info_bottom}>
                <div className={styles.playlist_info_play_control}>
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
          <div id="scrollContent" className={styles.playlist_songs_wrap}>
            <InfiniteScroll
              dataLength={data.length}
              next={() => loadMoreData(pageRef.current, size)}
              hasMore={total === undefined || data.length < total}
              loader={
                <Divider>
                  <Spin />
                </Divider>
              }
              endMessage={<Divider plain>已加载全部🫠</Divider>}
              scrollableTarget={"scrollContent"}
            >
              <div className={styles.playlist_songs}>
                {data.map((song, index) => (
                  <li className={styles.playlist_songs_item} key={song.id}>
                    <div className={styles.playlist_songs_item_content}>
                      <p className={styles.playlist_songs_item_content_index}>
                        {index + 1}
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
                      <div className={styles.playlist_songs_item_content_info}>
                        <p className={styles.playlist_songs_item_content_name}>
                          {song.name}
                        </p>
                      </div>
                      <div
                        className={styles.playlist_songs_item_content_operator}
                      >
                        <Tooltip title={"加入播放列表"}>
                          <AddIcon
                            onClick={() => {
                              addToPlayList(song);
                            }}
                            className={
                              styles.playlist_songs_item_content_operator_icon
                            }
                          />
                        </Tooltip>
                        <Tooltip title={"喜欢"}>
                          <HeartLineIcon
                            className={
                              styles.playlist_songs_item_content_operator_icon
                            }
                          />
                        </Tooltip>
                      </div>
                    </div>
                  </li>
                ))}
              </div>
            </InfiniteScroll>
          </div>
        </>
      ) : (
        <Empty />
      )}
    </div>
  );
};

export default PlayList;
