import { formatSecondsString } from "@/utils/time";
import { Button, Empty, Tooltip } from "antd";
import { useRef } from "react";
import {
  AddIcon,
  HeartLineIcon,
  PlayIcon,
  PlayModeOrderIcon,
  PlayModeShuffleIcon,
} from "../Icons/Icons";
import styles from "./Album.module.less";
const Album = () => {
  const headerRef = useRef<HTMLDivElement | null>(null);
  const albumRef = useRef({
    name: "给天王星",
    artist: "郑宜农",
    image: "../../asset/images/albums/561710387733_.pic.jpg",
    songs: [
      {
        name: "2017, 你",
        id: "90",
        duration: 7832,
      },
      {
        name: "591",
        id: "23",
        duration: 7832,
      },
      {
        name: "2017, 你",
        id: "90",
        duration: 7832,
      },
      {
        name: "591",
        id: "23",
        duration: 7832,
      },
      {
        name: "2017, 你",
        id: "90",
        duration: 7832,
      },
      {
        name: "591",
        id: "23",
        duration: 7832,
      },
      {
        name: "2017, 你",
        id: "90",
        duration: 7832,
      },
      {
        name: "591",
        id: "23",
        duration: 7832,
      },
      {
        name: "2017, 你",
        id: "90",
        duration: 7832,
      },
      {
        name: "591",
        id: "23",
        duration: 7832,
      },
    ],
  });

  const album = albumRef.current;

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
              <Button type="primary" icon={<PlayModeOrderIcon />}>
                播放
              </Button>
              <Button type="primary" icon={<PlayModeShuffleIcon />}>
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
