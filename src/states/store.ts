import { configureStore } from "@reduxjs/toolkit";
import loveReducer from "./loves.slice";
import playingReducer from "./playing.slice";
const store = configureStore({
  reducer: {
    playing: playingReducer,
    love: loveReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
