import { useAppDispatch, useAppSelector } from "@/states/hooks";
import { playNext, playPrev } from "@/states/playing.slice";
import {
  HeartOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
  StepBackwardOutlined,
  StepForwardOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { Spin, Tooltip } from "antd";
import classnames from "classnames";
import { MouseEvent, useEffect, useRef, useState } from "react";
import { BsFillMusicPlayerFill } from "react-icons/bs";
import { FaVolumeDown, FaVolumeMute, FaVolumeUp } from "react-icons/fa";
import { LiaRandomSolid } from "react-icons/lia";
import { LuRepeat, LuRepeat1 } from "react-icons/lu";
import PlayingList from "./PlayingList";
import styles from "./playbar.module.less";

/**
 * 0 = 顺序循环
 * 1 = 乱序循环
 * 2 = 单曲循环
 */
export type playingSortType = 0 | 1 | 2;

const Playbar = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const volumeDivRef = useRef<HTMLDivElement | null>(null);
  const timeDivRef = useRef<HTMLDivElement | null>(null);
  const namePRef = useRef<HTMLParagraphElement | null>(null);
  const nameDivRef = useRef<HTMLDivElement | null>(null);
  const nameIntervalRef = useRef<ReturnType<typeof setInterval>>();

  const [nameLeft, setNameLeft] = useState<number>(0);

  const [playingSortType, setPlayingSortType] = useState<playingSortType>(0);

  const [isReady, setIsReady] = useState(true);
  const [isPlay, setIsPlay] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [volume, setVolume] = useState<number>(0);

  const [duration, setDuration] = useState<number>(0);
  const [current, setCurrent] = useState<number>(0);

  const volumeBakRef = useRef<number>();

  const {
    listInAddOrder,
    listInPlayOrder,
    playingSong: song,
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
      return;
    }

    setIsReady(false);
    if (!audioRef.current) {
      return;
    }
    // audioRef.current.src = new URL(song.audio, import.meta.url).href;
    audioRef.current.src = song.audio;
    audioRef.current?.load();

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
    return () => {
      audioRef.current?.removeEventListener("canplay", ready);
      audioRef.current?.removeEventListener("timeupdate", update);
      audioRef.current?.removeEventListener("seeking", seeking);
      audioRef.current?.removeEventListener("seeked", seeked);
      audioRef.current?.removeEventListener("ended", ended);
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
    isPlay ? audioRef.current?.play() : audioRef.current?.pause();
  }, [isPlay, song]);

  const formatTime = (given_seconds: number) => {
    const dateObj = new Date(given_seconds * 1000);
    const hours = dateObj.getUTCHours();
    const minutes = dateObj.getUTCMinutes();
    const seconds = dateObj.getSeconds();

    const timeString = hours
      ? hours.toString().padStart(2, "0") + ":"
      : "" +
        minutes.toString().padStart(2, "0") +
        ":" +
        seconds.toString().padStart(2, "0");
    return timeString;
  };

  return (
    <div
      className={classnames(styles.playbar, {
        [styles.playbar_inactive]: !isReady || isLoading,
      })}
    >
      <audio loop={playingSortType === 2} ref={audioRef}></audio>
      <div className={styles.playbar_album_image}>
        <BsFillMusicPlayerFill className={styles.playbar_album_image_main} />
        {isLoading && <Spin className={styles.playbar_album_image_loading} />}
      </div>
      {song && (
        <div className={styles.playbar_info}>
          <Tooltip title={song.name}>
            <div className={styles.playbar_info_name_wrap} ref={nameDivRef}>
              {/* 跑马灯 */}
              <p
                ref={namePRef}
                className={styles.playbar_info_name}
                style={{ left: nameLeft }}
              >
                {song.name}
              </p>
            </div>
          </Tooltip>
          <Tooltip title={song.album}>
            <p className={styles.playbar_info_album}>{song.album}</p>
          </Tooltip>
          <Tooltip title={song.artist}>
            <p className={styles.playbar_info_artist}>{song.artist}</p>
          </Tooltip>
        </div>
      )}

      <div className={styles.play_control}>
        <div className={styles.play_control_switch}>
          <HeartOutlined className={styles.play_control_switch_icon} />
          <StepBackwardOutlined
            className={styles.play_control_switch_icon}
            onClick={() => dispatch(playPrev())}
          />
          {!isPlay ? (
            <PlayCircleOutlined
              className={classnames(
                styles.play_control_switch_icon,
                styles.play_control_switch_play
              )}
              onClick={() => setIsPlay((v) => !v)}
            />
          ) : (
            <PauseCircleOutlined
              className={classnames(
                styles.play_control_switch_icon,
                styles.play_control_switch_play
              )}
              onClick={() => setIsPlay((v) => !v)}
            />
          )}
          <StepForwardOutlined
            className={styles.play_control_switch_icon}
            onClick={() => dispatch(playNext())}
          />
          <div
            onClick={() =>
              setPlayingSortType((v) => (v > 1 ? 0 : v + 1) as playingSortType)
            }
          >
            {/* 顺序循环 */}
            {playingSortType === 0 && (
              <LuRepeat className={styles.play_control_switch_icon} />
            )}
            {/* 单曲循环 */}
            {playingSortType === 2 && (
              <LuRepeat1 className={styles.play_control_switch_icon} />
            )}
            {/* 乱序播放 */}
            {playingSortType === 1 && (
              <LiaRandomSolid className={styles.play_control_switch_icon} />
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
                  (event.nativeEvent.offsetX / timeDivRef.current.clientWidth) *
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
            <FaVolumeMute
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
            <FaVolumeDown
              onClick={mute}
              className={styles.playbar_operator_volume_icon}
            />
          )}
          {volume > 0.5 && (
            <FaVolumeUp
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
                  event.nativeEvent.offsetX / volumeDivRef.current.clientWidth;
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
        <Tooltip trigger={"click"} title={<PlayingList />}>
          <UnorderedListOutlined />
        </Tooltip>
      </div>
    </div>
  );
};

export default Playbar;
