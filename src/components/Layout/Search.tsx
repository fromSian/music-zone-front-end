import { SearchResult, Songs } from "@/types/musicInfo";
import { getErrorMessage } from "@/utils/error";
import request from "@/utils/request";
import {
  CloseCircleOutlined,
  LoadingOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Empty } from "antd";
import classnames from "classnames";
import { useCallback, useRef, useState } from "react";
import styles from "./index.module.less";

const SearchBar = () => {
  const [isHide, setIsHide] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SearchResult>();
  const controllerRef = useRef<AbortController>();

  const search = useCallback(async () => {
    try {
      if (!searchText) {
        return;
      }
      setLoading(true);
      if (controllerRef.current) {
        controllerRef.current.abort();
        controllerRef.current = undefined;
      }

      controllerRef.current = new AbortController();
      const res = await request.post("/search/", { keyword: searchText });
      if (res && res.data) {
        setResult(res.data);
      }
    } catch (err) {
      getErrorMessage(err);
    } finally {
      setLoading(false);
    }
  }, [searchText]);

  return (
    <>
      <div
        className={classnames(styles.search, {
          [styles.search_expand]: !isHide,
        })}
        onMouseOver={() => {
          isHide && setIsHide(false);
        }}
        onMouseLeave={() => {
          !searchText && setIsHide(true);
        }}
      >
        <input
          className={styles.search_input}
          type="text"
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              search();
            }
          }}
        ></input>
        <LoadingOutlined
          className={classnames(styles.loading_icon, {
            [styles.loading_icon_show]: loading,
          })}
        />
        <CloseCircleOutlined
          className={classnames(styles.clear_icon, {
            [styles.clear_icon_show]: searchText,
          })}
          onClick={() => {
            setSearchText("");
          }}
        />

        <SearchOutlined className={styles.search_icon} onClick={search} />
      </div>
      <div
        className={classnames(styles.search_result, {
          [styles.search_result_expand]: !isHide && result,
        })}
      >
        {result &&
          (result.total ? (
            ["songs", "albums", "playlists"].map((key) => (
              <div
                key={`search_div${key}`}
                className={styles.search_result_list}
              >
                <p
                  key={`search_title${key}`}
                  className={styles.search_result_title}
                >
                  {key}
                </p>
                <ol key={`search_list${key}`}>
                  {result[key as "songs" | "albums" | "playlists"].map(
                    (item) => (
                      <li
                        key={`search_list${item.id}`}
                        className={styles.search_result_item}
                        onClick={() => {
                          if (key === "songs") {
                            window.open(
                              `/library/albums/${(item as Songs).album}/${
                                item.id
                              }`
                            );
                          } else {
                            window.open(`/library/${key}/${item.id}`);
                          }
                        }}
                      >
                        <p className={styles.search_result_item_name}>
                          {item.name}
                        </p>
                        {item.description && (
                          <p className={styles.search_result_item_description}>
                            {item.description}
                          </p>
                        )}
                      </li>
                    )
                  )}
                </ol>
              </div>
            ))
          ) : (
            <Empty />
          ))}
      </div>
    </>
  );
};

export default SearchBar;
