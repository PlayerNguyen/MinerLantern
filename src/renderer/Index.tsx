import React from "react";
import * as ReactDOM from "react-dom/client";

import App from "./App";

import "./index.css";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

import AppSlice from "./store/AppSlice";
import HomeSlice from "./routes/Home/HomeSlice";

const store = configureStore({
  reducer: {
    App: AppSlice,
    Home: HomeSlice,
  },
});

const root = ReactDOM.createRoot(document.getElementById("app"));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
