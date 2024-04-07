import { AlbumListItem, ListResult } from "@/types/musicInfo";
import { getErrorMessage } from "@/utils/error";
import request from "@/utils/request";
import { LeftCircleTwoTone, RightCircleTwoTone } from "@ant-design/icons";
import { Empty, Spin } from "antd";
import { AxiosResponse } from "axios";
import classnames from "classnames";
import { map } from "lodash";
import { MouseEvent, useCallback, useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import styles from "./index.module.less";

const BannerItem = ({
  item,
  onMouseOver,
  onMouseLeave,
  onClick,
}: {
  item: AlbumListItem;
  onMouseOver: (e: MouseEvent) => void;
  onMouseLeave: (e: MouseEvent) => void;
  onClick: (e: MouseEvent) => void;
}) => {
  return (
    <>
      <div
        className={styles.banner_item}
        onMouseOver={onMouseOver}
        onMouseLeave={onMouseLeave}
        onClick={onClick}
      >
        <div className={styles.banner_item_image}>
          <img
            src={item.image}
            className={styles.banner_item_image_main}
            title={item.name}
          />
          <img
            src={item.image}
            className={styles.banner_item_image_back}
            title={item.name}
          />
        </div>

        <p className={styles.banner_item_title}>
          {item.name} - {map(item.artist, "name").join(",")}
        </p>
        {}
      </div>
    </>
  );
};

const interval = 3000;
const animationTime = 1000;

const page = 1;
const size = 5;

const Banner = () => {
  const [bannerData, setBannerData] = useState<AlbumListItem[]>([]);

  const [currentIndex, setCurrentIndex] = useState(-1);
  const [translateX, setTranslateX] = useState<number>(0);

  const [isAnimate, setIsAnimate] = useState(true);

  const animateRef = useRef<ReturnType<typeof setInterval>>();
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const { isLoading, isFetching, isSuccess, data } = useQuery({
    queryKey: ["albums-banner", { page, size }] as const,
    queryFn: async ({ queryKey }) => {
      try {
        const [_key, { page, size }] = queryKey;
        const result: AxiosResponse<ListResult<AlbumListItem>> =
          await request.get(`/albums/?page=${page}&size=${size}`);
        return result.data.results;
      } catch (err) {
        console.log(getErrorMessage(err));
      }
    },
  });

  useEffect(() => {
    if (isSuccess && data?.length) {
      const _bannerData = [data[data.length - 1], ...data, data[0]];
      setBannerData(_bannerData);
      setCurrentIndex(1);
      setTranslateX((-100 / _bannerData.length) * 1);
    } else {
      setBannerData([]);
    }
  }, [isSuccess, data]);

  const move = useCallback(
    (end: number) => {
      const per = 100 / bannerData.length;
      setTranslateX(-per * end);
      setCurrentIndex(end);
    },
    [bannerData]
  );

  const next = useCallback(() => {
    if (currentIndex === bannerData.length - 2) {
      setTimeout(() => {
        setIsAnimate(false);
        move(1);
      }, animationTime);
    } else {
      setIsAnimate(true);
    }
    move(currentIndex + 1);
  }, [currentIndex, bannerData]);

  useEffect(() => {
    animateRef.current && clearInterval(animateRef.current);
    timeoutRef.current && clearTimeout(timeoutRef.current);
    animateRef.current = undefined;
    timeoutRef.current = undefined;
    // animateRef.current = setInterval(next, interval)

    return () => {
      animateRef.current && clearInterval(animateRef.current);
      animateRef.current = undefined;
    };
  }, [next]);

  const onMouseOver = () => {
    animateRef.current && clearInterval(animateRef.current);
    timeoutRef.current && clearTimeout(timeoutRef.current);
    animateRef.current = undefined;
    timeoutRef.current = undefined;
  };

  const onMouseLeave = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      animateRef.current = setInterval(next, interval);
    }, interval);
  }, [next]);

  const handleGoTo = useCallback((id: string) => {
    window.open(`/library/albums/${id}`);
  }, []);

  return (
    <div className={styles.banner}>
      {isLoading || isFetching ? (
        <Spin />
      ) : (
        <>
          {bannerData && bannerData.length ? (
            <>
              <LeftCircleTwoTone
                twoToneColor={[
                  "rgba(1, 1, 1, 0.6)",
                  "rgba(255, 255, 255, 0.8)",
                ]}
                className={classnames(
                  styles.banner_direction_icon,
                  styles.banner_left_icon
                )}
                onClick={() => {
                  if (currentIndex === 1) {
                    setTimeout(() => {
                      setIsAnimate(false);
                      move(bannerData.length - 2);
                    }, animationTime);
                  } else {
                    setIsAnimate(true);
                  }
                  move(currentIndex - 1);
                }}
              />
              <RightCircleTwoTone
                twoToneColor={[
                  "rgba(1, 1, 1, 0.6)",
                  "rgba(255, 255, 255, 0.8)",
                ]}
                className={classnames(
                  styles.banner_direction_icon,
                  styles.banner_right_icon
                )}
                onClick={() => {
                  if (currentIndex === bannerData.length - 2) {
                    setTimeout(() => {
                      setIsAnimate(false);
                      move(1);
                    }, animationTime);
                  } else {
                    setIsAnimate(true);
                  }
                  move(currentIndex + 1);
                }}
              />
              <div
                className={classnames(styles.banner_content, {
                  [styles.transition]: isAnimate,
                })}
                style={{
                  transform: `translateX(${translateX}%)`,
                }}
              >
                {bannerData.map((item, index) => (
                  <BannerItem
                    onMouseOver={onMouseOver}
                    onMouseLeave={onMouseLeave}
                    onClick={() => handleGoTo(item.id)}
                    key={`banner_item${index}`}
                    item={item}
                  />
                ))}
              </div>
            </>
          ) : (
            <Empty />
          )}
        </>
      )}
    </div>
  );
};

export default Banner;
