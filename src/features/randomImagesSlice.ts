import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface RandomImagesState {
  data: Image[];
  status: "idle" | "loading" | "failed";
  error: string | null;
}

export interface Image {
  user: any;
  tags: any;
  id: string;
  description: string | null;
  alt_description: string | undefined;
  urls: {
    small: string;
  };
  width: number;
  height: number;
  created_at: string;
}

const initialState: RandomImagesState = {
  data: [],
  status: "idle",
  error: null,
};

const randomImagesSlice = createSlice({
  name: "randomImages",
  initialState,
  reducers: {
    imagesLoading(state) {
      state.status = "loading";
    },
    imagesReceived(state, action: PayloadAction<Image[]>) {
      state.data = action.payload;
      state.status = "idle";
      state.error = null;
    },
    imagesFailed(state, action: PayloadAction<string>) {
      state.status = "failed";
      state.error = action.payload;
    },
    deleteImages: (state, action: PayloadAction<string[]>) => {
        const deletedImageIds = action.payload;
        state.data = state.data.filter(image => !deletedImageIds.includes(image.id));
      },
  },
});

export const { imagesLoading, imagesReceived, imagesFailed, deleteImages } = randomImagesSlice.actions;

export default randomImagesSlice.reducer;

export const fetchRandomImages = (): any => async (dispatch : any) => {
  dispatch(imagesLoading());

  try {
    const response = await axios.get<Image[]>("https://api.unsplash.com/photos/random", {
      params: {
        count: 20,
        client_id: process.env.UNSPLASH_API_KEY,
      },
    });

    console.log(response.data)

    dispatch(imagesReceived(response.data));
  } catch (error : any) {
    dispatch(imagesFailed(error.message));
  }
};
