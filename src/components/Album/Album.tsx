import { formatSecondsString } from "@/utils/time";
import { Button, Empty } from "antd";
import { useRef } from "react";
import { PlayModeOrderIcon, PlayModeShuffleIcon } from "../Icons/Icons";
import styles from "./Album.module.less";
const Album = () => {
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
    ],
  });

  const album = albumRef.current;

  return (
    <div className={styles.album}>
      <img
        src={new URL(album.image, import.meta.url).href}
        className={styles.album_image}
      />
      <div className={styles.album_header}>
        <p className={styles.album_header_name}>{album.name}</p>
        <p className={styles.album_header_artist}>{album.artist}</p>
        <p className={styles.album_header_detail}>{`共 ${
          album.songs.length
        } 首，${formatSecondsString(
          album.songs.reduce((prev, cur) => prev + cur.duration, 0)
        )}`}</p>

        <div className={styles.album_header_play_control}>
          <Button type="primary" icon={<PlayModeOrderIcon />}>
            播放
          </Button>
          <Button type="primary" icon={<PlayModeShuffleIcon />}>
            乱序播放
          </Button>
        </div>
      </div>

      <div className={styles.album_songs}>
        {album.songs && album.songs.length ? <></> : <Empty />}
      </div>
    </div>
  );
};

export default Album;
