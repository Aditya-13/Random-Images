    import { configureStore } from "@reduxjs/toolkit";
    import randomImagesReducer from "../features/randomImagesSlice";

    const store = configureStore({
    reducer: {
        randomImages: randomImagesReducer,
    },
    });

    export type RootState = ReturnType<typeof store.getState>;
    export type AppDispatch = typeof store.dispatch;

    export default store;
