import classnames from "classnames";
import styles from "./PlayingIcon.module.less";
const PlayingIcon: React.FC<{ className: string }> = ({ className }) => {
  return (
    <>
      <div className={classnames(styles.circle, className)}>
        {Array.from({ length: 3 }).map((_) => (
          <div className={styles.rect} />
        ))}
      </div>
    </>
  );
};

export default PlayingIcon;
