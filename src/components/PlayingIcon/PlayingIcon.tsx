import classnames from "classnames";
import { CSSProperties } from "react";
import styles from "./PlayingIcon.module.less";

const PlayingIcon = ({
  className,
  isAnimate = false,
  style,
  onClick,
}: {
  isAnimate?: boolean;
  className?: string;
  style?: { [key: string]: CSSProperties };
  onClick?: () => void;
}) => {
  return (
    <>
      <div
        className={classnames(styles.circle, className, {
          [styles.animate]: isAnimate,
        })}
        {...style}
        onClick={onClick}
      >
        {Array.from({ length: 3 }).map((_, index) => (
          <div className={styles.rect} key={`rect${index}`} />
        ))}
      </div>
    </>
  );
};

export default PlayingIcon;
