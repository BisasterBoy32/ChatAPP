import App from "./components/app";
import React from "react";
import ReactDOM from "react-dom";
import GlobalStore from "./store";

ReactDOM.render(
    <GlobalStore>
        <App />
    </GlobalStore> ,document.querySelector(".main")
)