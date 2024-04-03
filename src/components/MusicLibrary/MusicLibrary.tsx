import { Divider, Spin, Tag } from "antd";
import { map } from "lodash";
import { useCallback, useEffect, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import styles from "./MusicLibrary.module.less";

interface DataType {
  gender: string;
  name: {
    title: string;
    first: string;
    last: string;
  };
  email: string;
  picture: {
    large: string;
    medium: string;
    thumbnail: string;
  };
  nat: string;
}

const typeOptions = [
  {
    label: "专辑",
    key: "album",
    disabled: false,
  },
  {
    label: "歌单",
    key: "playlist",
    disabled: true,
  },
  {
    label: "艺人",
    key: "artist",
    disabled: true,
  },
];

const MusicLibrary = () => {
  const contentDivRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<DataType[]>([]);

  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const loadMoreData = () => {
    console.log(loading);
    if (loading) {
      return;
    }
    setLoading(true);
    fetch(
      "https://randomuser.me/api/?results=10&inc=name,gender,email,nat,picture&noinfo"
    )
      .then((res) => res.json())
      .then((body) => {
        setData([...data, ...body.results]);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadMoreData();
  }, []);

  const handleTagChange = useCallback(
    (tag: (typeof typeOptions)[0], checked: boolean) => {
      if (tag.disabled) {
        return;
      }
      if (checked) {
        setSelectedTags((v) => [...v, tag.key]);
      } else {
        setSelectedTags((v) => v.filter((item) => item !== tag.key));
      }
    },
    []
  );

  return (
    <div className={styles.music_library}>
      <div className={styles.music_library_header}>
        <div className={styles.music_library_header_tags}>
          <Tag.CheckableTag
            key={"all"}
            checked={
              selectedTags.length ===
              typeOptions.filter((item) => !item.disabled).length
            }
            onChange={(checked) => {
              if (checked) {
                setSelectedTags(
                  map(
                    typeOptions.filter((item) => !item.disabled),
                    "key"
                  )
                );
              } else {
                setSelectedTags([]);
              }
            }}
          >
            全选
          </Tag.CheckableTag>
          {typeOptions.map((tag) => (
            <Tag.CheckableTag
              className={tag.disabled ? styles.tag_disabled : ""}
              key={tag.key}
              checked={selectedTags.includes(tag.key)}
              onChange={(checked) => handleTagChange(tag, checked)}
            >
              {tag.label}
            </Tag.CheckableTag>
          ))}
        </div>
      </div>
      <div
        className={styles.music_library_content}
        ref={contentDivRef}
        id="scrollContent"
      >
        <InfiniteScroll
          dataLength={data.length}
          next={loadMoreData}
          hasMore={data.length < 50}
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
              >
                <div className={styles.music_library_content_list_item_image}>
                  <img
                    src={item.picture.large}
                    className={
                      styles.music_library_content_list_item_image_main
                    }
                  />
                </div>

                <p className={styles.music_library_content_list_item_name}>
                  {item.name.last}
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
