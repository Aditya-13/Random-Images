import React from "react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import randomImagesReducer from "./features/randomImagesSlice";
import RandonImages from "./components/RandomImages";

const store = configureStore({
  reducer: {
    randomImages: randomImagesReducer,
  },
});

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <div className="max-w-screen-lg mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Random Images from Unsplash</h1>
        <RandonImages/>
      </div>
    </Provider>
  );
};

export default App;
