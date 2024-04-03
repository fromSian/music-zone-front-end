import { useState } from "react";
import styles from "./Recently.module.less";

const Recently = () => {
  const [data, setData] = useState([
    {
      name: "1",
      id: 1,
      image: "",
    },
    {
      name: "2",
      id: 2,
      image: "",
    },
    {
      name: "3",
      id: 3,
      image: "",
    },
    {
      id: 4,
      name: "4",
      image: "",
    },
  ]);

  return (
    <div className={styles.recently}>
      <p className={styles.recently_header}>最近播放</p>

      <div className={styles.recently_content}>
        {data.map((item) => (
          <div className={styles.recently_content_item} key={item.id}>
            <div className={styles.recently_content_item_image}>
              <img alt={item.name} />
            </div>
            <p className={styles.recently_content_item_name}>{item.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recently;
