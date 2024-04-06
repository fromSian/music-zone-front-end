/**
 * Icon 集中导出，方便修改和复用
 */

import {
  DeleteOutlined,
  HeartOutlined,
  HeartTwoTone,
  PauseCircleOutlined,
  PlayCircleOutlined,
  PlusCircleOutlined,
  StepBackwardOutlined,
  StepForwardOutlined,
  TrademarkCircleTwoTone,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { ComponentProps } from "react";
import { FaVolumeDown, FaVolumeMute, FaVolumeUp } from "react-icons/fa";
import { LiaRandomSolid } from "react-icons/lia";
import { LuRepeat, LuRepeat1 } from "react-icons/lu";

/**
 * 线框爱心
 */
export const HeartLineIcon = (props: ComponentProps<typeof HeartOutlined>) => (
  <HeartOutlined {...props} />
);

/**
 * 实心爱心
 */
export const HeartFullIcon = (props: ComponentProps<typeof HeartTwoTone>) => (
  <HeartTwoTone {...props} />
);

/**
 * 播放
 */
export const PlayIcon = (props: ComponentProps<typeof PlayCircleOutlined>) => (
  <PlayCircleOutlined {...props} />
);

/**
 * 暂停
 */
export const PauseIcon = (
  props: ComponentProps<typeof PauseCircleOutlined>
) => <PauseCircleOutlined {...props} />;

/**
 * 下一首
 */
export const PlayNextIcon = (
  props: ComponentProps<typeof StepForwardOutlined>
) => <StepForwardOutlined {...props} />;

/**
 * 上一首
 */
export const PlayPrevIcon = (
  props: ComponentProps<typeof StepBackwardOutlined>
) => <StepBackwardOutlined {...props} />;

/**
 * 顺序播放
 */
export const PlayModeOrderIcon = (props: ComponentProps<typeof LuRepeat>) => (
  <LuRepeat {...props} />
);

/**
 * 单曲循环
 */
export const PlayModeOneIcon = (props: ComponentProps<typeof LuRepeat1>) => (
  <LuRepeat1 {...props} />
);

/**
 * 乱序循环
 */
export const PlayModeShuffleIcon = (
  props: ComponentProps<typeof LiaRandomSolid>
) => <LiaRandomSolid {...props} />;

/**
 * 静音
 */
export const VolumeMuteIcon = (props: ComponentProps<typeof FaVolumeMute>) => (
  <FaVolumeMute {...props} />
);

/**
 * 小音量
 */
export const VolumeLowIcon = (props: ComponentProps<typeof FaVolumeDown>) => (
  <FaVolumeDown {...props} />
);

/**
 * 大音量
 */
export const VolumeHighIcon = (props: ComponentProps<typeof FaVolumeUp>) => (
  <FaVolumeUp {...props} />
);

/**
 * 播放列表
 */
export const PlayListIcon = (
  props: ComponentProps<typeof UnorderedListOutlined>
) => <UnorderedListOutlined {...props} />;

/**
 * 删除
 */
export const DeleteIcon = (props: ComponentProps<typeof DeleteOutlined>) => (
  <DeleteOutlined {...props} />
);

/**
 * 添加
 */
export const AddIcon = (props: ComponentProps<typeof PlusCircleOutlined>) => (
  <PlusCircleOutlined {...props} />
);

export const PlayRecordDefaultIcon = (
  props: ComponentProps<typeof TrademarkCircleTwoTone>
) => <TrademarkCircleTwoTone {...props} />;
