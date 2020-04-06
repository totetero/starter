
// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

import * as React from "react";
import * as ReactDOM from "react-dom";
import ComponentMain from "./ComponentMain";

// 処理はここから始まる
document.addEventListener("DOMContentLoaded", (event: Event): void => {
	ReactDOM.render(React.createElement(ComponentMain), document.getElementById("app"));
});

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

