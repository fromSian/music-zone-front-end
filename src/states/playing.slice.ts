import { Song } from "@/types/musicInfo";
import { PlayingSortType } from "@/types/playInfo";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { message } from "antd";
import { shuffle } from "lodash";
interface InitialStateProps {
  listInAddOrder: Song[];
  listInPlayOrder: Song[];
  playingSong: Song | null;
  panelVisible: boolean;
  isPlaying: boolean;
  playingSortType: PlayingSortType;
}

const initialState: InitialStateProps = {
  // 添加顺序的播放列表
  listInAddOrder: [],
  // 播放顺序的列表
  listInPlayOrder: [],
  // 当前播放曲目索引
  playingSong: null,
  // 播放列表面板是否可见
  panelVisible: false,
  // 是否播放中
  isPlaying: false,
  // 播放模式
  playingSortType: PlayingSortType.InOrder,
};

export const addRecord = createAsyncThunk("users/addRecord", async () => {
  return 1;
});

export const likeASong = createAsyncThunk("users/likeASong", async () => {
  return 2;
});

export const playingListSlice = createSlice({
  name: "playingList",
  initialState: initialState,
  reducers: {
    changeAddList: (state, action: PayloadAction<Song[]>) => {
      state.listInAddOrder = action.payload;
    },
    addOne: (
      state,
      action: PayloadAction<{ song: Song; isPlayNow?: boolean }>
    ) => {
      let { song, isPlayNow } = action.payload;
      const isExist = state.listInAddOrder.find((item) => item.id === song.id);
      if (isExist) {
        if (isPlayNow) {
          state.playingSong = song;
          state.isPlaying = true;
        } else {
          message.error("播放列表中已存在");
        }
        return;
      }

      state.listInAddOrder = [...state.listInAddOrder, song];

      if (state.playingSortType === PlayingSortType.Random) {
        state.listInPlayOrder = shuffle(state.listInAddOrder);
      } else {
        state.listInPlayOrder = [...state.listInPlayOrder, song];
      }

      if (isPlayNow) {
        state.playingSong = song;
        state.isPlaying = true;
      }
    },
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
    changePlayingListOrder: (state, action: PayloadAction<Song[]>) => {
      state.listInPlayOrder = action.payload;
    },
    changePlayingSong: (state, action: PayloadAction<Song>) => {
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
      action: PayloadAction<{ songs: Song[]; isShuffle?: boolean }>
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
    changePlayingSortType: (state, action: PayloadAction<number>) => {
      state.playingSortType = action.payload;
    },
    clearAll: (state) => {
      state.isPlaying = false;
      state.playingSong = null;
      state.listInAddOrder = [];
      state.listInPlayOrder = [];
    },
    //  排行榜、专辑、歌单收藏或取消收藏时同步playbar、playlist状态
    updateLoveOrNot: () => {
      // state.playingSortType = action.payload;
    },
  },
  extraReducers(builder) {
    builder.addCase(likeASong.fulfilled, () => {});
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
  changePlayingSortType,
  clearAll,
  updateLoveOrNot,
} = playingListSlice.actions;

export default playingListSlice.reducer;
