import { configureStore } from "@reduxjs/toolkit";
import playingReducer from './playing.slice';
const store =  configureStore({
    reducer: {
        playing: playingReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store;