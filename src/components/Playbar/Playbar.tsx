import { useAppDispatch, useAppSelector } from "@/states/hooks";
import {
  changePlayingSortType,
  playNext,
  playPrev,
  revertPlayingList,
  setPanelVisible,
  setPlaying,
  shufflePlayingList,
} from "@/states/playing.slice";
import { PlayingSortType } from "@/types/playInfo";
import { addPlayRecord } from "@/utils/api";
import { joinList2Str } from "@/utils/text";
import { formatTime } from "@/utils/time";
import { Spin, Tooltip } from "antd";
import classnames from "classnames";
import { MouseEvent, useEffect, useRef, useState } from "react";
import { BsFillMusicPlayerFill } from "react-icons/bs";
import {
  HeartFullIcon,
  HeartLineIcon,
  PauseIcon,
  PlayIcon,
  PlayListIcon,
  PlayModeOneIcon,
  PlayModeOrderIcon,
  PlayModeShuffleIcon,
  PlayNextIcon,
  PlayPrevIcon,
  VolumeHighIcon,
  VolumeLowIcon,
  VolumeMuteIcon,
} from "../Icons/Icons";
import PlayingList from "./PlayingList";
import styles from "./playbar.module.less";

const Playbar = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const volumeDivRef = useRef<HTMLDivElement | null>(null);
  const timeDivRef = useRef<HTMLDivElement | null>(null);
  const namePRef = useRef<HTMLParagraphElement | null>(null);
  const nameDivRef = useRef<HTMLDivElement | null>(null);
  const nameIntervalRef = useRef<ReturnType<typeof setInterval>>();

  const [nameLeft, setNameLeft] = useState<number>(0);

  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [volume, setVolume] = useState<number>(0);

  const [duration, setDuration] = useState<number>(0);
  const [current, setCurrent] = useState<number>(0);

  const volumeBakRef = useRef<number>();

  const {
    listInAddOrder,
    listInPlayOrder,
    playingSong: song,
    isPlaying: isPlay,
    panelVisible,
    playingSortType,
  } = useAppSelector((state) => state.playing);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!namePRef.current || !nameDivRef.current) {
      return;
    }
    nameIntervalRef.current && clearInterval(nameIntervalRef.current);

    const pWidth = namePRef.current?.getBoundingClientRect().width;
    const dWidth = nameDivRef.current?.getBoundingClientRect().width;
    if (pWidth <= dWidth) {
      setNameLeft(0);
      return;
    }
    setNameLeft(10);

    nameIntervalRef.current = setInterval(() => {
      setNameLeft((left) => {
        if (!pWidth || !dWidth) {
          return 0;
        }
        return -left >= pWidth ? dWidth : left - 1;
      });
    }, 50);

    return () => {
      nameIntervalRef.current && clearInterval(nameIntervalRef.current);
    };
  }, [song]);

  useEffect(() => {
    if (!song) {
      setCurrent(0);
      setDuration(0);
      setIsReady(false);
      return;
    }

    setIsReady(false);
    if (!audioRef.current) {
      return;
    }
    // audioRef.current.src = new URL(song.audio, import.meta.url).href;
    audioRef.current.src = song.audio;

    const ready = () => {
      setIsReady(true);
      if (audioRef.current) {
        setVolume(audioRef.current?.volume);
        setDuration(audioRef.current?.duration);
        setCurrent(audioRef.current?.currentTime);
      }
    };
    audioRef.current?.addEventListener("canplay", ready);

    const update = () => {
      audioRef.current && setCurrent(audioRef.current.currentTime);
    };
    audioRef.current.addEventListener("timeupdate", update);

    const seeking = () => {
      setIsLoading(true);
    };
    audioRef.current?.addEventListener("seeking", seeking);

    const seeked = () => {
      setIsLoading(false);
    };
    audioRef.current.addEventListener("seeked", seeked);

    const ended = () => {
      dispatch(playNext());
    };
    audioRef.current.addEventListener("ended", ended);

    const play = () => {
      dispatch(setPlaying(true));
      addPlayRecord("SONGS", song.id);
    };
    audioRef.current.addEventListener("play", play);

    const pause = () => {
      dispatch(setPlaying(false));
    };
    audioRef.current.addEventListener("pause", pause);
    return () => {
      audioRef.current?.removeEventListener("canplay", ready);
      audioRef.current?.removeEventListener("timeupdate", update);
      audioRef.current?.removeEventListener("seeking", seeking);
      audioRef.current?.removeEventListener("seeked", seeked);
      audioRef.current?.removeEventListener("ended", ended);
      audioRef.current?.removeEventListener("play", play);
      audioRef.current?.removeEventListener("pause", pause);
    };
  }, [song]);

  const mute = () => {
    if (audioRef.current) {
      volumeBakRef.current = audioRef.current.volume;
      setVolume(0);
      audioRef.current.volume = 0;
    }
  };

  useEffect(() => {
    if (isReady) {
      isPlay ? audioRef.current?.play() : audioRef.current?.pause();
    }
  }, [isReady, isPlay, song]);

  useEffect(() => {
    if (playingSortType === 1) {
      dispatch(shufflePlayingList());
    } else if (playingSortType === 0) {
      dispatch(revertPlayingList());
    }
  }, [playingSortType]);

  return (
    <>
      <div
        className={classnames(styles.playbar, {
          [styles.playbar_inactive]: !isReady || isLoading,
        })}
      >
        <audio
          loop={playingSortType === PlayingSortType.One}
          ref={audioRef}
        ></audio>
        <div className={styles.playbar_album_image}>
          {song?.album.image ? (
            <img
              src={song.album.image}
              className={styles.playbar_album_image_main}
            />
          ) : (
            <BsFillMusicPlayerFill
              className={styles.playbar_album_image_main}
            />
          )}
          {isLoading && <Spin className={styles.playbar_album_image_loading} />}
        </div>
        <div className={styles.playbar_info}>
          <Tooltip title={song?.name || "未播放"}>
            <div className={styles.playbar_info_name_wrap} ref={nameDivRef}>
              {/* 跑马灯 */}
              <p
                ref={namePRef}
                className={styles.playbar_info_name}
                style={{ left: nameLeft }}
              >
                {song?.name || "未播放"}
              </p>
            </div>
          </Tooltip>
          <Tooltip title={song?.album.name || ""}>
            <p className={styles.playbar_info_album}>
              {song?.album.name || ""}
            </p>
          </Tooltip>
          <Tooltip
            title={song?.artist ? joinList2Str(song.artist, "name") : ""}
          >
            <p className={styles.playbar_info_artist}>
              {song?.artist ? joinList2Str(song.artist, "name") : ""}
            </p>
          </Tooltip>
        </div>

        <div className={styles.play_control}>
          <div className={styles.play_control_switch}>
            {song?.isLiked ? (
              <HeartFullIcon className={styles.play_control_switch_icon} />
            ) : (
              <HeartLineIcon className={styles.play_control_switch_icon} />
            )}
            <PlayPrevIcon
              className={styles.play_control_switch_icon}
              onClick={() => dispatch(playPrev())}
            />
            {!isPlay ? (
              <PlayIcon
                className={classnames(
                  styles.play_control_switch_icon,
                  styles.play_control_switch_play
                )}
                onClick={() => dispatch(setPlaying(true))}
              />
            ) : (
              <PauseIcon
                className={classnames(
                  styles.play_control_switch_icon,
                  styles.play_control_switch_play
                )}
                onClick={() => dispatch(setPlaying(false))}
              />
            )}
            <PlayNextIcon
              className={styles.play_control_switch_icon}
              onClick={() => dispatch(playNext())}
            />
            <div
              onClick={() =>
                dispatch(
                  changePlayingSortType(
                    playingSortType > 1 ? 0 : playingSortType + 1
                  )
                )
              }
            >
              {/* 顺序循环 */}
              {playingSortType === PlayingSortType.InOrder && (
                <PlayModeOrderIcon
                  className={styles.play_control_switch_icon}
                />
              )}
              {/* 单曲循环 */}
              {playingSortType === PlayingSortType.One && (
                <PlayModeOneIcon className={styles.play_control_switch_icon} />
              )}
              {/* 乱序播放 */}
              {playingSortType === PlayingSortType.Random && (
                <PlayModeShuffleIcon
                  className={styles.play_control_switch_icon}
                />
              )}
            </div>
          </div>

          <div className={styles.play_control_bar}>
            <p className={styles.play_control_bar_label_now}>
              {formatTime(current)}
            </p>
            <div
              className={styles.play_control_bar_line}
              ref={timeDivRef}
              onClick={(event: MouseEvent<HTMLElement>) => {
                if (audioRef.current && timeDivRef.current) {
                  audioRef.current.currentTime =
                    (event.nativeEvent.offsetX /
                      timeDivRef.current.clientWidth) *
                    duration;
                }
              }}
            >
              <div
                className={styles.play_control_bar_line_highlight}
                style={{ width: `${(current / duration) * 100}%` }}
              ></div>
              <div className={styles.play_control_bar_line_highdot}></div>
            </div>
            <p className={styles.play_control_bar_label_total}>
              {formatTime(duration)}
            </p>
          </div>
        </div>

        <div className={styles.playbar_operator}>
          <div className={styles.playbar_operator_volume}>
            {volume === 0 && (
              <VolumeMuteIcon
                className={styles.playbar_operator_volume_icon}
                onClick={() => {
                  if (volumeBakRef.current && audioRef.current) {
                    setVolume(volumeBakRef.current);
                    audioRef.current.volume = volumeBakRef.current;
                  }
                }}
              />
            )}
            {volume > 0 && volume < 0.5 && (
              <VolumeLowIcon
                onClick={mute}
                className={styles.playbar_operator_volume_icon}
              />
            )}
            {volume > 0.5 && (
              <VolumeHighIcon
                onClick={mute}
                className={styles.playbar_operator_volume_icon}
              />
            )}
            <div
              className={styles.playbar_operator_volume_line}
              ref={volumeDivRef}
              onClick={(event: MouseEvent<HTMLElement>) => {
                if (volumeDivRef.current && audioRef.current) {
                  const _volume =
                    event.nativeEvent.offsetX /
                    volumeDivRef.current.clientWidth;
                  setVolume(_volume);
                  audioRef.current.volume = _volume;
                }
              }}
            >
              <div
                className={styles.playbar_operator_volume_highlight}
                style={{ width: `${volume * 100}%` }}
              ></div>
            </div>
          </div>
          <PlayListIcon
            className={classnames(styles.playlist_icon, {
              [styles.playlist_icon_visible]: panelVisible,
            })}
            onClick={() => {
              dispatch(setPanelVisible(!panelVisible));
            }}
          />
        </div>
      </div>
      <PlayingList />
    </>
  );
};

export default Playbar;
