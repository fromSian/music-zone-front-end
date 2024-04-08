import { Song } from "@/types/musicInfo";
import classnames from "classnames";
import { PauseIcon, PlayIcon } from "../Icons/Icons";
import PlayingIcon from "../PlayingIcon/PlayingIcon";
import styles from "./PlayStatus.module.less";

const PlayStatus = ({
  isPlaying,
  playingSong,
  item,
  handlePlay,
  handlePause,
}: {
  playingSong: Song | null;
  isPlaying: boolean;
  item: Song;
  handlePlay: () => void;
  handlePause: () => void;
}) => {
  return (
    <div className={styles.play_status}>
      <PlayingIcon
        isAnimate={true}
        className={classnames(styles.play_status_icon, {
          [styles.play_status_playing_animate]:
            playingSong && playingSong.id === item.id && isPlaying,
        })}
      />
      <PlayingIcon
        className={classnames(styles.play_status_icon, {
          [styles.play_status_playing_noanimate]:
            playingSong && playingSong.id === item.id && !isPlaying,
        })}
      />

      <PlayIcon
        className={classnames(
          styles.play_status_icon,
          {
            [styles.play_status_play]:
              !playingSong || playingSong.id !== item.id,
          },
          {
            [styles.play_status_play_hover]:
              playingSong && playingSong.id === item.id && !isPlaying,
          }
        )}
        onClick={handlePlay}
      />

      <PauseIcon
        className={classnames(styles.play_status_icon, {
          [styles.play_status_pause]:
            playingSong && playingSong.id === item.id && isPlaying,
        })}
        onClick={handlePause}
      />
    </div>
  );
};

export default PlayStatus;
