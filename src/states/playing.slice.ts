import { SongType } from "@/types/musicInfo";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { shuffle } from "lodash";
import audio1 from "../asset/audios/sample1.m4a";
import audio2 from "../asset/audios/sample2.m4a";

interface InitialStateProps {
  listInAddOrder: SongType[];
  listInPlayOrder: SongType[];
  playingSong: SongType;
}

const initialState: InitialStateProps = {
  // 添加顺序的播放列表
  listInAddOrder: [
    {
      name: "你在烦恼什么",
      album: "你在烦恼什么",
      artist: "苏打绿",
      audio: audio1,
      id: 0,
    },
    {
      name: "起来",
      album: "小宇宙",
      artist: "苏打绿",
      audio: audio2,
      id: 1,
    },
    {
      name: "起来2",
      album: "小宇宙",
      artist: "苏打绿",
      audio: audio2,
      id: 2,
    },
    {
      name: "起来3",
      album: "小宇宙",
      artist: "苏打绿",
      audio: audio2,
      id: 3,
    },
  ],
  // 播放顺序的列表
  listInPlayOrder: [
    {
      name: "你在烦恼什么",
      album: "你在烦恼什么",
      artist: "苏打绿",
      audio: audio1,
      id: 0,
    },
    {
      name: "起来",
      album: "小宇宙",
      artist: "苏打绿",
      audio: audio2,
      id: 1,
    },
    {
      name: "起来2",
      album: "小宇宙",
      artist: "苏打绿",
      audio: audio2,
      id: 2,
    },
    {
      name: "起来3",
      album: "小宇宙",
      artist: "苏打绿",
      audio: audio2,
      id: 3,
    },
  ],
  // 当前播放曲目索引
  playingSong: {
    name: "你在烦恼什么",
    album: "你在烦恼什么",
    artist: "苏打绿",
    audio: audio1,
    id: 0,
  },
};

export const playingListSlice = createSlice({
  name: "playingList",
  initialState: initialState,
  reducers: {
    addTolistInAddOrder: (state, action: PayloadAction<SongType>) => {
      state.listInAddOrder.push(action.payload);
    },
    removeFromListInAddOrder: (state, action: PayloadAction<SongType>) => {
      const newList = state.listInAddOrder.filter(
        (item) => item != action.payload
      );
      state.listInAddOrder = newList;
    },
    revertPlayingList: (state) => {
      state.listInPlayOrder = state.listInAddOrder;
    },
    shufflePlayingList: (state) => {
      state.listInPlayOrder = shuffle(state.listInAddOrder);
    },
    changePlayingSong: (state, action: PayloadAction<SongType>) => {
      state.playingSong = action.payload;
    },
    playNext: (state) => {
      const nowIndex = state.listInPlayOrder.findIndex(
        (item) => item.id === state.playingSong.id
      );
      let nextIndex = nowIndex + 1;
      if (nextIndex === state.listInPlayOrder.length) {
        nextIndex = 0;
      }
      state.playingSong = state.listInPlayOrder[nextIndex];
    },
    playPrev: (state) => {
      const nowIndex = state.listInPlayOrder.findIndex(
        (item) => item.id === state.playingSong.id
      );
      let prevIndex = nowIndex - 1;
      if (prevIndex < 0) {
        prevIndex = state.listInPlayOrder.length - 1;
      }
      state.playingSong = state.listInPlayOrder[prevIndex];
    },
  },
});

export const {
  addTolistInAddOrder,
  removeFromListInAddOrder,
  revertPlayingList,
  shufflePlayingList,
  changePlayingSong,
  playNext,
  playPrev,
} = playingListSlice.actions;

export default playingListSlice.reducer;
