
// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

import cv, { Mat, } from "./OpenCV"; 

// 処理はここから始まる
document.addEventListener("DOMContentLoaded", (event: Event): void => {
	// ローディング開始
	const div: HTMLDivElement = document.createElement("div");
	div.innerHTML = "loading";
	document.getElementById("root")?.appendChild(div);

	// 画像処理キャンバス作成
	const canvas: HTMLCanvasElement = document.createElement("canvas");
	canvas.width = 256;
	canvas.height = 256;
	document.getElementById("root")?.appendChild(canvas);
	const context: CanvasRenderingContext2D | null = canvas.getContext("2d");
	if (context === null) { return; }

	// カメラデバイス取得
	window.navigator.mediaDevices.getUserMedia({
		video: true,
		audio: false,
	}).then(async (stream: MediaStream): Promise<void> => {
		// ビデオ設定
		const setting: MediaTrackSettings = stream.getVideoTracks()[0].getSettings();
		const settingWidth: number = setting.width || 100 ;
		const settingHeight: number = setting.height || 100;
		const video: HTMLVideoElement = document.createElement("video");
		document.getElementById("root")?.appendChild(video);
		video.width = Math.floor(100 * (settingWidth < settingHeight ? 1 : settingWidth / settingHeight));
		video.height = Math.floor(100 * (settingHeight < settingWidth ? 1 : settingHeight / settingWidth));
		video.srcObject = stream;
		video.play();

		// ロード中
		await new Promise((resolve: () => void, reject: (error: Error) => void): void => { cv.then((): void => { resolve(); }); });
		// ロード完了
		div.innerHTML = "start";

		// メインループ
		const matGray: Mat = new cv.Mat();
		const mainloop: FrameRequestCallback = (time: number): void => {
			// カメラから画像を抽出
			const aspectRatioVideo: number = video.videoWidth / video.videoHeight;
			const aspectRatioCanvas: number = canvas.width / canvas.height;
			const srcw: number = Math.floor(aspectRatioVideo < aspectRatioCanvas ? video.videoWidth : video.videoHeight * canvas.width / canvas.height);
			const srch: number = Math.floor(aspectRatioVideo > aspectRatioCanvas ? video.videoHeight : video.videoWidth * canvas.height / canvas.width);
			const srcx: number = Math.floor((video.videoWidth - srcw) / 2);
			const srcy: number = Math.floor((video.videoHeight - srch) / 2);
			context.drawImage(video, srcx, srcy, srcw, srch, 0, 0, canvas.width, canvas.height);

			// 白黒変換
			const src: Mat = cv.imread(canvas);
			cv.cvtColor(src, matGray, cv.COLOR_RGBA2GRAY, 0);
			cv.imshow(canvas, matGray);
			src.delete();

			window.requestAnimationFrame(mainloop);
		};

		window.requestAnimationFrame(mainloop);
	});
});

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

