import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface InitialStateProps {
  loveOperationData: {
    // key: song.id
    // boolean: is loved
    [key: string]: boolean;
  };
}

const initialState: InitialStateProps = {
  loveOperationData: {},
};

export const loveSlice = createSlice({
  initialState,
  name: "收藏/取消收藏操作",
  reducers: {
    addLoveRecord: (
      state,
      action: PayloadAction<{ id: string; isLoved: boolean }>
    ) => {
      const { id, isLoved } = action.payload;
      state.loveOperationData[id] = isLoved;
    },
  },
});

export const { addLoveRecord } = loveSlice.actions;

export default loveSlice.reducer;
