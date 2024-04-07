import { useAppDispatch } from "@/states/hooks";
import { addOne, playOneAlbum } from "@/states/playing.slice";
import { AlbumDetail, ListResult, Song } from "@/types/musicInfo";
import { getErrorMessage } from "@/utils/error";
import request from "@/utils/request";
import { Button, Divider, Empty, Spin, Tooltip } from "antd";
import { AxiosResponse } from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import {
  AddIcon,
  HeartLineIcon,
  PlayIcon,
  PlayModeOrderIcon,
  PlayModeShuffleIcon,
} from "../Icons/Icons";
import styles from "./PlayList.module.less";

const size = 10;
const PlayList = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const headerRef = useRef<HTMLDivElement | null>(null);

  const {
    isLoading,
    isFetching,
    isSuccess,
    data: playlist,
  } = useQuery({
    queryKey: ["playlist", id],
    queryFn: async ({ queryKey }) => {
      try {
        const [_key, id] = queryKey;
        const result: AxiosResponse<AlbumDetail> = await request.get(
          `/playlists/${id}/`
        );
        return result.data;
      } catch (err) {
        getErrorMessage(err);
      }
    },
    enabled: !!id,
  });

  const [data, setData] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);

  const [cur, setCur] = useState(1);
  const [total, setTotal] = useState<number | undefined>(undefined);

  const controllerRef = useRef<AbortController>();

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
        setCur((v) => v + 1);
        setTotal(result.data.count);
      }
    } catch (err) {
      setLoading(false);
      getErrorMessage(err);
    }
  }, []);

  useEffect(() => {
    loadMoreData(cur, size);
  }, []);

  /**
   * 顺序播放
   */
  const handlePlayInOrder = useCallback(() => {
    if (!playlist) {
      return;
    }
    dispatch(playOneAlbum({ songs: playlist.songs }));
  }, [playlist]);

  /**
   * 乱序播放
   */
  const handlePlayShuffle = useCallback(() => {
    if (!playlist) {
      return;
    }
    dispatch(playOneAlbum({ songs: playlist.songs, isShuffle: true }));
  }, [playlist]);

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
    <div className={styles.playlist}>
      {isLoading || isFetching ? (
        <Spin />
      ) : isSuccess && playlist ? (
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
          <div className={styles.playlist_songs} id="scrollContent">
            <InfiniteScroll
              dataLength={data.length}
              next={() => loadMoreData(cur, size)}
              hasMore={!total || data.length < total}
              loader={
                <Divider>
                  <Spin />
                </Divider>
              }
              endMessage={<Divider plain>已加载全部🫠</Divider>}
              scrollableTarget={"scrollContent"}
            >
              {data.map((song, index) => (
                <li className={styles.playlist_songs_item} key={song.id}>
                  <div className={styles.playlist_songs_item_content}>
                    <p className={styles.playlist_songs_item_content_index}>
                      {index + 1}
                    </p>
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
                      <Tooltip title={"播放"}>
                        <PlayIcon
                          onClick={() => handlePlayOneSong(song)}
                          className={
                            styles.playlist_songs_item_content_operator_icon
                          }
                        />
                      </Tooltip>
                    </div>
                  </div>
                </li>
              ))}
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
