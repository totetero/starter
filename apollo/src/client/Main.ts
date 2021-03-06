
// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./App";

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

// 処理はここから始まる
document.addEventListener("DOMContentLoaded", (event: Event): void => {
	ReactDOM.render(React.createElement(App), document.getElementById("app"));
});

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

