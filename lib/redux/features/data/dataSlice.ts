import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { Post } from "@/app/type/posts";

const initialState: Post[] = [];

export const fetchSlice = createSlice({
  name: "fetchPost",
  initialState,
  reducers: {
    add: (state, action: PayloadAction<Post>) => {
      if (!state) state = [];
      state.push(action.payload);
    },
    setPosts: (state, action: PayloadAction<Post[]>) => {
      return action.payload;
    },
  },
});

export const { add, setPosts } = fetchSlice.actions;

export default fetchSlice.reducer;
