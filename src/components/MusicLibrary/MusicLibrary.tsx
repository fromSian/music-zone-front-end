import {
  AlbumListItem,
  ArtistListItem,
  ListResult,
  PlaylistListItem,
} from "@/types/musicInfo";
import { getErrorMessage } from "@/utils/error";
import request from "@/utils/request";
import { Divider, Spin, Tag } from "antd";
import { AxiosResponse } from "axios";
import classnames from "classnames";
import { useCallback, useEffect, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./MusicLibrary.module.less";

const tagOptions = [
  {
    label: "专辑",
    key: "albums",
    disabled: false,
  },
  {
    label: "歌单",
    key: "playlists",
    disabled: false,
  },
  {
    label: "艺人",
    key: "artists",
    disabled: false,
  },
];

const modeOptions = [
  {
    label: "卡片模式",
    key: "card",
    disabled: false,
  },
  {
    label: "列表模式",
    key: "list",
    disabled: true,
  },
];
const types = ["albums", "playlists", "artists"];
const size = 16;
const MusicLibrary = () => {
  const { type } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<
    (PlaylistListItem | AlbumListItem | ArtistListItem)[]
  >([]);
  const [activeMode, setActiveMode] = useState<string>("card");

  const [cur, setCur] = useState(1);
  const [total, setTotal] = useState<number | undefined>(undefined);

  const controllerRef = useRef<AbortController>();

  const loadMoreData = useCallback(
    async (type: string, page: number, size: number) => {
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
        const result: AxiosResponse<ListResult<AlbumListItem>> =
          await request.get(`/${type}/?page=${page}&size=${size}`, {
            signal: controllerRef.current.signal,
          });
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
    },
    []
  );

  useEffect(() => {
    if (!type || !types.includes(type)) {
      navigate(`/library/albums/`);
      return;
    }
    if (controllerRef.current) {
      controllerRef.current.abort();
      controllerRef.current = undefined;
    }
    setData([]);
    setCur(1);
    setTotal(undefined);
    loadMoreData(type, 1, size);

    return () => {
      if (controllerRef.current) {
        controllerRef.current.abort();
        controllerRef.current = undefined;
      }
    };
  }, [type]);

  const handleGoDetail = useCallback(
    (item: ArtistListItem | AlbumListItem | PlaylistListItem) => {
      window.open(`/library/${type}/${item.id}`);
    },
    [type]
  );

  return (
    <div className={styles.music_library}>
      <div className={styles.music_library_header}>
        <div className={styles.music_library_header_tags}>
          {tagOptions.map((tag) => (
            <Tag.CheckableTag
              className={tag.disabled ? styles.tag_disabled : ""}
              key={tag.key}
              checked={type === tag.key}
              onChange={() => navigate(`/library/${tag.key}`)}
            >
              {tag.label}
            </Tag.CheckableTag>
          ))}
        </div>

        <div className={styles.music_library_header_mode}>
          {modeOptions.map((mode) => (
            <div
              key={mode.key}
              className={classnames(
                styles.music_library_header_mode_item,
                {
                  [styles.music_library_header_mode_item_disabled]:
                    mode.disabled,
                },
                {
                  [styles.music_library_header_mode_item_active]:
                    activeMode === mode.key,
                }
              )}
              onClick={() => {
                if (mode.disabled) {
                  return;
                }
                setActiveMode(mode.key);
              }}
            >
              {mode.label}
            </div>
          ))}
        </div>
      </div>
      <div className={styles.music_library_content} id="scrollContent">
        <InfiniteScroll
          dataLength={data.length}
          next={() => loadMoreData(type || "ablums", cur, size)}
          hasMore={!total || data.length < total}
          loader={
            <Divider>
              <Spin />
            </Divider>
          }
          endMessage={<Divider plain>已加载全部🫠</Divider>}
          scrollableTarget={"scrollContent"}
        >
          <div className={styles.music_library_content_list}>
            {data.map((item, index) => (
              <div
                className={styles.music_library_content_list_item}
                key={`music_library_item${index}`}
                onClick={() => handleGoDetail(item)}
              >
                <div className={styles.music_library_content_list_item_image}>
                  <img
                    src={item.image}
                    className={
                      styles.music_library_content_list_item_image_main
                    }
                  />
                </div>

                <p className={styles.music_library_content_list_item_name}>
                  {item.name}
                </p>
              </div>
            ))}
          </div>
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default MusicLibrary;
