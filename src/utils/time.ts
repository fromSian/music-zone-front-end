export const formatTime = (given_seconds: number) => {
  const dateObj = new Date(given_seconds * 1000);
  const hours = dateObj.getUTCHours();
  const minutes = dateObj.getUTCMinutes();
  const seconds = dateObj.getSeconds();

  const timeString =
    (hours ? hours.toString().padStart(2, "0") + ":" : "") +
    minutes.toString().padStart(2, "0") +
    ":" +
    seconds.toString().padStart(2, "0");
  return timeString;
};

export const formatSecondsString = (given_seconds: number) => {
  const dateObj = new Date(given_seconds * 1000);
  const hours = dateObj.getUTCHours();
  const minutes = dateObj.getUTCMinutes();
  const seconds = dateObj.getSeconds();

  const timeString =
    (hours ? hours.toString() + " 小时 " : "") +
    minutes.toString() +
    " 分钟 " +
    seconds.toString() +
    " 秒 ";
  return timeString;
};
