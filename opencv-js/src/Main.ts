
// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

import cv, { OpenCVModule, Mat, } from "./OpenCV"; 

// 処理はここから始まる
document.addEventListener("DOMContentLoaded", (event: Event): void => {
	// ローディング開始
	const div: HTMLDivElement = document.createElement("div");
	div.innerHTML = "loading";
	document.getElementById("root")?.appendChild(div);

	// 画像処理キャンバス作成
	const canvasSrc: HTMLCanvasElement = document.createElement("canvas");
	const canvasDst: HTMLCanvasElement = document.createElement("canvas");
	canvasSrc.width = canvasDst.width = 320;
	canvasSrc.height = canvasDst.height = 240;
	document.getElementById("root")?.appendChild(canvasSrc);
	document.getElementById("root")?.appendChild(canvasDst);
	const context: CanvasRenderingContext2D | null = canvasSrc.getContext("2d");
	if (context === null) { return; }

	// カメラデバイス取得
	window.navigator.mediaDevices.getUserMedia({
		video: true,
		audio: false,
	}).then((stream: MediaStream): void => {
		// ビデオ設定
		const video: HTMLVideoElement = document.createElement("video");
		document.getElementById("root")?.appendChild(video);
		video.width = 100;
		video.height = 100;
		video.srcObject = stream;
		video.play();

		cv.then((cv: OpenCVModule): void => {
			// ローディング完了
			div.innerHTML = "start";

			// メインループ
			const mainloop: FrameRequestCallback = (time: number): void => {
				context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight, 0, 0, canvasSrc.width, canvasSrc.height);
				const src: Mat = cv.imread(canvasSrc);
				const dst: Mat = new cv.Mat();
				cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY, 0);
				cv.imshow(canvasDst, dst);
				src.delete();
				dst.delete();
				window.requestAnimationFrame(mainloop);
			};

			window.requestAnimationFrame(mainloop);
		});
	});
});

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

