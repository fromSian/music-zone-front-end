import { SongType } from "@/types/musicInfo";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { shuffle } from "lodash";
import audio1 from "../asset/audios/sample1.m4a";
import audio2 from "../asset/audios/sample2.m4a";

interface InitialStateProps {
  listInAddOrder: SongType[];
  listInPlayOrder: SongType[];
  playingSong: SongType | null;
  panelVisible: boolean;
  isPlaying: boolean;
}

const initialState: InitialStateProps = {
  // 添加顺序的播放列表
  listInAddOrder: [
    {
      name: "你在烦恼什么",
      album: "你在烦恼什么",
      artist: "苏打绿",
      audio: audio1,
      id: 5,
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
      id: 5,
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
    id: 5,
  },
  // 播放列表面板是否可见
  panelVisible: false,
  // 是否播放中
  isPlaying: false,
};

export const playingListSlice = createSlice({
  name: "playingList",
  initialState: initialState,
  reducers: {
    changeAddList: (state, action: PayloadAction<SongType[]>) => {
      state.listInAddOrder = action.payload;
    },
    addOne: () => {},
    removeOne: (state, action: PayloadAction<string | number>) => {
      state.listInAddOrder = state.listInAddOrder.filter(
        (item) => item.id != action.payload
      );
      state.listInPlayOrder = state.listInPlayOrder.filter(
        (item) => item.id !== action.payload
      );
    },
    revertPlayingList: (state) => {
      state.listInPlayOrder = state.listInAddOrder;
    },
    shufflePlayingList: (state) => {
      state.listInPlayOrder = shuffle(state.listInAddOrder);
    },
    changePlayingListOrder: (state, action: PayloadAction<SongType[]>) => {
      state.listInPlayOrder = action.payload;
    },
    changePlayingSong: (state, action: PayloadAction<SongType>) => {
      state.playingSong = action.payload;
    },
    playNext: (state) => {
      const nowIndex = state.listInPlayOrder.findIndex(
        (item) => item.id === state.playingSong?.id
      );
      let nextIndex = nowIndex + 1;
      if (nextIndex === state.listInPlayOrder.length) {
        nextIndex = 0;
      }
      state.playingSong = state.listInPlayOrder[nextIndex];
    },
    playPrev: (state) => {
      const nowIndex = state.listInPlayOrder.findIndex(
        (item) => item.id === state.playingSong?.id
      );
      let prevIndex = nowIndex - 1;
      if (prevIndex < 0) {
        prevIndex = state.listInPlayOrder.length - 1;
      }
      state.playingSong = state.listInPlayOrder[prevIndex];
    },
    setPanelVisible: (state, action: PayloadAction<boolean>) => {
      state.panelVisible = action.payload;
    },
    setPlaying: (state, action: PayloadAction<boolean>) => {
      state.isPlaying = action.payload;
    },
    playOneAlbum: (
      state,
      action: PayloadAction<{ songs: SongType[]; isShuffle?: boolean }>
    ) => {
      let { songs, isShuffle } = action.payload;
      if (!songs) {
        songs = [];
      }
      state.listInAddOrder = songs;
      state.listInPlayOrder = isShuffle ? shuffle(songs) : songs;

      if (songs.length) {
        state.playingSong = state.listInPlayOrder[0];
        state.isPlaying = true;
      } else {
        state.playingSong = null;
        state.isPlaying = false;
      }
    },
  },
});

export const {
  playOneAlbum,
  changeAddList,
  addOne,
  removeOne,
  revertPlayingList,
  shufflePlayingList,
  changePlayingListOrder,
  changePlayingSong,
  playNext,
  playPrev,
  setPanelVisible,
  setPlaying,
} = playingListSlice.actions;

export default playingListSlice.reducer;
