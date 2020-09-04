
// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

import { app, BrowserWindow, ipcMain, IpcMainEvent, } from "electron";

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

let mainWindow: BrowserWindow | null = null;

app.on("ready", (): void => {
	create();
});

app.on("activate", (): void => {
	if (mainWindow !== null) { return; }
	create();
});

app.on("window-all-closed", (): void => {
	app.quit();
});

const create = (): void => {
	mainWindow = new BrowserWindow({
		width: 800,
		height: 400,
		webPreferences: {
			preload: `${__dirname}/preload.js`,
		},
	});
	mainWindow.loadURL(`file://${__dirname}/index.html`);
	mainWindow.on("closed", (): void => { mainWindow = null; });
	//mainWindow.webContents.openDevTools();
};

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

ipcMain.on("message", (event: IpcMainEvent, value: string): void => {
	console.log("message", value);
	event.sender.send("reply", "fuga");
});

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

