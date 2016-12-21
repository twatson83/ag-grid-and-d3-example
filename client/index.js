import React from 'react';
import {render} from "react-dom";
import { Provider } from "react-redux";
import configureStore from "./store";
import ReactDOM from "react-dom";
import App from './components/App';
import {init} from './api';
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap";

init(() => {

  const store = configureStore();

  render(
    <Provider store={store}>
      <App  />
    </Provider>, document.getElementById("app")
  );
});
