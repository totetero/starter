 
// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

import * as React from "react";
import { ipcRenderer, IpcRendererEvent, } from "@renderer/electron";

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

const Component: React.FunctionComponent<{}> = (): JSX.Element => {
	return (
		<div style = {{
			display: "flex",
			flexDirection: "column",
			justifyContent: "center",
			alignItems: "center",
			position: "absolute",
			left: "0",
			right: "0",
			top: "0",
			bottom: "0",
		}}>
			<div>hello world</div>
			<button onClick={(): void => {
				new Promise((resolve: (response: string) => void): void => {
					ipcRenderer.once("reply", (event: IpcRendererEvent, response: string): void => resolve(response));
					ipcRenderer.send("message", "hoge");
				}).then((value: string): void => {
					console.log("reply", value);
				});
			}}>icp test (console)</button>
		</div>
	);
};

export default Component;

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

