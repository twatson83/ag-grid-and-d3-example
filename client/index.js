import React from 'react';
import ReactDOM from "react-dom";
import App from './components/app';
import {init} from './apis/finance';
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap";

init(() => {
  ReactDOM.render(<App />, document.getElementById("app"));
});
